<?php

namespace App\Http\Controllers\Gestionnaire;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GestionnaireController extends Controller
{
    public function index()
    {
        return Inertia::render('Gestionnaire/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => Auth::user()?->id,
                    'name' => Auth::user()?->name,
                    'email' => Auth::user()?->email,
                    'role' => Auth::user()?->role?->nom,
                ],
            ],
        ]);
    }
}