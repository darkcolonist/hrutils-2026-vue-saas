<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveRoleRequest;
use App\Models\Roles;
use Inertia\Inertia;

class RolesController extends Controller
{
  public function __construct()
  {
    $this->middleware(['can:view roles']);
    $this->middleware(['can:edit roles'])->only(['update', 'edit']);
    $this->middleware(['can:create roles'])->only(['create', 'store']);
    $this->middleware(['can:delete roles'])->only(['destroy']);
  }

  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $roles = Roles::datagridRows();

    return Inertia::render('Roles/Index', [
      'roles' => $roles
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('Roles/New');
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(SaveRoleRequest $request)
  {
    $data = $request->validated();

    $role = new Roles($data);
    $role->save();
    // return to_route('roles.new')->with('success', "{$data['email']} created successfully");
    return to_route('roles.new');
  }

  /**
   * Display the specified resource.
   */
  public function show(Roles $role)
  {
    return Inertia::render('Roles/View', [
      'role' => $role->load(['permissions'])->append(['is_protected'])
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Roles $role)
  {
    return Inertia::render('Roles/Edit', [
      'role' => $role->load(['permissions'])->append(['is_protected'])
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(SaveRoleRequest $request, Roles $role)
  {
    $request->role->fill($request->validated());
    $request->role->save();

    return to_route('roles.edit', $role);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Roles $role)
  {
    $role->delete();

    return to_route('roles');
  }
}
