<?php

namespace App\Http\Controllers;

use App\Models\HrappEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
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
    $groupIDs = auth()->user()->metaValue('group_ids');
    // Directly fetch present employees without caching
    $response = HrappEmployee::fetchPresentEmployees($groupIDs);

    return Inertia::render('Attendance/Index', [
      "response" => $response
    ]);
  }

  public function calendar() {
    $groupIDs = auth()->user()->metaValue('group_ids');
    // Directly fetch leaves and special dates without caching
    $result = [
      'leaves' => HrappEmployee::fetchLeaves($groupIDs),
      'special' => HrappEmployee::fetchSpecialDates($groupIDs)
    ];

    return $result;
  }

  public function leaves($employeeCompanyEmail)
  {
    // Directly fetch leaves by email without caching
    $response = HrappEmployee::fetchLeavesByEmail($employeeCompanyEmail);

    return response()->json($response);
  }

  public function leavesReport($employeeCompanyEmail)
  {
    // Directly fetch leaves report by employee without caching
    $response = HrappEmployee::fetchLeavesReportByEmployee($employeeCompanyEmail);

    return response()->json($response);
  }
}