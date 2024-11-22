<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\ForceJsonResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(api: __DIR__ . '/../routes/api.php', health: '/up')
    ->withMiddleware(function (Middleware $middleware) {
        // Register the ForceJsonResponse middleware
        $middleware->prepend(ForceJsonResponse::class);
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom rendering for AuthenticationException
        $exceptions->render(function (
            \Illuminate\Auth\AuthenticationException $e,
            \Illuminate\Http\Request $request
        ) {
            return response()->json(
                [
                    'error' => 'Unauthenticated',
                    'message' => 'Access token is invalid or missing.',
                    'status' => 401,
                ],
                401
            );
        });
    })
    ->create();
