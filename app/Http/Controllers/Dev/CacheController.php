<?php

namespace App\Http\Controllers\Dev;

use App\Facades\CacheFacade;
use App\Http\Controllers\Controller;
use App\Models\HrappEmployee;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class CacheController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(){
    $warmups = Cache::get(CacheFacade::WARMUP_KEY);

    $warmupsArray = [];
    if ($warmups !== null) {
      foreach ($warmups as $key => $value) {
        unset($value['closure']);
        $value["id"] = $key;
        $value["last_warmed_at"] = \Carbon\Carbon::parse($value["last_warmed_at"]);
        $value["last_ping"] = \Carbon\Carbon::parse($value["last_ping"]);
        $value["last_ping_by_avatar"] = HrappEmployee::gravatarURL($value["last_ping_by"]);

        if(array_key_exists('errored_at', $value)){
          $errored_at = \Carbon\Carbon::parse($value["errored_at"]);
          if ($errored_at->diffInHours(\Carbon\Carbon::now()) < 24) {
            $value['errored_at'] = $errored_at;
          }else{
            unset($value['last_error']);
            unset($value['errored_at']);
          }
        }

        if(array_key_exists('expires', $value)){
          $expires = \Carbon\Carbon::parse($value["expires"]);
          $value['expires'] = $expires;
        }

        $warmupsArray[] = $value;
      }
    }

    return Inertia::render('Dev/Cache/Index', [
      'cachedData' => $warmupsArray
    ]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy()
  {
    CacheFacade::forgetWarmup(request()->input('cacheKey'));
    return redirect(route('dev.cache'));
  }

  /**
   * Refetch cache manually
   */
  public function update()
  {
    CacheFacade::forceWarmup(request()->input('cacheKey'));
    return redirect(route('dev.cache'));
  }
}
