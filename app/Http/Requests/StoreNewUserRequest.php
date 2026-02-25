<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class StoreNewUserRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    return [
      'firstname' => ['string', 'max:255'],
      'lastname' => ['string', 'max:255'],
      'email' => [
        'email',
        'max:255',
        Rule::unique('users'),
      ],
      'password' => ['required', 'confirmed'],
      'roleName' => ['required'],
    ];
  }

  public function attributes()
  {
    return [
      'firstname' => 'First Name',
      'lastname' => 'Last Name',
      'email' => 'Email',
      'password' => 'Password',
      'roleName' => 'Role',
    ];
  }

  public function messages()
  {
    return [
      'email.unique' => 'The :attribute, ":input" already exists.',
      'password.confirmed' => 'The :attribute doesn\'t match with confirm.',
    ];
  }
}
