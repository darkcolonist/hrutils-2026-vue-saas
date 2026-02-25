<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    $userId = $this->user->id;
    return [
      'firstname' => ['string', 'max:255'],
      'lastname' => ['string', 'max:255'],
      'email' => [
        'email',
        'max:255',
        Rule::unique('users')->ignore($userId),
      ],
    ];
  }
}
