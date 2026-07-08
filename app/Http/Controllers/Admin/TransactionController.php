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
        ], [
            'compte_id.required' => 'Veuillez sélectionner le compte concerné.',
            'compte_id.exists' => "Le compte sélectionné n'existe pas.",
            'type.required' => "Veuillez sélectionner le type d'opération.",
            'type.in' => "Le type d'opération sélectionné est invalide.",
            'montant.required' => 'Veuillez saisir le montant.',
            'montant.numeric' => 'Le montant doit être un nombre valide.',
            'montant.gt' => 'Le montant doit être supérieur à zéro.',
            'compte_destination_id.required_if' => 'Veuillez sélectionner le compte bénéficiaire du virement.',
            'compte_destination_id.exists' => "Le compte bénéficiaire sélectionné n'existe pas.",
            'compte_destination_id.different' => "Le compte bénéficiaire doit être différent du compte d'origine.",
            'description.max' => 'La description ne peut pas dépasser 255 caractères.',
        ]);

        // Sécurisation de l'opération via une transaction de Base de Données
        DB::beginTransaction();

        try {
            $compteSource = Compte::findOrFail($validated['compte_id']);
            
            // Génération de la référence unique (Ex: TX-2026-A1B2C3)
            $reference = 'TX-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));

            // Pour le depot
            if ($validated['type'] === 'depot') {
                $compteSource->increment('solde', $validated['montant']);
            }

            // Pour le retrait
            elseif ($validated['type'] === 'retrait') {
                if ($compteSource->solde < $validated['montant']) {
                    DB::rollBack();

                    return redirect()->back()
                        ->withInput()
                        ->withErrors(['montant' => 'Solde insuffisant pour effectuer ce retrait.']);
                }
            }

            // Pour le virement
            elseif ($validated['type'] === 'virement') {
                if ($compteSource->solde < $validated['montant']) {
                    DB::rollBack();

                    return redirect()->back()
                        ->withInput()
                        ->withErrors(['montant' => 'Solde insuffisant pour effectuer ce virement.']);
                }

                $compteDestination = Compte::findOrFail($validated['compte_destination_id']);

                // Vérification Même devise obligatoire pour le virement
                if ($compteSource->devise !== $compteDestination->devise) {
                    DB::rollBack();

                    return redirect()->back()
                        ->withInput()
                        ->withErrors([
                            'compte_destination_id' => "Virement impossible : le compte d'origine est en {$compteSource->devise}, le compte bénéficiaire est en {$compteDestination->devise}. Les virements inter-devises ne sont pas autorisés.",
                        ]);
                }

                // Débit de la source et Crédit de la destination
                $compteSource->decrement('solde', $validated['montant']);
                $compteDestination->increment('solde', $validated['montant']);
            }

            // Enregistrement de la transaction dans l'historique
            Transaction::create([
                'compte_id' => $compteSource->id,
                'compte_destination_id' => $validated['compte_destination_id'] ?? null,
                'user_id' => Auth::id(), // ID du caissier connecté
                'type' => $validated['type'],
                'montant' => $validated['montant'],
                'reference_unique' => $reference,
                'description' => $validated['description'],

                'statut' => in_array($validated['type'], ['retrait', 'virement'])
                    ? 'en_attente'
                    : 'validee',
            ]);

            // Si tout s'est bien passé, on valide définitivement l'opération dans MySQL
            DB::commit();

            return redirect()->back()->with('success', 'Opération enregistrée avec succès.');

        } catch (\Exception $e) {
            // En cas de bug imprévu, on annule tout immédiatement
            DB::rollBack();

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Une erreur technique est survenue. Opération annulée.']);
        }
    }

    public function valider(Transaction $transaction)
    {
        $client = Auth::user()->client;

        if ($transaction->compte->client_id !== $client->id) {
            abort(403);
        }

        if ($transaction->statut !== 'en_attente') {
            return back()->withErrors([
                'error' => 'Cette transaction a déjà été traitée.'
            ]);
        }

        DB::beginTransaction();

        try {

            $compteSource = $transaction->compte;

            if ($transaction->type === 'retrait') {

                if ($compteSource->solde < $transaction->montant) {
                    DB::rollBack();

                    return back()->withErrors([
                        'error' => 'Solde insuffisant.'
                    ]);
                }

                $compteSource->decrement(
                    'solde',
                    $transaction->montant
                );
            }

            elseif ($transaction->type === 'virement') {

                $compteDestination =
                    $transaction->compteDestination;

                if ($compteSource->solde < $transaction->montant) {
                    DB::rollBack();

                    return back()->withErrors([
                        'error' => 'Solde insuffisant.'
                    ]);
                }

                $compteSource->decrement(
                    'solde',
                    $transaction->montant
                );

                $compteDestination->increment(
                    'solde',
                    $transaction->montant
                );
            }

            $transaction->update([
                'statut' => 'validee',
                'validated_at' => now(),
            ]);

            DB::commit();

            return back()->with(
                'success',
                'Transaction validée.'
            );

        } catch (\Exception $e) {

            DB::rollBack();

            return back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function rejeter(Transaction $transaction)
    {

        $client = Auth::user()->client;
        
        if ($transaction->compte->client_id !== $client->id) {
            abort(403);
        }

        if ($transaction->statut !== 'en_attente') {
            return back();
        }

        $transaction->update([
            'statut' => 'rejetee',
            'validated_at' => now(),
        ]);

        return back()->with(
            'success',
            'Transaction rejetée.'
        );
    }
}
