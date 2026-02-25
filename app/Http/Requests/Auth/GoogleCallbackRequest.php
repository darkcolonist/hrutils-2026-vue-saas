<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class GoogleCallbackRequest extends FormRequest
{
  /**
  * Determine if the user is authorized to make this request.
  */
  public function authorize(): bool
  {
    return true;
  }

  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    return [];
  }

  /**
  * Attempt to authenticate the request's credentials.
  *
  * @throws \Illuminate\Validation\ValidationException
  */
  public function authenticate(): void
  {
    try {
      $googleUser = Socialite::driver('google')->user()->email;
      $user = User::findByEmail($googleUser)
        ->firstOrFail();

      if(!$user->is_active){
        throw ValidationException::withMessages([
          'email' => trans('auth.deactivated')
        ]);
      }
      Auth::login($user, true);
    } catch (ModelNotFoundException $e) {
      throw ValidationException::withMessages([
        'email' => trans('auth.google.nonexistentuser', [ 'email' => $googleUser ])
      ]);
    }
  }
}
