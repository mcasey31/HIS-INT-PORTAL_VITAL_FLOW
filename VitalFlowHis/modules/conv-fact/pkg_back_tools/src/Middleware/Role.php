<?php

declare(strict_types=1);

namespace odi_back\tools\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        return $next($request);
    }
}
