<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Test
{
  /**
  * Handle an incoming request.
  *
  * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
  */
  public function handle(Request $request, Closure $next): Response
  {
    /**
     * APP_ENV=local
     * APP_DEBUG=true
     */
    if(env('APP_ENV') === 'local' && env('APP_DEBUG'))
      return $next($request);
    else
      throw new AuthorizationException('cannot test at this time');
  }
}
