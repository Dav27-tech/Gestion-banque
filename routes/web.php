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

// ---------------------------------------------------------
// 1. PORTES D'ENTRÉE CLOISONNÉES (PUBLIQUES)
// ---------------------------------------------------------
Route::get('/login', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'admin']); })->name('login');
Route::get('/caissier', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'caissier']); })->name('login.caissier');
Route::get('/gestionnaire', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'gestionnaire']); })->name('login.gestionnaire');
Route::get('/auditeur', function () { return Inertia::render('Auth/Login', ['intendedRole' => 'auditeur']); })->name('login.auditeur');
// Route POST pour traiter la soumission du formulaire de connexion (session-based)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.attempt');
// Route de déconnexion pour les sessions basées sur le web
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// ---------------------------------------------------------
// 2. SÉCURISATION DES ESPACES DE TRAVAIL (ROUTES PRIVÉES)
// ---------------------------------------------------------

// ESPACE ADMIN : Il contrôle tout le système et crée le personnel
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('/admin/users', UserController::class); // Gestion du personnel
});

// ESPACE GESTIONNAIRE : Il gère les clients et ouvre les comptes (avec taux d'intérêt)
Route::middleware(['auth', 'role:gestionnaire'])->group(function () {
    Route::get('/gestionnaire/dashboard', function () { return Inertia::render('Gestionnaire/Dashboard'); })->name('gestionnaire.dashboard');
    Route::get('/gestionnaire/clients', [ClientController::class, 'index'])->name('gestionnaire.clients.index');
    Route::post('/gestionnaire/clients', [ClientController::class, 'store'])->name('gestionnaire.clients.store');
    Route::get('/gestionnaire/comptes', [CompteController::class, 'index'])->name('gestionnaire.comptes.index');
    Route::post('/gestionnaire/comptes', [CompteController::class, 'store'])->name('gestionnaire.comptes.store');
});

// ESPACE CAISSIER : Il gère uniquement les dépôts et retraits d'argent au guichet
Route::middleware(['auth', 'role:caissier'])->group(function () {
    Route::get('/caissier/transactions', [TransactionController::class, 'index'])->name('caissier.transactions.index');
    Route::post('/caissier/transactions', [TransactionController::class, 'store'])->name('caissier.transactions.store');
});

// ESPACE AUDITEUR : Il consulte l'historique général, calcule les intérêts et sort les rapports
Route::middleware(['auth', 'role:auditeur'])->group(function () {
    Route::get('/auditeur/dashboard', [AuditeurController::class, 'index'])->name('auditeur.dashboard');
});