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
     * Traiter la tentative de connexion unique et multi-poste
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validation stricte des données envoyées par le formulaire React
        $credentials = $request->validate([
            'email'        => 'required|string|email',
            'password'     => 'required|string',
            'role_attendu' => 'required|string|in:admin,gestionnaire,caissier,auditeur',
        ]);

        // 2. Tentative de connexion (Email + Mot de passe)
        if (Auth::attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password']], 
            $request->boolean('remember')
        )) {
            
            // Régénération de la session pour bloquer les attaques de fixation de session
            $request->session()->regenerate();
            
            $user = Auth::user();

            // 3. BARRIÈRE DE SÉCURITÉ : Autoriser l'admin partout, vérifier les rôles manquants
            $userRole = $user->role ? $user->role->nom : null;

            if ($userRole !== 'admin' && $userRole !== $credentials['role_attendu']) {
                // Déconnexion immédiate si le rôle ne correspond pas au poste demandé
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->back()->withErrors([
                    'email' => "Accès refusé. Ce compte n'est pas autorisé sur le poste : " . strtoupper($credentials['role_attendu']) . "."
                ]);
            }

            // 4. AIGUILLAGE CHIRURGICAL (Redirection par nom de route pour éviter le bug 404)
            // Si l'utilisateur est admin, on l'autorise à accéder au portail demandé
            if ($userRole === 'admin') {
                $intended = $credentials['role_attendu'];
                $route = $intended === 'caissier' ? 'caissier.transactions.index' : ($intended . '.dashboard');
                return redirect()->route($route);
            }

            // Sinon, redirection normale selon le rôle de l'utilisateur
            switch ($userRole) {
                case 'gestionnaire':
                    return redirect()->route('gestionnaire.dashboard');

                case 'caissier':
                    return redirect()->route('caissier.transactions.index');

                case 'auditeur':
                    return redirect()->route('auditeur.dashboard');

                default:
                    Auth::logout();
                    return redirect('/');
            }
        }

        // Si l'email ou le mot de passe est incorrect
        return redirect()->back()->withErrors([
            'email' => 'Ces identifiants ne correspondent pas à nos enregistrements.',
        ]);
    }

    /**
     * Déconnecter l'utilisateur et le renvoyer vers son portail d'origine
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $rolePrecedent = $user && $user->role ? $user->role->nom : null;

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirection intelligente : renvoie l'utilisateur sur le login de son propre poste
        if ($rolePrecedent && $rolePrecedent !== 'admin') {
            return redirect('/' . $rolePrecedent);
        }

        return redirect('/login');
    }
}