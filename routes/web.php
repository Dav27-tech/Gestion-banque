<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Routes d'authentification publiques
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Routes protégées par session
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Protection par rôle (via ton middleware 'role' configuré dans bootstrap/app.php)
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () { return inertia('Admin/Dashboard'); });
    });

    Route::middleware('role:caissier')->group(function () {
        Route::get('/caissier/dashboard', function () { return inertia('Caissier/Dashboard'); });
    });
});