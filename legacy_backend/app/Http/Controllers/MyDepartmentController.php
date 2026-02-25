<?php

namespace App\Http\Controllers;

use App\Models\HrappEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyDepartmentController extends Controller
{
  // protected $ttl = 1 /** week */ * 7 * 24 * 60 * 60; // the cache TTL

  public function __construct()
  {
    $this->middleware(['can:view my department']);
  }

  /**
   * Display a listing of the resource.
   */
  public function index(){
    $groupIDs = auth()->user()->metaValue('group_ids');
    $page = request()->input('page');
    // Directly fetch department employees without caching
    $result = HrappEmployee::fetchDepartmentEmployees($groupIDs, $page);

    return Inertia::render('MyDepartment/Index', [
      'result' => $result
    ]);
  }
}
