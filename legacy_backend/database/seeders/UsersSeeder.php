<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
  /**
  * Run the database seeds.
  */
  public function run(): void
  {
    $user = User::create([
      'firstname' => 'HR Utils',
      'lastname' => 'Administrator',
      'email' => 'admin@example.com',
      'password' => Hash::make('admin')
    ]);

    // unassign all roles
    $user->syncRoles([]);

    // assign administrator role
    $user->assignRole('admin');

    event(new Registered($user));
  }
}
