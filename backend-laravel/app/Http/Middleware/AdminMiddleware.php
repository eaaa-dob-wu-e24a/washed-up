<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        return $next($request);
    }
} 