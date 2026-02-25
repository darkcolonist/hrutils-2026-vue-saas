<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\DataGridModelTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;

class User extends Authenticatable
{
    use HasApiTokens
      , HasFactory
      , Notifiable
      , HasRoles
      , DataGridModelTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'is_active',
        'meta',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($user) {
      // Check if the "User" role exists in the database
      $userRole = Role::where('name', 'user')->first();

      if ($userRole) {
        $user->assignRole($userRole);
      }
    });
  }

  public function getRouteKeyName()
  {
    return 'email';
  }

  // public function roles()
  // {
  //   return $this->belongsToMany(Role::class, 'model_has_roles', 'model_id', 'role_id');
  // }

  static function fromFakeTemplate(){
    $faker = \Faker\Factory::create();
    return new User([
      'firstname' => $faker->firstName()
      , 'lastname' => $faker->lastName()
      , 'email' => $faker->email()
      // , 'password' => 'q'
      // , 'password_confirmation' => 'q'
      // , 'roleName' => 'user'
    ]);
  }

  public function getRoleNameAttribute()
  {
    $firstRole = $this->roles->first();
    return $firstRole ? $firstRole->name : null;
  }

  public function getPermissionsArrayAttribute()
  {
    $permissions = [];

    foreach ($this->roles as $role) {
      $permissions = array_merge($permissions, $role->permissions->pluck('name')->toArray());
    }

    return $permissions;
  }

  public function setMetaAttribute($value)
  {
    $this->attributes['meta'] = json_encode($value);
  }

  public function getMetaAttribute($value)
  {
    return json_decode($value, true);
  }

  public function metaValue($name){
    if($this->meta != null && array_key_exists($name, $this->meta))
      return $this->meta[$name];

    $userConfig = AppOption::getOption('user_config');
    if(array_key_exists($name, $userConfig))
      return $userConfig[$name];

    throw new \Exception("User Meta or AppConfig missing: user.meta.{$name} not set");
  }

  static function createUnitOfWork($data){
    $data["password"] = Hash::make($data["password"]);
    return self::create($data);
  }

  static function findByEmail($email){
    return self::where('email', $email);
  }

  public static function datagridRows()
  {
    $query = self::leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
      ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
      ->select('users.*', DB::raw('COALESCE(roles.name, "no role") as role'));

    // $query = self::select()
    //   ->with('roles');

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
        $query->where("firstname", "like", "%" . $searchKeyword . "%")
          ->orWhere("email", "like", "%" . $searchKeyword . "%")
          ->orWhere("role", "like", "%" . $searchKeyword . "%")
          ->orWhere("lastname", "like", "%" . $searchKeyword . "%");
      });
    }

    return $query->paginate(10);
  }
}
