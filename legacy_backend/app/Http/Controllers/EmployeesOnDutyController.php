<?php

namespace App\Http\Controllers;

use App\Models\HrappEmployee;
use Inertia\Inertia;

class EmployeesOnDutyController extends Controller
{
  public function __construct()
  {
    $this->middleware(['can:view attendance']);
  }

  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $response = HrappEmployee::getEmployeesOnDutyToday();

    return Inertia::render('EmployeesOnDuty/Index', [
      "response" => $response
    ]);
  }
}