<?php

use App\Facades\CacheFacade;
use App\Models\HrappEmployee;
use Illuminate\Support\Facades\Cache;

Route::middleware('test')->prefix('test')->group(function () {
  Route::get('gallery/{page?}/{skipCache?}', function($page = 1, $skipCache = null){
    return CacheFacade::fetch(HrappEmployee::class, "fetchUsersForGallery", [ (int)$page ], 21600, $skipCache);
  });

  Route::get('59-cache-error-tracking', function(){
    $result = CacheFacade::rememberWithWarmup('59-cache-error-tracking', function(){
      $value = Cache::get('59-cache-error-tracking-dummy-value', 1);

      Cache::increment('59-cache-error-tracking-dummy-value');

      if($value % 2 === 0)
        throw new \Exception("there's no error, just forcing this closure to fail");

      return $value;
    });

    return response()->json($result);
  });

  Route::get('60-background-check-suggestions', function(){
    $result = \App\Models\HrappEmployee::fetchBasic("no", 100);

    return response()->json($result);
  });

  Route::get('44-non-blocking-cache-experiment-1', function(){
    $cacheKey = '44-non-blocking-cache-experiment-1';
    $timeout = 5;
    $lockTimeout = $timeout * 2;
    $ttl = 5;

    $closure = function() use ($timeout){
      $data = strtoupper(substr(md5(uniqid()), 0, 4));
      logger()->info(
        'closure running for ' .
        request()->input('key', url()->current())
      );
      sleep($timeout);
      return $data;
    };

    /**
     * below will run closure for every user
     */
    // $result = Cache::remember(
    //   $cacheKey, $ttl,
    //   $closure
    // );

    /**
     * below will run only from 1 user
     */
    $result = Cache::lock($cacheKey."-lock", $lockTimeout)
      ->block($lockTimeout, function() use ($cacheKey, $ttl, $closure){
        return Cache::remember(
            $cacheKey,
            $ttl,
            $closure
          );
      });

    return response()->json($result);
  });

  Route::get('56-ongoing-loans', function () {
    $result = HrappEmployee::fetchRecentLoansByStatus('approved', 500, [
      ["finance_loans.is_paid", "=", 0],
      ["finance_loans.created_at", ">", now()->subYear()]
    ]);

    return response($result);

    // if you need to take raw sql from debugbar
    return response(
      '<pre style="background:#181a1b;color:#c9d1d9;padding:1em;border-radius:8px;font-family:monospace;font-size:1em;">' .
      json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) .
      '</pre>'
    )->header('Content-Type', 'text/html');
  });
});
