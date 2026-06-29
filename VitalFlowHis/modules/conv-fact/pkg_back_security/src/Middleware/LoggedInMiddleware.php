<?php

declare(strict_types=1);

namespace pkg_back_security\tools\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LoggedInMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}
