<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller as BaseController;
use App\Models\User;
// Importe tes autres modèles ici dès qu'ils seront créés (Client, Compte, etc.)
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminDashboardController extends BaseController
{
    public function index()
    {
        // 1. Calcul des statistiques (Sécurisé avec des valeurs par défaut si les tables sont vides)
        $totalUtilisateurs = User::count();
        
        // Temporairement mis à 0 ou calculé si tes modèles Clients et Comptes existent déjà :
        $totalClients = 0; // Exemple: Client::count();
        $totalComptes = 0; // Exemple: Compte::count();
        $soldeTotal = 0;   // Exemple: Compte::sum('solde');

        // 2. Envoi des données au composant React existant
        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ]
            ],
            'stats' => [
                'utilisateurs' => $totalUtilisateurs,
                'clients' => $totalClients,
                'comptes' => $totalComptes,
                'solde_total' => $soldeTotal,
            ],
        ]);
    }
}