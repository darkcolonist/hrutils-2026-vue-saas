<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveRoleRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    $role = $this->role;

    return [
      'name' => [
        'string',
        'min:3',
        'max:25',
        Rule::unique('roles', 'name')->ignore($role),
        function ($attribute, $value, $fail) use ($role) {
          if ($role && $role->is_protected) {
            $fail('role is protected');
          }
        }
      ],
    ];
  }
}
