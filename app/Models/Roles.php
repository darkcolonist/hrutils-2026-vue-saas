<?php

namespace App\Models;

use App\Traits\DataGridModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class Roles extends Role
{
  use HasFactory, DataGridModelTrait;

  protected $guarded = [ 'id' ];

  public function getRouteKeyName()
  {
    return 'name';
  }

  public static function getAvailable(){
    return self::all();
  }

  public function getIsProtectedAttribute(){
    return in_array($this->name, [
      'user',
      'admin'
    ]) ? 1 : 0;
  }

  public function permissions() : \Illuminate\Database\Eloquent\Relations\BelongsToMany
  {
    return $this->belongsToMany(Permission::class, 'role_has_permissions', 'role_id', 'permission_id')
      ->orderBy('name');
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

    // $query->with('permissions')->selectRaw('*, GROUP_CONCAT(permissions.name) as permissions_list');
    $query->with('permissions:id,name')->get();

    $results = $query->paginate(10);

    $results->each(function ($result) {
      $result->permissions_list = $result->permissions->pluck('name')->implode(', ');
    });

    return $results;
  }
}
