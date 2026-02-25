<?php

namespace App\Console\Commands;

use App\Models\Books;
use Illuminate\Console\Command;

class RestoreBooks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:restore-books';

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
      $books = Books::onlyTrashed();

      $count = $books->count();

      $books->restore();

      $this->info("restored {$count} book(s)");
    }
}
