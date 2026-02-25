<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AppOption;

class UpdateAppOptions extends Command
{
  protected $signature = 'app:update-app-options {template}';
  protected $description = 'Update or insert into app_options';

  protected $templates = [
    'database' => [
      'host',
      'port',
      'database',
      'username',
      'password',
    ],
    'user_config' => [
      'group_id',
    ],
  ];

  public function handle()
  {
    $template = $this->argument('template');
    // Check if the provided template exists
    if (!isset($this->templates[$template])) {
      $this->error('Invalid template provided.');
      return;
    }

    $optionValueParams = $this->templates[$template];

    // Ask the user for input
    $optionName = $this->ask('Enter option name');

    // Collect user input for each option_value parameter
    $optionValue = [];
    foreach ($optionValueParams as $param) {
      $optionValue[$param] = $this->ask("Enter option_value.{$param}");
    }

    // Your logic to retrieve data and update/insert into app_options
    $data = [
      'option_name' => $optionName,
      'option_value' => json_encode($optionValue),
      'autoload' => 'yes',
    ];

    // Find existing record by option_name
    $appOption = AppOption::where('option_name', $optionName)->first();

    if ($appOption) {
      // Update existing record
      $appOption->update([
        'option_value' => $data['option_value'],
      ]);
    } else {
      // Insert new record
      AppOption::create($data);
    }

    $this->info('App options updated/inserted successfully!');
  }
}
