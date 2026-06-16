<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;

// Redirection automatique de la racine vers le login si non connecté
Route::get('/', function () {
    return redirect()->route('login');
});

// Routes d'authentification publiques
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Routes sécurisées par session et par rôle
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Section réservée à l'Administrateur
    Route::middleware('role:admin')->group(function () {
    // On appelle la méthode 'index' du AdminDashboardController
    Route::get('/admin/dashboard', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
});

    // Section réservée au Caissier
    Route::middleware('role:caissier')->group(function () {
        Route::get('/caissier/dashboard', function () {
            return inertia('Caissier/Dashboard'); // ⚠️ Charge ton fichier resources/js/Pages/Caissier/Dashboard.jsx
        })->name('caissier.dashboard');
    });
});