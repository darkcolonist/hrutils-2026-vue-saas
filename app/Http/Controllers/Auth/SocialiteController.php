<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\GoogleCallbackRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

class SocialiteController extends Controller
{
  /**
  * redirect to google login page
  */
  public function create(){
    $googleClientId = config('services.google.client_id');
    $googleClientSecret = config('services.google.client_secret');
    $googleRedirectUri = config('services.google.redirect');

    if (empty($googleClientId) || empty($googleClientSecret) || empty($googleRedirectUri)) {
      return redirect()->route('login')->with('error', 'google service unavailable');
    } else {
      return Socialite::driver('google')->redirect();
    }
  }

  /**
  * google's callback url
  */
  public function store(GoogleCallbackRequest $request): RedirectResponse
  {
    try {
      $request->authenticate();
      $request->session()->regenerate();
      return redirect()->intended(RouteServiceProvider::HOME);

    /**
     * email unauthorized exception
     */
    } catch (ValidationException $e) {
      $errors = $e->errors();

      if (isset($errors['email'])) {
        $customErrorMessage = $errors['email'][0];
        return redirect()->route('login')->with('error', $customErrorMessage);
      }

      return redirect()->route('login')->with('error', $e->getMessage());

    /**
     * invalid state exception
     */
    } catch (InvalidStateException $e){
      return redirect()->route('login')->with('error', 'google auth expired, try again');

    /**
     * must not reach this point, if it does then something bad must
     * have happened
     */
    } catch (Exception $e){
      return redirect()->route('login')->with('error', 'non-recoverable error happened');
    }
  }
}
