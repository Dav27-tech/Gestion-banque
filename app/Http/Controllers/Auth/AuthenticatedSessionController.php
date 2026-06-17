<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Gérer la tentative d'authentification unique et multi-poste
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validation stricte des données envoyées par le formulaire React
        $credentials = $request->validate([
            'email'        => 'required|string|email',
            'password'     => 'required|string',
            'role_attendu' => 'required|string|in:admin,gestionnaire,caissier,auditeur',
        ]);

        // 2. Tentative de connexion via les identifiants classiques (Email / Mot de passe)
        if (Auth::attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password']], 
            $request->boolean('remember')
        )) {
            
            // Régénération de la session pour des raisons de sécurité (anti-fixation de session)
            $request->session()->regenerate();
            
            $user = Auth::user();

            // 3. BARRIÈRE DE SÉCURITÉ CRUCIALE : L'utilisateur a-t-il le rôle requis pour CETTE URL ?
            // On vérifie la relation "role" déclarée dans ton modèle User (ex: $user->role->nom)
            if (!$user->role || $user->role->nom !== $credentials['role_attendu']) {
                
                // Si le rôle ne correspond pas, on le déconnecte de force immédiatement
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->back()->withErrors([
                    'email' => "Accès refusé. Ce compte n'est pas autorisé sur le poste : " . strtoupper($credentials['role_attendu']) . "."
                ]);
            }

            // 4. AIGUILLAGE ET REDIRECTION VERS L'ESPACE DÉDIÉ
            switch ($user->role->nom) {
                case 'admin':
                    return redirect()->intended(route('admin.dashboard'));
                
                case 'gestionnaire':
                    return redirect()->intended(route('gestionnaire.dashboard'));
                
                case 'caissier':
                    return redirect()->intended(route('caissier.transactions.index'));
                
                case 'auditeur':
                    return redirect()->intended(route('auditeur.dashboard'));
                
                default:
                    Auth::logout();
                    return redirect('/');
            }
        }

        // Si les identifiants (email ou mot de passe) sont faux
        return redirect()->back()->withErrors([
            'email' => 'Ces identifiants ne correspondent pas à nos enregistrements.',
        ]);
    }

    /**
     * Déconnecter l'utilisateur (Valable pour tous les postes)
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $rolePrecedent = $user && $user->role ? $user->role->nom : null;

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirection intelligente : on le renvoie sur la page de login de son propre poste
        if ($rolePrecedent && $rolePrecedent !== 'admin') {
            return redirect('/' . $rolePrecedent);
        }

        return redirect('/login');
    }
}