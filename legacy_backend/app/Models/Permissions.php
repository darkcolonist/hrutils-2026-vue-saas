<?php

namespace App\Models;

use App\Traits\DataGridModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission;

class Permissions extends Permission
{
  use HasFactory, DataGridModelTrait;

  protected $guarded = [ 'id' ];

  public function getRouteKeyName()
  {
    return 'name';
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
        $query->where("name", "like", "%" . $searchKeyword . "%");
      });
    }

    return $query->paginate(10);
  }

  public static function search($keyword){
    return self::where('name', 'LIKE', "{$keyword}%")
      ->orderBy('name')
      ->limit(5)
      ->get();
  }
}
