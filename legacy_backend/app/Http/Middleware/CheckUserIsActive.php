<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserIsActive
{
  /**
  * Handle an incoming request.
  *
  * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
  */
public function handle(Request $request, Closure $next): Response
  {
    if (auth()->check() && !auth()->user()->is_active) {
      auth()->logout();
      return to_route('login')->with('error', 'Your account has been deactivated.');
    }

    return $next($request);
  }
}
