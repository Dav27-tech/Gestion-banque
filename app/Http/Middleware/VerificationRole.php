<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificationRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Si l'utilisateur n'est pas connecté ou n'a pas le bon rôle, on bloque
        if (!$request->user() || $request->user()->role->nom !== $role) {
            return response()->json([
                'message' => 'Accès interdit. Rôle insuffisant.'
            ], 403);
        }

        return $next($request);
    }
}