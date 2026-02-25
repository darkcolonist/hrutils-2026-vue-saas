<?php

namespace App\Console\Commands;

use App\Events\AnnouncementEvent;
use Illuminate\Console\Command;

// use Illuminate\Support\Facades\Log;

class BroadcastAnnouncement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:broadcast-announcement {message? : the message}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'broadcast an announcement';

    /**
     * Execute the console command.
     */
    public function handle()
    {
      $message = $this->argument('message') ?? $this->ask('Enter announcement');
      broadcast(new AnnouncementEvent($message));
    }
}
