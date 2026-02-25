<?php

namespace App\Jobs;

use App\Facades\CacheFacade;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Cache;
// use Opis\Closure\SerializableClosure;
use Carbon\Carbon;
use Illuminate\Contracts\Cache\LockTimeoutException;

class WarmUpCacheJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  protected $cacheKey;
  protected $details;

  public function __construct($cacheKey, $details)
  {
    $this->cacheKey = $cacheKey;
    $this->details = $details;
  }

  public function displayName(){
    $className = get_class($this);
    // $cacheKeyTail = substr($this->cacheKey, -4,4);
    $cacheKeyTail = $this->cacheKey;
    return "{$className}\\{$cacheKeyTail}";
  }

  public function handle()
  {
    $lastWarmedAt = Carbon::parse($this->details['last_warmed_at']);
    $warmUpEvery = $this->details['warm_up_every'];

    if ($lastWarmedAt->addSeconds($warmUpEvery)->isPast()) {
      CacheFacade::forceWarmup($this->cacheKey);
    }
  }
}