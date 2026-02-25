<?php

namespace App\Http\Controllers;

use App\Models\HrappEmployee;
use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function __construct()
  {
    $this->middleware(['can:view hrapp employee requests'])->only(['hrappEmployeeRequests']);
  }

  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Dashboard', [
      'view_hrapp_employee_requests' => Gate::allows('view hrapp employee requests'),
      'formats' => config('app.formats')
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {

  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {

  }

  /**
   * Display the specified resource.
   */
  public function show(Roles $role)
  {

  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Roles $role)
  {

  }

  /**
   * Update the specified resource in storage.
   */
  public function update(SaveRoleRequest $request, Roles $role)
  {

  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Roles $role)
  {

  }

  public function hrappEmployeeRequests(){
    $groupIDs = auth()->user()->metaValue('group_ids');
    // logger()->debug($groupIDs);

    // Directly fetch requests without caching
    $result = [
      'requests' => HrappEmployee::formatFetchRequests(
        HrappEmployee::fetchRequests($groupIDs)),
      'timestamp' => now()
    ];

    return $result;
  }
}
