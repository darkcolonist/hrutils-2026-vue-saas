<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('app_options', function (Blueprint $table) {
      $table->id(); // This will automatically create an auto-incremented primary key named "id"
      $table->string('option_name')->unique();
      $table->text('option_value')->nullable();
      $table->string('autoload')->default('yes');
      $table->timestamps(); // Adds "created_at" and "updated_at" columns
    });
  }

  public function down()
  {
    Schema::dropIfExists('app_options');
  }
};
