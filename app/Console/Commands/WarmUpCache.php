<?php

namespace App\Console\Commands;

use App\Facades\CacheFacade;
use Illuminate\Console\Command;
use App\Jobs\WarmUpCacheJob;
use Illuminate\Support\Facades\Cache;

class WarmUpCache extends Command
{
  protected $signature = 'cache:warmup';
  protected $description = 'Warm up cache entries that require periodic warming';

  public function handle()
  {
    $warmupDetails = Cache::get(CacheFacade::WARMUP_KEY, []);

    foreach ($warmupDetails as $cacheKey => $details) {
      $this->info('dispatching '.$cacheKey);
      WarmUpCacheJob::dispatch($cacheKey, $details);
    }

    $this->info('Cache warm-up job(s) dispatched.');
  }
}