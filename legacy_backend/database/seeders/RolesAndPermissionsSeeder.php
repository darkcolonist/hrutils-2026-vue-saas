<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

const PERMISSIONS = [
  'create users',
  'edit users',
  'delete users',
  'view users',
  'view books',
  'edit books',
  'delete books',
  'create books',
  'view roles',
  'edit roles',
  'delete roles',
  'create roles',
  'view permissions',
  'edit permissions',
  'delete permissions',
  'create permissions',
  'create announcements',
  'edit announcements',
  'delete announcements',
];

class RolesAndPermissionsSeeder extends Seeder
{
  public function run()
  {
    // Reset cached roles and permissions
    app()['cache']->forget('spatie.permission.cache');

    // Remove all roles from users
    User::all()->each(function ($user) {
      $user->syncRoles([]);
    });

    // Truncate the roles and permissions tables
    Role::query()->truncate();
    Permission::query()->truncate();

    foreach (PERMISSIONS as $key => $value) {
      Permission::create(['name' => $value]);
    }

    // Recreate roles and assign permissions
    $adminRole = Role::create(['name' => 'admin']);

    foreach (PERMISSIONS as $key => $value) {
      $adminRole->givePermissionTo($value);
    }

    $userRole = Role::create(['name' => 'user']);
    $userRole->givePermissionTo('view users');
    $userRole->givePermissionTo('view books');
  }
}