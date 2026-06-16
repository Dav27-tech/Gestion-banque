<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Compte;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompteController extends Controller
{
    // 1. Afficher la liste des comptes avec leurs clients et le formulaire de création
    public function index()
    {
        return Inertia::render('Admin/Comptes/Index', [
            // On récupère les comptes en y joignant les informations du client associé
            'comptes' => Compte::with('client')->latest()->get(),
            // On récupère la liste des clients pour remplir le sélecteur du formulaire
            'clients' => Client::select('id', 'nom', 'prenom', 'telephone')->get()
        ]);
    }

    // 2. Enregistrer un nouveau compte bancaire
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'   => 'required|exists:clients,id',
            'type_compte' => 'required|in:courant,epargne',
            'devise'      => 'required|in:USD,CDF',
            'solde'       => 'required|numeric|min:0',
        ]);

        // Algorithme de génération automatique d'un numéro de compte unique
        do {
            // Génère un numéro du style : GBA-2026-84739 (Gestion Bancaire Application)
            $numeroCompte = 'GBA-' . date('Y') . '-' . rand(10000, 99990);
        } while (Compte::where('numero_compte', $numeroCompte)->exists());

        // Insertion dans la base de données
        Compte::create([
            'client_id'     => $validated['client_id'],
            'type_compte'   => $validated['type_compte'],
            'devise'        => $validated['devise'],
            'solde'         => $validated['solde'],
            'numero_compte' => $numeroCompte,
            'actif'         => true,
        ]);

        return redirect()->back();
    }
}