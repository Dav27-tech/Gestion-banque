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

        // 2. Permettre à l'admin d'accéder partout, gérer les rôles manquants
        $userRole = $request->user()->role ? $request->user()->role->nom : null;

        // Si pas de rôle ou rôle différent et l'utilisateur n'est pas admin => accès refusé
        if ($userRole !== 'admin' && $userRole !== $role) {
            abort(403, 'Accès non autorisé à cet espace.');
        }

        return $next($request);
    }
}