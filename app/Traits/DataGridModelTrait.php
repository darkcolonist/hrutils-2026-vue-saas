<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Barryvdh\Debugbar\Facades\Debugbar;
trait DataGridModelTrait
{
  private static function validateIndex(){
    $validator = Validator::make(request()->all(), [
      'limit' => 'numeric|min:5|max:50',
      'page' => 'numeric|gte:1',
    ]);

    return [
      "failed" => $validator->fails(),
      "errors" => $validator->errors()
    ];
  }

  private static function getSortModel(){
    $sortModel = request()->get("sortModel", null);

    if($sortModel === null)
      return false;

    try {
      $decoded = json_decode(request()->get("sortModel"),true);

      if(count($decoded))
        $decoded = $decoded[0];

    } catch (\Throwable $th) {
      throw new \Error("malformed sort model");
    }
    return $decoded;
  }

  private static function getSearchKeyword(){
    if(request()->input("keyword") == null)
      return false;

    return request()->input("keyword");
  }

  private static function getFilterModel(){
    $filterModel = request()->input("filterModel", null);

    if($filterModel === null)
      return false;

    try {
      $decoded = json_decode(request()->input("filterModel"),true)["quickFilterValues"];

      if(count($decoded) < 1){ // empty search
        return false;
      }else{
        $decoded = $decoded[0];
      }


      if(trim($decoded) == "")
        return false;
    } catch (\Throwable $th) {
      throw new \Error("malformed filter model");
    }
    return $decoded;
  }
}