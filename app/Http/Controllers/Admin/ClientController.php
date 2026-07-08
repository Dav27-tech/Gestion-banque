<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    // 1. Afficher la liste des clients et le formulaire d'ajout
    public function index()
    {
        return Inertia::render('Gestionnaire/Clients/Index', [
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ]
            ],
            'clients' => Client::with('temporary')->latest()->get(),
            'users' => User::with('role')->latest()->get()->where('role_id' ,5),
        ]);
    }

    // 2. Enregistrer un nouveau client 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:clients,email|unique:users,email',
            'telephone' => 'required|string|max:20|unique:clients,telephone',
            'adresse' => 'nullable|string|max:255',
        ]);

        // Génération du mot de passe temporaire
        $passwordTemporaire = 'CLT' . rand(100000, 999999);

        // Recherche du rôle client
        $roleClient = Role::where('nom', 'client')->first();

        // Création du compte utilisateur
        $user = User::create([
        'name' => $validated['prenom'] . ' ' . $validated['nom'],
        'email' => $validated['email'],
        'password' => Hash::make($passwordTemporaire),
        'temporary_password' => $passwordTemporaire,
        'must_change_password' => true,
        'role_id' => $roleClient->id,
    ]);

        // Création du client
        Client::create([
            ...$validated,
            'user_id' => $user->id,
        ]);

        return redirect()->back()->with([
            'success' => 'Client créé avec succès',
            'generated_password' => $passwordTemporaire,
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        $user = User::find(Auth::id());
    
        $user->update([
            'password' => Hash::make($request->password),
            'temporary_password' => null,
            'must_change_password' => false,
        ]);
    
        return redirect()->route('client.dashboard')
            ->with('success', 'Mot de passe modifié avec succès.');
    }

    public function transactions()
    {
        $client = Auth::user()->client;

        $transactions = Transaction::with([
                'compte',
                'compteDestination'
            ])
            ->whereHas('compte', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })
            ->where('statut', 'en_attente')
            ->latest()
            ->get();

        $transferts = Transaction::with([
                'compte',
                'compteDestination'
            ])
            ->whereHas('compte', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Client/Transactions',[
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ],

            ],
                'transactions' => $transactions,
                'transferts' => $transferts,
            ],
        );
    }

    public function dashboard()
    {
        $client = Auth::user()->client;

        $transactions = Transaction::with([
                'compte',
                'compteDestination'
            ])
            ->whereHas('compte', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })
            ->where('statut', 'en_attente')
            ->latest()
            ->get();

        $transferts = Transaction::with([
                'compte',
                'compteDestination'
            ])
            ->whereHas('compte', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })
            ->where('statut', 'validee')
            ->latest()
            ->get();

        $transferts_rejetes = Transaction::with([
                'compte',
                'compteDestination'
            ])
            ->whereHas('compte', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })
            ->where('statut', 'rejetee')
            ->latest()
            ->get();

        return Inertia::render('Client/Dashboard',[
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ],
            ],
                'transactions' => $transactions,
                'transferts' => $transferts,
                'transferts_rejetes' => $transferts_rejetes,
            ],
        );
    }
}