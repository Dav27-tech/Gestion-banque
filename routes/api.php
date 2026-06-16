<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route publique : N'importe qui peut tenter de se connecter
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées : Il faut obligatoirement être connecté (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // Route de déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Groupe réservé à l'Admin
    Route::middleware('role:admin')->group(function () {
        // Tu ajouteras tes routes admin ici plus tard, ex:
        // Route::post('/admin/creer-agent', [AdminController::class, 'store']);
    });

    // Groupe réservé au Caissier
    Route::middleware('role:caissier')->group(function () {
        // Route::post('/caissier/depot', [TransactionController::class, 'depot']);
    });

    // Groupe réservé au Gestionnaire
    Route::middleware('role:gestionnaire')->group(function () {
        // Route::post('/gestionnaire/creer-client', [ClientController::class, 'store']);
    });

    // Groupe réservé à l'Auditeur
    Route::middleware('role:auditeur')->group(function () {
        // Route::get('/auditeur/historique', [TransactionController::class, 'index']);
    });
});