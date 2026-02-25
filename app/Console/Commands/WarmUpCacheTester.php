<?php

namespace App\Console\Commands;

use App\Facades\CacheFacade;
use Illuminate\Console\Command;

class WarmUpCacheTester extends Command
{
  /**
  * The name and signature of the console command.
  *
  * @var string
  */
  protected $signature = 'app:warm-up-cache-tester';

  /**
  * The console command description.
  *
  * @var string
  */
  protected $description = 'Command description';

  /**
  * Execute the console command.
  */
  public function handle()
  {
    $result = CacheFacade::rememberWithWarmup(function () {
      logger()->debug('freshly served!');
      return uniqid();
    });

    $this->info($result);
  }
}
