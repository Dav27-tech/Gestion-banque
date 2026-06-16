<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    // 1. Afficher la liste des utilisateurs et le formulaire
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('role')->latest()->get(),
            'roles' => Role::all() // Permet d'afficher les rôles (admin, caissier...) dans le formulaire select
        ]);
    }

    // 2. Enregistrer un nouvel agent de la banque dans la base de données
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
        ]);

        return redirect()->back();
    }
}