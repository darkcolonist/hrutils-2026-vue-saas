<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserUpdatePasswordRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    return [
      // 'current_password' => ['required', 'current_password'],
      // 'password' => ['required', Password::defaults(), 'confirmed'],
      'password' => ['required', 'confirmed'],
    ];
  }
}
