<?php

namespace App\Models;

use App\Traits\DataGridModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Barryvdh\Debugbar\Facades\Debugbar;

class Books extends Model
{
  use HasFactory, SoftDeletes, DataGridModelTrait;

  protected $guarded = [ 'id', 'hash' ];

  public function getRouteKeyName()
  {
    return 'hash';
  }

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($model) {
      $model->hash = Str::uuid()->toString();
    });
  }

  public static function datagridRows(){
    $query = self::select();

    if (self::getSortModel()) {
      $sortModel = self::getSortModel();

      if ($sortModel["sort"] == "asc")
      $query->orderBy($sortModel["field"]);
      else
        $query->orderByDesc($sortModel["field"]);
    }

    if (self::getSearchKeyword()) {
      $searchKeyword = self::getSearchKeyword();
      $query->where(function ($query) use ($searchKeyword) {
        $query->where("title", "like", "%" . $searchKeyword . "%")
          ->orWhere("author", "like", "%" . $searchKeyword . "%");
      });
    }

    // DebugBar::info('sortModel', self::getSortModel(), request()->get('sortModel'));

    return $query->paginate(10);
  }
}
