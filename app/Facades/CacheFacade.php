<?php

namespace App\Facades;

use Illuminate\Support\Facades\Cache;
use Opis\Closure\SerializableClosure;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * CacheFacade - Laravel's Cache Facade with warm up
 *
 * Warm-up cache is a special feature that automatically pulls new
 *   data in the background.
 *
 * @package App\Facades
 * @author cris@nms.ph
 */
class CacheFacade
{
  const DEFAULT_DURATION = 60; // seconds
  const WARMUP_KEY = 'warm-me-up-please'; // Key for storing warm-up details
  const MAXIMUM_EXECUTION_TIME = 60; // seconds
  const MAXIMUM_UPDATE_WARMUPS_TIME = 5; // seconds
  const WARMUP_EXPIRATION = 60 * 60 * 24 * 7; // seconds

  static function getUpdateWarmupsCacheLock(): \Illuminate\Contracts\Cache\Lock {
    $key = self::WARMUP_KEY . "_lock";
    return Cache::lock($key, 10);
  }

  static function getWarmUpItemLock($warmUpCacheKey) : \Illuminate\Contracts\Cache\Lock {
    $key = self::WARMUP_KEY . $warmUpCacheKey . "_lock";
    return Cache::lock($key, 10);
  }

  /**
   * this is meant to be called manually, do not put this in the job
   * which already acquires a lock or you'll get a deadlock
   */
  static function forgetWarmup($key){
    self::getWarmUpItemLock($key)->block(self::MAXIMUM_UPDATE_WARMUPS_TIME,
      function() use ($key){
        self::forgetWarmupNoLock($key);
      }
    );
  }

  private static function forgetWarmupNoLock($key){
    $currentWarmups = Cache::get(self::WARMUP_KEY, []);
    unset($currentWarmups[$key]);
    Cache::forget($key);
    Cache::forever(self::WARMUP_KEY, $currentWarmups);
  }

  public static function getWarmupItemByKey($key){
    $warmupDetails = Cache::get(CacheFacade::WARMUP_KEY, []);
    if (array_key_exists($key, $warmupDetails)) {
      return $warmupDetails[$key];
    } else {
      return null;
    }
  }

  /**
   * true if warmup has expired
   */
  private static function forgetWarmupIfExpired($key, $details)
  {
    if(!array_key_exists("expires", $details)){
      self::forgetWarmupNoLock($key);
      return true;
    }

    $expiration = Carbon::parse($details["expires"]);
    if ($expiration->isPast()) {
      self::forgetWarmupNoLock($key);
      return true;
    }

    return false;
  }

  static function forceWarmup($key)
  {
    self::getWarmUpItemLock($key)->block(
      self::MAXIMUM_EXECUTION_TIME,
      function () use ($key) {
        self::forceWarmupNoLock($key);
      }
    );
  }

  private static function forceWarmupNoLock($key)
  {
    $warmupDetails = self::getWarmupItemByKey($key);

    if (self::forgetWarmupIfExpired($key, $warmupDetails)){
      logger()->info("CacheFacade::expired[{$key}]");
      return;
    }

    $closure = unserialize($warmupDetails['closure'])->getClosure();
    $start = microtime(true); // Start time

    try {
      $closureResult = $closure();
      Cache::forget($key);
      Cache::put($key, $closureResult, $warmupDetails['ttl']);
    } catch (\Exception $e) {
      Log::error("Error in closure during cache warmup for {$key}: " . $e->getMessage());

      $warmupDetails['last_error'] = $e->getMessage();
      $warmupDetails['errored_at'] = now()->toDateTimeString();
    }

    $end = microtime(true); // End time
    $warmupDetails['last_warmed_at'] = now()->toDateTimeString();
    $warmupDetails['execution_time'] = round($end - $start, 4);
    self::updateWarmUpDetails($key, $warmupDetails);
  }

  static function updateWarmupDetails($key, $details){
    self::getUpdateWarmupsCacheLock()
      ->block(self::MAXIMUM_UPDATE_WARMUPS_TIME, function () use ($key, $details) {
        $currentWarmups = Cache::get(self::WARMUP_KEY, []);
        $currentWarmups[$key] = $details;
        Cache::forever(self::WARMUP_KEY, $currentWarmups);
      });
  }

  /**
   * Generates a cache key for a closure.
   *
   * @param \Closure $closure The closure for which to generate the cache key.
   * @return string The generated cache key.
   */
  private static function generateCacheKeyForClosure(\Closure $closure)
  {
    $serializableClosure = new SerializableClosure($closure);
    $serializedClosure = serialize($serializableClosure);
    $hash = md5($serializedClosure);
    $key = 'closure_' . $hash;

    return $key;
  }

  private static function tryGenerateKey($key){
    if ($key === null) {
      $key = self::generateCacheKeyForClosure($closure);
    } else {
      $key = Str::slug($key);
    }

    return $key;
  }

  public static function remember($key, \Closure $closure, $ttl = self::DEFAULT_DURATION, $warmUpEvery = false){
    $key = self::tryGenerateKey($key);

    $alreadyCached = Cache::has($key);

    if(!$alreadyCached)
      logger()->info("CacheFacade::remember[{$key}]");

    $start = microtime(true); // Start time
    $result = Cache::remember($key, $ttl, $closure);
    $end = microtime(true); // End time

    if ($warmUpEvery !== false) {
      $serializableClosure = new SerializableClosure($closure);
      $serializedClosure = serialize($serializableClosure);

      $warmupDetails = Cache::get(self::WARMUP_KEY, []);

      $warmupDetails[$key] = [
        ...($warmupDetails[$key] ?? []),
        'closure' => $serializedClosure,
        'ttl' => $ttl,
        'warm_up_every' => $warmUpEvery,
        'last_warmed_at' => isset($warmupDetails[$key]['last_warmed_at'])
          ? $warmupDetails[$key]['last_warmed_at']
          : Carbon::now()->toDateTimeString(),
        'last_ping' => Carbon::now()->toDateTimeString(),
        'last_ping_by' => auth()->user()->email,
        'total_pings' => isset($warmupDetails[$key]['total_pings'])
          ? ++$warmupDetails[$key]['total_pings']
          : 1,
        'expires' => Carbon::now()->addSeconds(self::WARMUP_EXPIRATION)
      ];

      if(!$alreadyCached){
        $warmupDetails[$key]['execution_time'] = round($end - $start, 4);
      }

      Cache::forever(self::WARMUP_KEY, $warmupDetails);

      // WarmUpCacheJob::dispatch($key, $warmupDetails[$key]); // for testing
    }

    return $result;
  }

  public static function rememberWithWarmup($key, \Closure $closure){
    /**
     * whenever you change the $ttl and $warmUpEvery, you will have to
     * clear cache because we are already storing the current $ttl and
     * $warmUpEvery into the Cache::forever storage.
     *
     * as for the $key, if it is null, it will attempt to create a
     * hash from the closure. this may be a problem later on and will
     * keep creating a lot of remember routines due to change in
     * the closure function ie., new space or new line would already
     * make the closure unique from the other.
     *
     * finally, you need to run the following so that the warm-up will
     * run automatically:
     *
     * dev mode (local):
     *   `php artisan schedule:work`
     *   `php artisan queue:listen`
     *
     * prod mode (live):
     *   `php artisan schedule:run`
     *   `php artisan queue:work`
     *
     * otherwise, if the above isn't running, it will fallback to user
     * based warm-up.
     */
    return self::remember($key, $closure, 60 * 5, 1);
  }
}