<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Compte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    // 1. Afficher l'historique et le formulaire d'opération
    public function index()
    {
        return Inertia::render('Caissier/Transactions/Index', [
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ]
            ],
            'transactions' => Transaction::with(['compte.client', 'compteDestination.client', 'caissier'])->latest()->get(),
            'comptes' => Compte::with('client')->where('actif', true)->get() // Uniquement les comptes actifs
        ]);
    }

    // 2. Traiter une opération financière (Dépôt, Retrait, Virement)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'compte_id' => 'required|exists:comptes,id',
            'type' => 'required|in:depot,retrait,virement',
            'montant' => 'required|numeric|gt:0',
            'compte_destination_id' => 'required_if:type,virement|nullable|exists:comptes,id|different:compte_id',
            'description' => 'nullable|string|max:255',
        ]);

        // Sécurisation de l'opération via une transaction de Base de Données
        DB::beginTransaction();

        try {
            $compteSource = Compte::findOrFail($validated['compte_id']);
            
            // Génération de la référence unique (Ex: TX-2026-A1B2C3)
            $reference = 'TX-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));

            // --- CAS 1 : DÉPÔT ---
            if ($validated['type'] === 'depot') {
                $compteSource->increment('solde', $validated['montant']);
            }

            // --- CAS 2 : RETRAIT ---
            elseif ($validated['type'] === 'retrait') {
                if ($compteSource->solde < $validated['montant']) {
                    return redirect()->back()->withErrors(['montant' => 'Solde insuffisant pour effectuer ce retrait.']);
                }
                $compteSource->decrement('solde', $validated['montant']);
            }

            // --- CAS 3 : VIREMENT ---
            elseif ($validated['type'] === 'virement') {
                if ($compteSource->solde < $validated['montant']) {
                    return redirect()->back()->withErrors(['montant' => 'Solde insuffisant pour effectuer ce virement.']);
                }

                $compteDestination = Compte::findOrFail($validated['compte_destination_id']);

                // ⚠️ Vérification cruciale : Même devise obligatoire pour le virement
                if ($compteSource->devise !== $compteDestination->devise) {
                    return redirect()->back()->withErrors(['compte_destination_id' => 'Les virements inter-devises ne sont pas autorisés.']);
                }

                // Débit de la source et Crédit de la destination
                $compteSource->decrement('solde', $validated['montant']);
                $compteDestination->increment('solde', $validated['montant']);
            }

            // Enregistrement de la transaction dans l'historique
            Transaction::create([
                'compte_id' => $compteSource->id,
                'compte_destination_id' => $validated['compte_destination_id'] ?? null,
                'user_id' => Auth::id(), // ID du caissier/admin connecté
                'type' => $validated['type'],
                'montant' => $validated['montant'],
                'reference_unique' => $reference,
                'description' => $validated['description'],
            ]);

            // Si tout s'est bien passé, on valide définitivement l'opération dans MySQL
            DB::commit();

            return redirect()->back();

        } catch (\Exception $e) {
            // En cas de bug imprévu, on annule tout immédiatement
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Une erreur technique est survenue. Opération annulée.']);
        }
    }
}