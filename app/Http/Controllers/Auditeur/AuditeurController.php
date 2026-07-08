<?php

namespace App\Http\Controllers\Auditeur;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Compte;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AuditeurController extends Controller
{
    public function index()
    {
        // 1. Récupérer l'historique complet de TOUTES les transactions de la banque
        // On charge les relations pour savoir quel client et quel caissier sont impliqués
        $transactions = Transaction::with(['compte.client', 'compteDestination.client', 'caissier'])
            ->latest()
            ->get();

        // 2. Calculer les statistiques globales de contrôle interne
        $totalSoldeUSD = Compte::where('devise', 'USD')->sum('solde');
        $totalSoldeCDF = Compte::where('devise', 'CDF')->sum('solde');
        
        $nombreComptesCourant = Compte::where('type_compte', 'courant')->count();
        $nombreComptesEpargne = Compte::where('type_compte', 'epargne')->count();

        // 3. Isoler le montant total des intérêts versés par le système (pour l'audit)
        $totalInteretsVersesUSD = Transaction::where('reference_unique', 'LIKE', 'INT-%')
            ->whereHas('compte', function($query) {
                $query->where('devise', 'USD');
            })->sum('montant');

        $totalInteretsVersesCDF = Transaction::where('reference_unique', 'LIKE', 'INT-%')
            ->whereHas('compte', function($query) {
                $query->where('devise', 'CDF');
            })->sum('montant');

        // 4. Envoi des données filtrées à la vue React d'Inertia
        return Inertia::render('Auditeur/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ]
            ],
            'transactions' => $transactions,
            'stats' => [
                'masse_monetaire_usd' => $totalSoldeUSD,
                'masse_monetaire_cdf' => $totalSoldeCDF,
                'comptes_courant'     => $nombreComptesCourant,
                'comptes_epargne'     => $nombreComptesEpargne,
                'interets_usd'        => $totalInteretsVersesUSD,
                'interets_cdf'        => $totalInteretsVersesCDF,
                'total_operations'    => $transactions->count()
            ]
        ]);
    }
}