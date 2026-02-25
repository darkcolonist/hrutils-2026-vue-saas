<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AppOption;

class FetchAppOptions extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'app:fetch-app-options';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Fetch and display AppOptions by option_name';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $optionName = $this->ask('Enter the option_name');
    $appOption = AppOption::where('option_name', $optionName)->first();
    if ($appOption) {
      $optionValue = json_encode($appOption->option_value, JSON_PRETTY_PRINT);
      $this->info("Option Name: {$appOption->option_name}");
      $this->info("Option Value: {$optionValue}");
    } else {
      $this->error("AppOption with option_name '{$optionName}' not found.");
    }
  }
}