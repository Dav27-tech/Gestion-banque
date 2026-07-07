<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Auditeur\AuditeurController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

    // Route publique : N'importe qui peut tenter de se connecter
    Route::post('/login', [AuthenticatedSessionController::class, 'login']);
    
    // Routes protégées : Il faut obligatoirement être connecté (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
    
    // Route de déconnexion
    Route::post('/logout', [AuthenticatedSessionController::class, 'logout']);

    // Groupe réservé à l'Admin
    Route::middleware('role:admin')->group(function () {
        Route::post('/admin/users', [AdminDashboardController::class, 'store']);
        Route::post('/admin/dashboard', [AdminDashboardController::class, 'store']);
    });

    // Groupe réservé au Caissier
    Route::middleware('role:caissier')->group(function () {
        Route::post('/caissier/transactions', [TransactionController::class, 'depot']);
    });

    // Groupe réservé au Gestionnaire
    Route::middleware('role:gestionnaire')->group(function () {
        Route::post('/gestionnaire/clients', [ClientController::class, 'store']);
        Route::post('/gestionnaire/comptes', [ClientController::class, 'store']);
    });

    // Groupe réservé à l'Auditeur
    Route::middleware('role:auditeur')->group(function () {
        Route::get('/auditeur/dashboard', [AuditeurController::class, 'index']);
    });
});