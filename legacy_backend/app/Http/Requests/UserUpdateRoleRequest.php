<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRoleRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    return [
      /**
       * TODO implement later such that only POSSIBLE roles can be
       * assigned by the current user
       */
      'roleName' => ['required'],
    ];
  }
}
