<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\CompteController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Auditeur\AuditeurController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// 1. Portes d'entrées publiques

Route::get('/login', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'admin']); })->name('login');
Route::get('/caissier', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'caissier']); })->name('login.caissier');
Route::get('/gestionnaire', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'gestionnaire']); })->name('login.gestionnaire');
Route::get('/auditeur', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'auditeur']); })->name('login.auditeur');
Route::get('/client', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'client']); })->name('login.client');
// Route POST pour traiter la soumission du formulaire de connexion (session-based)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.attempt');
// Route de déconnexion pour les sessions basées sur le web
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// 2. Sécurisation des espaces de travail
// Espace admin
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('/admin/users', UserController::class); // Gestion du personnel
});

// Espace gestionnaire
Route::middleware(['auth', 'role:gestionnaire'])->group(function () {
    Route::get('/gestionnaire/clients', [ClientController::class, 'index'])->name('gestionnaire.clients.index');
    Route::post('/gestionnaire/clients', [ClientController::class, 'store'])->name('gestionnaire.clients.store');
    Route::get('/gestionnaire/comptes', [CompteController::class, 'index'])->name('gestionnaire.comptes.index');
    Route::post('/gestionnaire/comptes', [CompteController::class, 'store'])->name('gestionnaire.comptes.store');
});

// Espace caissier
Route::middleware(['auth', 'role:caissier'])->group(function () {
    Route::get('/caissier/transactions', [TransactionController::class, 'index'])->name('caissier.transactions.index');
    Route::post('/caissier/transactions', [TransactionController::class, 'store'])->name('caissier.transactions.store');
});

// Espace auditeur
Route::middleware(['auth', 'role:auditeur'])->group(function () {
    Route::get('/auditeur/dashboard', [AuditeurController::class, 'index'])->name('auditeur.dashboard');
});

// Espace client
Route::middleware(['auth', 'role:client'])->group(function () {
    Route::get('/client/dashboard', 
        [ClientController::class, 'dashboard']
    )->name('client.dashboard');

    Route::get('/client/change-password', function () {
        return Inertia::render('Client/ChangePassword');
    })->name('client.change-password');

    Route::post('/client/change-password', [ClientController::class, 'changePassword'])
    ->name('client.change-password.store');

    Route::get(
        '/client/transactions',
        [ClientController::class, 'transactions']
    )->name('client.transactions');
});

Route::patch(
    '/transactions/{transaction}/valider',
    [TransactionController::class, 'valider']
)->name('transactions.valider');

Route::patch(
    '/transactions/{transaction}/rejeter',
    [TransactionController::class, 'rejeter']
)->name('transactions.rejeter');