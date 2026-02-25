<?php

namespace App\Http\Controllers;

use App\Models\HrappEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
  public function __construct()
  {
    $this->middleware(['can:view gallery']);
  }

  /**
   * Display a listing of the resource.
   */
  public function index(){
    return Inertia::render('Gallery/Index', [
      // "response" => HrappEmployee::fetchPresentEmployees()
    ]);
  }

  public function load(){
    $page = request()->input('page');
    // Directly fetch users for gallery without caching
    $response = HrappEmployee::fetchUsersForGallery($page);

    return $response;
  }
}
