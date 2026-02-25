<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignUserRole extends Command
{
  protected $signature = 'user:assign-role {email : User email} {role : Role name}';
  protected $description = 'Assign a role to a user by email';

  public function __construct()
  {
    parent::__construct();
  }

  public function handle()
  {
    $email = $this->argument('email');
    $roleName = $this->argument('role');

    // Find the user by email
    $user = User::where('email', $email)->first();

    if (!$user) {
      $this->error("User with email $email not found.");
      return;
    }

    // Find the role by name
    $role = Role::findByName($roleName);

    if (!$role) {
      $this->error("Role $roleName not found.");
      return;
    }

    // Unassign all existing roles from the user
    $user->syncRoles([]);

    // Assign the role to the user
    $user->assignRole($roleName);

    $this->info("Role $roleName assigned to user $email.");
  }
}