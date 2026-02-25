<?php

/**
 * problem: https://medium.com/@_sidharth_m_/how-to-avoid-cache-stampede-or-dogpile-problem-upon-cache-expiry-370ecc06b76c
 * idea: https://claude.ai/chat/d6ee38d3-961d-42bf-b371-e58a9a331fa9
 * discord: https://discord.com/channels/1128520544824868874/1376435858810339411/1395223720145981522
 *
 * // routes/web.php
 *
 * // Basic usage - auto cache key, 5min cache, 2min lock timeout
 * Route::get('/slow-page', [PageController::class, 'slowPage'])
 *     ->middleware('prevent.stampede');
 *
 * // Custom cache key with 10min cache
 * Route::get('/reports/heavy', [ReportController::class, 'heavyReport'])
 *     ->middleware('prevent.stampede:heavy_report,600');
 *
 * // Full customization: cache key, 10min cache, 3min lock timeout
 * Route::get('/analytics', [AnalyticsController::class, 'dashboard'])
 *     ->middleware('prevent.stampede:analytics_dashboard,600,180');
 *
 * // Apply to route groups
 * Route::middleware('prevent.stampede')->group(function () {
 *     Route::get('/dashboard', [DashboardController::class, 'index']);
 *     Route::get('/reports', [ReportController::class, 'index']);
 *     Route::get('/analytics', [AnalyticsController::class, 'show']);
 * });
 *
 * // Different cache times for different routes
 * Route::middleware('prevent.stampede:user_profile,1800')->group(function () {
 *     Route::get('/profile', [ProfileController::class, 'show']);
 * });
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class PreventStampede
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|null  $cacheKey
     * @param  int  $timeout
     * @param  int  $lockTimeout
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ?string $cacheKey = null, int $timeout = 300, int $lockTimeout = 120): Response
    {
        // Generate cache key from request if not provided
        $cacheKey = $cacheKey ?: $this->generateCacheKey($request);

        // Check if we already have a cached response
        $cachedData = Cache::get($cacheKey);

        if ($cachedData) {
            $response = new \Illuminate\Http\Response(
                $cachedData['content'],
                $cachedData['status'],
                $cachedData['headers']
            );

            // Add debug info if enabled
            if (config('app.debug')) {
                $response = $this->addDebugInfo($response, $cachedData['cached_at'], $timeout, 'cached', $cacheKey);
            }

            return $response;
        }

        // Try to use Cache::block() for supported drivers (Redis, Memcached)
        if ($this->supportsBlocking()) {
            return $this->handleWithBlocking($request, $next, $cacheKey, $timeout, $lockTimeout);
        }

        // Fallback to manual locking for file cache and other drivers
        return $this->handleWithManualLocking($request, $next, $cacheKey, $timeout, $lockTimeout);
    }

    /**
     * Handle request using Cache::block() for supported drivers.
     */
    private function handleWithBlocking(Request $request, Closure $next, string $cacheKey, int $timeout, int $lockTimeout): Response
    {
        try {
            $result = Cache::block("stampede_lock:{$cacheKey}", $lockTimeout, function () use ($next, $request, $cacheKey, $timeout) {
                return Cache::remember($cacheKey, $timeout, function () use ($next, $request, $timeout, $cacheKey) {
                    $response = $next($request);

                    // Only cache successful responses
                    if ($this->shouldCache($response)) {
                        $cachedAt = now();

                        // Add debug info if enabled
                        if (config('app.debug')) {
                            $response = $this->addDebugInfo($response, $cachedAt, $timeout, 'fresh', $cacheKey);
                        }

                        return [
                            'content' => $response->getContent(),
                            'status' => $response->getStatusCode(),
                            'headers' => $response->headers->all(),
                            'cached_at' => $cachedAt,
                        ];
                    }

                    // Don't cache error responses
                    Cache::forget($cacheKey);
                    return [
                        'content' => $response->getContent(),
                        'status' => $response->getStatusCode(),
                        'headers' => $response->headers->all(),
                        'cached_at' => now(),
                    ];
                });
            });
            if ($result && isset($result['content'])) {
                $response = new \Illuminate\Http\Response(
                    $result['content'],
                    $result['status'],
                    $result['headers']
                );
                if (config('app.debug')) {
                    $response = $this->addDebugInfo($response, $result['cached_at'], $timeout, 'cached', $cacheKey);
                }
                return $response;
            }
            return response('Cache error', 500);
        } catch (\Illuminate\Contracts\Cache\LockTimeoutException $e) {
            return $this->handleLockTimeout($cacheKey);
        }
    }

    /**
     * Handle request using manual locking for file cache and other drivers.
     */
    private function handleWithManualLocking(Request $request, Closure $next, string $cacheKey, int $timeout, int $lockTimeout): Response
    {
        $lockKey = "stampede_lock:{$cacheKey}";
        $lock = Cache::lock($lockKey, $lockTimeout);

        if ($lock->get()) {
            try {
                // Double-check cache in case another process cached it while we were waiting
                $cachedData = Cache::get($cacheKey);
                if ($cachedData) {
                    $response = new \Illuminate\Http\Response(
                        $cachedData['content'],
                        $cachedData['status'],
                        $cachedData['headers']
                    );

                    // Add debug info if enabled
                    if (config('app.debug')) {
                        $response = $this->addDebugInfo($response, $cachedData['cached_at'], $timeout, 'cached', $cacheKey);
                    }

                    return $response;
                }

                // Process the request
                $response = $next($request);
                $cachedAt = now();

                // Only cache successful responses
                // if ($this->shouldCache($response)) {
                if (true) {
                    $cacheData = [
                        'content' => $response->getContent(),
                        'status' => $response->getStatusCode(),
                        'headers' => $response->headers->all(),
                        'cached_at' => $cachedAt,
                    ];
                    Cache::put($cacheKey, $cacheData, $timeout);
                }

                // Add debug info if enabled
                if (config('app.debug')) {
                    $response = $this->addDebugInfo($response, $cachedAt, $timeout, 'fresh', $cacheKey);
                }

                return $response;
            } finally {
                $lock->release();
            }
        } else {
            // Lock acquisition failed, wait for result or timeout
            return $this->waitForResult($cacheKey, $lockTimeout, $timeout);
        }
    }

    /**
     * Wait for the result to be cached by another process.
     *
     * @param  string  $cacheKey
     * @param  int  $maxWaitTime
     * @param  int  $cacheTimeout
     * @return \Symfony\Component\HttpFoundation\Response
     */
    private function waitForResult(string $cacheKey, int $maxWaitTime, int $cacheTimeout): Response
    {
        $waitTime = 0;
        $sleepInterval = 0.5; // 500ms

        while ($waitTime < $maxWaitTime) {
            $cachedData = Cache::get($cacheKey);
            if ($cachedData) {
                $response = new \Illuminate\Http\Response(
                    $cachedData['content'],
                    $cachedData['status'],
                    $cachedData['headers']
                );

                // Add debug info if enabled
                if (config('app.debug')) {
                    $response = $this->addDebugInfo($response, $cachedData['cached_at'], $cacheTimeout, 'waited', $cacheKey);
                }

                return $response;
            }

            // Check if lock is still held (processing is still happening)
            $lockKey = "stampede_lock:{$cacheKey}";
            if (!Cache::get($lockKey)) {
                // Lock is gone but no cached result - something went wrong
                break;
            }

            usleep($sleepInterval * 1000000); // Convert to microseconds
            $waitTime += $sleepInterval;
        }

        // Timeout or processing failed - return 503
        return $this->handleLockTimeout($cacheKey);
    }

    /**
     * Add debug information to the response.
     */
    private function addDebugInfo(Response $response, Carbon $cachedAt, int $cacheTimeout, string $status, string $cacheKey): Response
    {
        $now = now();
        $cachedAgo = $cachedAt->diffForHumans($now, true);
        $expiresAt = $cachedAt->addSeconds($cacheTimeout);
        $expiresIn = $now->diffForHumans($expiresAt, true);

        $debugInfo = [
            'cache_status' => $status,
            'cached_at' => $cachedAt->format('Y-m-d H:i:s'),
            'cached_ago' => $cachedAgo,
            'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
            'expires_in' => $expiresIn,
            'cache_driver' => config('cache.default'),
            'cache_key' => $cacheKey,
            'timezone' => $now->timezoneName,
        ];

        // Add to Laravel Debugbar if available
        if (app()->bound('debugbar')) {
            \Debugbar::info('[PreventStampede] cache details:', $debugInfo);
        }

        // Add debug info to response
        if (\Illuminate\Support\Str::contains($response->headers->get('Content-Type', ''), 'text/html')) {
            // For HTML responses, inject debug info
            $content = $response->getContent();
            $debugHtml = $this->generateDebugHtml($debugInfo, $status);

            if (str_contains($content, '</body>')) {
                $content = str_replace('</body>', $debugHtml . '</body>', $content);
            } else {
                $content .= $debugHtml;
            }

            $response->setContent($content);
        }

        // Always add debug headers
        $response->headers->add([
            'X-Cache-Status' => $status,
            'X-Cache-Cached-At' => $cachedAt->format('Y-m-d H:i:s'),
            'X-Cache-Expires-At' => $expiresAt->format('Y-m-d H:i:s'),
            'X-Cache-Driver' => config('cache.default'),
            'X-Cache-Key' => $cacheKey,
        ]);

        return $response;
    }

    /**
     * Generate debug HTML for display.
     */
    private function generateDebugHtml(array $debugInfo, string $status): string
    {
        $statusColors = [
            'fresh' => '#28a745',   // Green
            'cached' => '#17a2b8',  // Blue
            'waited' => '#ffc107',  // Yellow
        ];

        $color = $statusColors[$status] ?? '#6c757d';

        $statusMessages = [
            'fresh' => 'Freshly generated and cached',
            'cached' => 'Served from cache',
            'waited' => 'Waited for cache (stampede prevented)',
        ];

        $statusMessage = $statusMessages[$status] ?? 'Unknown status';

        // Collapsible debug window with right-aligned, translucent icon button
        return "
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'>
        <div id='cache-debug-container' style='
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        '>
            <button id='cache-debug-toggle' aria-label='Toggle Cache Debug' onclick='(function(){var box=document.getElementById(\'cache-debug-box\');if(box.style.display==\'none\'){box.style.display=\'block\';}else{box.style.display=\'none\';}})()' style='
                background: {$color};
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                margin-bottom: 5px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                opacity: 0.5;
                transition: opacity 0.2s;
            ' onmouseover='this.style.opacity=1' onmouseout='this.style.opacity=0.5'>
                <i class='fa-solid fa-circle-info'></i>
            </button>
            <div id='cache-debug-box' style='
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                margin-top: 0;
            '>
                <div style='margin-bottom: 8px;'>
                    <strong style='color: {$color};'>🔄 Cache Debug</strong>
                </div>
                <div style='margin-bottom: 5px;'>
                    <strong>Status:</strong> {$statusMessage}
                </div>
                <div style='margin-bottom: 5px;'>
                    <strong>Cached:</strong> {$debugInfo['cached_ago']} ago
                </div>
                <div style='margin-bottom: 5px;'>
                    <strong>Expires:</strong> in {$debugInfo['expires_in']}
                </div>
                <div style='margin-bottom: 5px;'>
                    <strong>Driver:</strong> {$debugInfo['cache_driver']}
                </div>
                <div style='margin-bottom: 5px;'>
                    <strong>Cache Key:</strong> <span style='word-break:break-all'>{$debugInfo['cache_key']}</span>
                </div>
                <div style='margin-bottom: 5px;'>
                    <strong>Timezone:</strong> {$debugInfo['timezone']}
                </div>
                <div style='font-size: 10px; color: #ccc; margin-top: 5px;'>
                    Cached at: {$debugInfo['cached_at']}<br/>
                    Expires at: {$debugInfo['expires_at']}
                </div>
            </div>
            <script>(function(){
                var btn = document.getElementById('cache-debug-toggle');
                var box = document.getElementById('cache-debug-box');
                if(window.localStorage && btn && box){
                    var state = localStorage.getItem('cacheDebugCollapsed');
                    if(state === '1'){ box.style.display = 'none'; }
                    btn.onclick = function(){
                        if(box.style.display === 'none'){
                            box.style.display = 'block';
                            localStorage.setItem('cacheDebugCollapsed','0');
                        }else{
                            box.style.display = 'none';
                            localStorage.setItem('cacheDebugCollapsed','1');
                        }
                    };
                }
            })();</script>
        </div>";
    }

    /**
     * Handle lock timeout scenario.
     */
    private function handleLockTimeout(string $cacheKey): Response
    {
        // Try one more time to get cached result
        $cachedData = Cache::get($cacheKey);
        if ($cachedData) {
            $response = new \Illuminate\Http\Response(
                $cachedData['content'],
                $cachedData['status'],
                $cachedData['headers']
            );
            if (config('app.debug')) {
                $response = $this->addDebugInfo($response, $cachedData['cached_at'], 0, 'cached', $cacheKey);
            }
            return $response;
        }

        return response()->json([
            'message' => 'Request is being processed. Please try again shortly.',
            'retry_after' => 5
        ], 503)->header('Retry-After', 5);
    }

    /**
     * Check if the current cache driver supports blocking.
     */
    private function supportsBlocking(): bool
    {
        $driver = config('cache.default');
        $supportedDrivers = ['redis', 'memcached'];

        return in_array($driver, $supportedDrivers);
    }

    /**
     * Generate a unique cache key for the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    private function generateCacheKey(Request $request): string
    {
        // Include query parameters for unique caching
        $url = $request->fullUrl();

        // Start with URL as base
        $base = $url;

        // If the request has POST data, include non-binary params
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            // Exclude files (binary)
            $postParams = $request->except(array_keys($request->files->all()));

            // Sort keys for consistency
            ksort($postParams);

            // JSON encode for a stable string representation
            $base .= '|' . json_encode($postParams);
        }

        $base .= '|request:'. ($request->header('X-Requested-With') ?? 'initial');
        $base .= '-expected-as-'. ($request->expectsJson() ? 'json' : 'html');
        $base .= '|referer:'. ($request->header('Referer') ?? 'direct');

        if (app()->bound('debugbar')) {
          \Debugbar::info('[PreventStampede] Cache key base: '.$base);
        }

        return "page_cache:" . hash('sha256', $base);
    }

    /**
     * Determine if the response should be cached.
     *
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @return bool
     */
    private function shouldCache(Response $response): bool
    {
        // Only cache successful responses
        if ($response->getStatusCode() !== 200) {
            return false;
        }

        // Don't cache if response has no-cache headers
        $cacheControl = $response->headers->get('Cache-Control', '');
        if (str_contains($cacheControl, 'no-cache') || str_contains($cacheControl, 'no-store')) {
            return false;
        }

        return true;
    }
}