<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNewUserRequest;
use App\Http\Requests\UserUpdateMetaRequest;
use App\Http\Requests\UserUpdatePasswordRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\UserUpdateRoleRequest;
use App\Models\Roles;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
  public function __construct()
  {
    $this->middleware(['can:view users']);
    $this->middleware(['can:edit users'])->only(['update', 'edit']);
    $this->middleware(['can:create users'])->only(['create', 'store']);
    $this->middleware(['can:delete users'])->only(['destroy']);
  }

  /**
  * Display a listing of the resource.
  */
  public function index()
  {
    $users = User::datagridRows();

    return Inertia::render('Users/Index', [
      'users' => $users
    ]);
  }

  /**
  * Show the form for creating a new resource.
  */
  public function create()
  {
    return Inertia::render('Users/New', [
      'availableRoles' => Roles::getAvailable()
      , 'userTemplate' => User::fromFakeTemplate()
    ]);
  }

  /**
  * Store a newly created resource in storage.
  */
  public function store(StoreNewUserRequest $request)
  {
    $data = $request->validated();

    $user = User::createUnitOfWork([
      'firstname' => $data['firstname'],
      'lastname' => $data['lastname'],
      'email' => $data['email'],
      'password' => $data['password']
    ]);

    $user->syncRoles([]);
    $user->assignRole($data['roleName']);
    // return to_route('users.new')->with('success', "{$data['email']} created successfully");
    return to_route('users.new');
  }

  /**
  * Display the specified resource.
  */
  public function show(User $user)
  {
    // $user->load(['roles']); // don't need this for now, only roleName
    return Inertia::render('Users/View', [
      'user' => $user->append(['roleName','permissionsArray'])
    ]);
  }

  /**
  * Show the form for editing the specified resource.
  */
  public function edit(User $user)
  {
    /**
     * own profile editing is forbidden
     */
    if($user->id === auth()->user()->id)
      abort(403);

    return Inertia::render('Users/Edit', [
      'user' => $user->load('roles')->append('roleName'),
      'availableRoles' => Roles::getAvailable()
    ]);
  }

  /**
  * Update the specified resource in storage.
  */
  public function update(UserUpdateRequest $request, User $user)
  {
    $request->user->fill($request->validated());
    $request->user->save();

    return to_route('users.edit', $user);
  }

  /**
  * Update the specified resource in storage.
  */
  public function updatePassword(UserUpdatePasswordRequest $request, User $user)
  {
    $request->user->password = Hash::make($request->validated('password'));
    $request->user->save();

    return to_route('users.edit', $user);
  }

  public function updateRole(UserUpdateRoleRequest $request, User $user)
  {
    $user->syncRoles([]);
    $user->assignRole($request->validated('roleName'));
    $user->touch();

    return to_route('users.edit', $user);
  }

  public function updateMeta(UserUpdateMetaRequest $request, User $user)
  {
    $request->user->meta = $request->validated();
    $request->user->save();

    return to_route('users.edit', $user);
  }

  /**
  * Remove the specified resource from storage.
  */
  public function destroy(User $user)
  {
    //
  }

  function deactivate(User $user){
    $user->update(['is_active' => false]);
    return to_route('users.view', $user);
  }

  function reactivate(User $user){
    $user->update(['is_active' => true]);
    return to_route('users.view', $user);
  }
}
