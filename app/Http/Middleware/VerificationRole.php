<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerificationRole
{
    /**
     * Gérer la requête entrante.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Vérifier si l'utilisateur est connecté
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // 2. Vérifier si son rôle correspond au rôle requis
        if ($request->user()->role->nom !== $role) {
            // Optionnel : Tu peux rediriger vers une page 403 personalisée Inertia
            abort(403, 'Accès non autorisé à cet espace.');
        }

        return $next($request);
    }
}