<?php

namespace App\Http\Controllers;

use App\Models\BackgroundCheckComment;
use App\Models\HrappEmployee;
use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class BackgroundCheckController extends Controller
{
  // protected $ttl = 15 * 60; // the cache TTL

  public function __construct()
  {
    $this->middleware(['can:view background check']);
  }

  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    // $roles = Roles::datagridRows();

    // return Inertia::render('BackgroundCheck/Index', [
    //   'env' => config('app.env')
    // ]);
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

  public function pending()
  {
    $pendingLoaners = $this->loansDataSource('pending');
    $pendingLoanersEmails = array_map(function ($loaner) {
      return $loaner->company_email;
    }, $pendingLoaners);

    // Directly fetch without caching
    $loaners = HrappEmployee::fetchBasicByEmails($pendingLoanersEmails);

    return Inertia::render('BackgroundCheck/Pending', [
      'loaners' => $loaners
    ]);
  }

  public function search($keyword = null){
    $statusCode = 200;
    $noRecordsFound = true; // in the meantime
    $response = [];
    // $cacheKey = "background-check-search-{$keyword}";

    if($keyword){
      $response = HrappEmployee::fetchBasic($keyword);
    }

    if($keyword && count($response['results']['users']))
      $noRecordsFound = false;

    if($noRecordsFound && $keyword !== null)
      $statusCode = 404;

    if($keyword && count($response['errors']))
      $statusCode = 404;

    return Inertia::render('BackgroundCheck/Index', [
      // 'env' => config('app.env'),
      'keyword' => $keyword,
      'response' => $response
    ])->toResponse(request())->setStatusCode($statusCode);
  }

  public function searchSuggestions(){
    $keyword = request()->input('keyword');

    // $cacheKey = __CLASS__ . "::" . __FUNCTION__ . "/" . $keyword;

    $response = HrappEmployee::fetchBasic($keyword, 100);

    $response = [
      'users' => $response['results']['users']
    ];
    return $response;
  }

  public function attendance($email)
  {
    // $cacheKey = "background-check-attendance-{$email}";
    $response = HrappEmployee::fetchAttendance($email);

    return response()->json($response);
  }

  public function loans($email)
  {
    // $cacheKey = "background-check-loans-{$email}";
    $response = HrappEmployee::fetchLoans($email);

    return response()->json($response);
  }

  public function loansStatistics($email)
  {
    // $cacheKey = "background-check-loan-statistics-{$email}";
    $response = [
      'statistics' => HrappEmployee::fetchLoansStatistics($email)
    ];

    return response()->json($response);
  }

  public function payrolls($email)
  {
    // $cacheKey = "background-check-payrolls-{$email}";
    $response = HrappEmployee::fetchPayrolls($email);

    return response()->json($response);
  }

  protected function loansDataSource($status){
    // $cacheKey = "background-check-".$status."-loans";
    $response = HrappEmployee::fetchRecentLoansByStatus($status);

    return $response;
  }

  public function pendingLoans()
  {
    $response = $this->loansDataSource("pending");

    return response()->json($response);
  }

  public function ongoingLoans()
  {
    // $cacheKey = "background-check-ongoing-loans";
    $response = HrappEmployee::fetchRecentLoansByStatus('approved', 500, [
      ["finance_loans.is_paid", "=", 0],
      ["finance_loans.created_at", ">", now()->subYear(2)] // limit to 1 year data-set only
    ]);

    return response()->json($response);
  }

  public function comments($email){
    return [
      'list' => BackgroundCheckComment::getByEmail($email)
    ];
  }

  public function addComment($email){
    $comment = BackgroundCheckComment::addComment([
      'email' => $email,
      'comment' => request()->input('comment')
    ]);

    return $comment;
  }
}
