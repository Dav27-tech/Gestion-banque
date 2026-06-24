<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller as BaseController;
use App\Models\Client;
use App\Models\Compte;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminDashboardController extends BaseController
{
    public function index()
    {
        $usersByRole = User::with('role')->get()->groupBy(function ($user) {
            return strtolower($user->role?->nom ?? 'sans_role');
        });

        $totalUtilisateurs = User::count();
        $totalClients = Client::count();
        $totalComptes = Compte::count();
        $comptesActifs = Compte::where('actif', true)->count();
        $comptesCourant = Compte::where('type_compte', 'courant')->count();
        $comptesEpargne = Compte::where('type_compte', 'epargne')->count();
        $soldeUsd = (float) Compte::where('devise', 'USD')->sum('solde');
        $soldeCdf = (float) Compte::where('devise', 'CDF')->sum('solde');
        $totalOperations = Transaction::count();

        $recentTransactions = Transaction::with(['compte.client', 'compteDestination.client', 'caissier'])
            ->latest()
            ->take(8)
            ->get();

        $transactionsEvolution = $this->transactionsEvolution();
        $depositsVsWithdrawals = $this->depositsVsWithdrawals();

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
                'admins' => $usersByRole->get('admin', collect())->count(),
                'managers' => $usersByRole->get('gestionnaire', collect())->count()
                    + $usersByRole->get('manager', collect())->count(),
                'cashiers' => $usersByRole->get('caissier', collect())->count()
                    + $usersByRole->get('cashier', collect())->count(),
                'auditors' => $usersByRole->get('auditeur', collect())->count()
                    + $usersByRole->get('auditor', collect())->count(),
                'clients' => $totalClients,
                'comptes' => $totalComptes,
                'comptes_actifs' => $comptesActifs,
                'comptes_courant' => $comptesCourant,
                'comptes_epargne' => $comptesEpargne,
                'solde_total' => $soldeUsd,
                'solde_usd' => $soldeUsd,
                'solde_cdf' => $soldeCdf,
                'total_operations' => $totalOperations,
                'transactionsEvolution' => $transactionsEvolution,
                'depositsVsWithdrawals' => $depositsVsWithdrawals,
            ],
            'recentTransactions' => $recentTransactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'reference' => $transaction->reference_unique,
                    'type' => $transaction->type,
                    'account_number' => $transaction->compte?->numero_compte,
                    'client' => trim(($transaction->compte?->client?->prenom ?? '') . ' ' . ($transaction->compte?->client?->nom ?? '')),
                    'amount' => (float) $transaction->montant,
                    'currency' => $transaction->compte?->devise ?? 'USD',
                    'created_at' => $transaction->created_at?->format('d/m/Y H:i'),
                ];
            })->values(),
            'recentActivities' => $recentTransactions->take(5)->map(function ($transaction) {
                return [
                    'id' => 'transaction-' . $transaction->id,
                    'action' => ucfirst($transaction->type) . ' enregistré',
                    'user_responsible' => $transaction->caissier?->name ?? 'Système',
                    'timestamp' => $transaction->created_at?->diffForHumans(),
                ];
            })->values(),
            'notifications' => $this->notifications($comptesActifs, $totalOperations),
        ]);
    }

    private function transactionsEvolution()
    {
        $startDate = now()->subDays(6)->startOfDay();
        $transactions = Transaction::where('created_at', '>=', $startDate)
            ->get()
            ->groupBy(fn ($transaction) => $transaction->created_at->format('Y-m-d'));

        return collect(CarbonPeriod::create($startDate, now()->startOfDay()))
            ->map(fn (Carbon $date) => [
                'date' => $date->translatedFormat('d M'),
                'count' => $transactions->get($date->format('Y-m-d'), collect())->count(),
            ])
            ->values();
    }

    private function depositsVsWithdrawals()
    {
        $startDate = now()->subWeeks(3)->startOfWeek();
        $transactions = Transaction::where('created_at', '>=', $startDate)
            ->get()
            ->groupBy(fn ($transaction) => $transaction->created_at->copy()->startOfWeek()->format('Y-m-d'));

        return collect(range(0, 3))->map(function ($weekOffset) use ($startDate, $transactions) {
            $weekStart = $startDate->copy()->addWeeks($weekOffset)->startOfWeek();
            $weekTransactions = $transactions->get($weekStart->format('Y-m-d'), collect());

            return [
                'period' => 'S' . ($weekOffset + 1),
                'deposits' => (float) $weekTransactions->where('type', 'depot')->sum('montant'),
                'withdrawals' => (float) $weekTransactions->where('type', 'retrait')->sum('montant'),
            ];
        })->values();
    }

    private function notifications(int $comptesActifs, int $totalOperations)
    {
        $notifications = collect();

        if ($comptesActifs === 0) {
            $notifications->push([
                'message' => 'Aucun compte actif disponible pour les opérations.',
            ]);
        }

        if ($totalOperations === 0) {
            $notifications->push([
                'message' => 'Aucune transaction enregistrée pour le moment.',
            ]);
        }

        return $notifications->values();
    }
}
