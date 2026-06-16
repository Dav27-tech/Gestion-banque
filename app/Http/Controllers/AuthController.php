<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends BaseController
{
    // Afficher la page de connexion via Inertia
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    // Gérer la tentative de connexion
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Tentative de connexion via les sessions standard de Laravel
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // Redirection dynamique selon le rôle de l'utilisateur connecté
            $role = Auth::user()->role->nom;

            return match ($role) {
                'admin' => redirect()->intended('/admin/dashboard'),
                'caissier' => redirect()->intended('/caissier/dashboard'),
                'gestionnaire' => redirect()->intended('/gestionnaire/dashboard'),
                'auditeur' => redirect()->intended('/auditeur/dashboard'),
                default => redirect('/'),
            };
        }

        throw ValidationException::withMessages([
            'email' => 'Identifiants incorrects.',
        ]);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}