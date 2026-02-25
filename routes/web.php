<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BackgroundCheckController;
use App\Http\Controllers\BooksController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Dev\CacheController;
use App\Http\Controllers\EmployeesOnDutyController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\MyDepartmentController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\PermissionsControllerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => config('app.registration') === 'enabled',
    // 'laravelVersion' => Application::VERSION,
    // 'phpVersion' => PHP_VERSION,
    'year' => gmdate('Y'),
    'appName' => env('APP_NAME'),
  ]);
});

Route::middleware(['auth','verified'])->group(function(){
  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
  Route::post('/dashboard/employee-requests',
    [DashboardController::class, 'hrappEmployeeRequests'])
    ->name('dashboard.employee-requests')
    ->middleware(['prevent.stampede:,30']);

  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

  Route::get('/users', [UserController::class, 'index'])->name('users');
  Route::get('/users/view/{user}', [UserController::class, 'show'])->name('users.view');
  Route::patch('/users/deactivate/{user}', [UserController::class, 'deactivate'])->name('users.deactivate');
  Route::patch('/users/reactivate/{user}', [UserController::class, 'reactivate'])->name('users.reactivate');
  Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit');
  Route::patch('/users/edit/{user}', [UserController::class, 'update'])->name('users.edit');
  Route::patch('/users/edit/password/{user}', [UserController::class, 'updatePassword'])->name('users.edit.password');
  Route::patch('/users/edit/role/{user}', [UserController::class, 'updateRole'])->name('users.edit.role');
  Route::patch('/users/edit/meta/{user}', [UserController::class, 'updateMeta'])->name('users.edit.meta');
  Route::get('/users/new', [UserController::class, 'create'])->name('users.new');
  Route::post('/users/new', [UserController::class, 'store'])->name('users.store');
  Route::get('/users', [UserController::class, 'index'])->name('users');

  Route::get('/books', [BooksController::class, 'index'])->name('books');
  Route::get('/books/view/{books}', [BooksController::class, 'show'])->name('books.view');
  Route::get('/books/edit/{books}', [BooksController::class, 'edit'])->name('books.edit');
  Route::patch('/books/edit/{books}', [BooksController::class, 'update'])->name('books.edit');
  Route::delete('/books/edit/{books}', [BooksController::class, 'destroy'])->name('books.delete');
  Route::get('/books/new', [BooksController::class, 'create'])->name('books.new');
  Route::post('/books/new', [BooksController::class, 'store'])->name('books.store');

  Route::get('/roles', [RolesController::class, 'index'])->name('roles');
  Route::get('/roles/view/{role}', [RolesController::class, 'show'])->name('roles.view');
  Route::get('/roles/edit/{role}', [RolesController::class, 'edit'])->name('roles.edit');
  Route::patch('/roles/edit/{role}', [RolesController::class, 'update'])->name('roles.edit');
  Route::delete('/roles/edit/{role}', [RolesController::class, 'destroy'])->name('roles.delete');
  Route::get('/roles/new', [RolesController::class, 'create'])->name('roles.new');
  Route::post('/roles/new', [RolesController::class, 'store'])->name('roles.store');

  Route::post('/give/permission/{permissionName}/to/role/{role}',
    [PermissionsController::class, 'givePermissionToRole'])
    ->name('permissions.givePermissionToRole');

  Route::post('/remove/permission/{permission}/from/role/{role}',
    [PermissionsController::class, 'removePermissionFromRole'])
    ->name('permissions.removePermissionFromRole');

  Route::post('/permissions/search/{keyword}',
    [PermissionsController::class, 'search'])
    ->name('permissions.search');

  Route::middleware(['prevent.stampede:,30'])
    ->group(function(){
    Route::prefix('/background')->group(function () {
      Route::get('/check/{keyword?}',
        [BackgroundCheckController::class, 'search'])
        ->name('background.check');

      Route::get('/pending',
        [BackgroundCheckController::class, 'pending'])
        ->name('background.pending');

      Route::post('/find',
        [BackgroundCheckController::class, 'searchSuggestions'])
        ->name('background.find');

      Route::post('/check/attendance/{email}',
        [BackgroundCheckController::class, 'attendance'])
        ->name('background.check.attendance');

      Route::post('/check/loans/{email}',
        [BackgroundCheckController::class, 'loans'])
        ->name('background.check.loans');

      Route::post('/check/loans/statistics/{email}',
        [BackgroundCheckController::class, 'loansStatistics'])
        ->name('background.check.loans.statistics');

      Route::post('/check/comments/{email}',
        [BackgroundCheckController::class, 'comments'])
        ->name('background.check.comments');

      Route::post('/check/comments/{email}/submit',
        [BackgroundCheckController::class, 'addComment'])
        ->name('background.check.comments.submit');

      Route::post('/check/payrolls/{email}',
        [BackgroundCheckController::class, 'payrolls'])
        ->name('background.check.payrolls');

      Route::post('/pending',
        [BackgroundCheckController::class, 'pendingLoans'])
        ->name('background.pending.loans');

      Route::get('/ongoing',
        [BackgroundCheckController::class, 'ongoingLoans'])
        ->name('background.ongoing.loans');

      Route::get('/attendance',
        [AttendanceController::class, 'index'])
        ->name('attendance');

      Route::post('/attendance/calendar',
        [AttendanceController::class, 'calendar'])
        ->name('attendance.calendar');

      Route::get('/attendance/leaves/{employeeCompanyEmail}',
        [AttendanceController::class, 'leaves'])
        ->name('attendance.leaves');

      Route::get('/attendance/leaves/report/{employeeCompanyEmail}',
        [AttendanceController::class, 'leavesReport'])
        ->name('attendance.leaves.report');

      Route::get('/employees/on/duty',
        [EmployeesOnDutyController::class, 'index'])
        ->name('employees.on.duty');
    });

    Route::prefix('/dev')->middleware(['can:is developer'])->group(function(){
      Route::get('/cache', [CacheController::class, 'index'])->name('dev.cache');
      Route::delete('/cache', [CacheController::class, 'destroy'])->name('dev.cache.destroy');
      Route::patch('/cache', [CacheController::class, 'update'])->name('dev.cache.patch');
    });
  });

  Route::prefix('/background')
    ->middleware(['prevent.stampede:,86400']) // 24 hours
    ->group(function () {
    Route::get('/my/department',
      [MyDepartmentController::class, 'index']
    )->name('my.department');

    Route::get('/gallery',
      [GalleryController::class, 'index']
    )->name('gallery');

    Route::post('/gallery/load',
      [GalleryController::class, 'load']
    )->name('gallery.load');
  });
});

require __DIR__.'/auth.php';
require __DIR__.'/test.php';
