<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    // 1. Afficher la liste des clients et le formulaire d'ajout
    public function index()
    {
        return Inertia::render('Admin/Clients/Index', [
            'clients' => Client::latest()->get()
        ]);
    }

    // 2. Enregistrer un nouveau client dans la base de données
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:clients,email',
            'telephone' => 'required|string|max:20|unique:clients,telephone',
            'adresse' => 'nullable|string|max:255', // Prise en compte de ta nouvelle colonne
        ]);

        Client::create($validated);

        return redirect()->back();
    }
}