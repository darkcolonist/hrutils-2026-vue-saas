<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppOption extends Model
{
  use HasFactory;

  protected $guarded = ['id'];

  protected $casts = [
    'option_value' => 'json',
  ];

  public static function getOption($name) : array {
    return self::where('option_name', $name)
      ->firstOrFail()
      ->option_value;
  }
}
