<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validation des données reçues
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Chercher l'utilisateur avec son rôle
        $user = User::where('email', $request->email)->with('role')->first();

        // 3. Vérifier si l'utilisateur existe et si le mot de passe est correct
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants incorrects.'
            ], 401);
        }

        // 4. Créer le token de session avec Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Renvoyer la réponse à React (L'utilisateur, son rôle et le token)
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->nom // Ex: 'admin', 'caissier'...
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // Supprimer le token actuel pour déconnecter l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }
}