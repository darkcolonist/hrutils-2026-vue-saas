<?php

namespace App\Console\Commands;

use App\Events\PrivateMessageEvent;
use App\Models\User;
use Illuminate\Console\Command;

// use Illuminate\Support\Facades\Log;

class PrivateMessage extends Command
{
  /**
  * The name and signature of the console command.
  *
  * @var string
  */
  protected $signature = 'app:private-message {user : The ID or email of the user} {message? : the message}';

  /**
  * The console command description.
  *
  * @var string
  */
  protected $description = 'send private message to user';

  /**
  * Execute the console command.
  */
  public function handle()
  {
    $userIdOrEmail = $this->argument('user');

    $user = User::where('id', $userIdOrEmail)
    ->orWhere('email', $userIdOrEmail)
    ->first();

    if (!$user) {
      $this->error('User not found');
      return;
    }

    $message = $this->argument('message') ?? $this->ask('Enter your message');
    event(new PrivateMessageEvent($user, $message));

    $this->info('Private message sent to ' . $user->email);
  }
}
