<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateMetaRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    return [
      'user_id' => ['required', 'numeric', 'min:1', 'max:100000'],
      'group_ids' => ['required'],
    ];
  }
}
