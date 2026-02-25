<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookUpdateRequest extends FormRequest
{
  /**
  * Get the validation rules that apply to the request.
  *
  * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
  */
  public function rules(): array
  {
    return [
      'title' => ['string', 'min:3', 'max:255'],
      'author' => ['string', 'min:3', 'max:255'],
    ];
  }
}
