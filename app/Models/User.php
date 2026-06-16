<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- NE PAS OUBLIER

class User extends Authenticatable
{
    // On met les 3 outils dont le modèle a besoin
    use HasApiTokens, HasFactory, Notifiable; 

    protected $fillable = ['name', 'email', 'password', 'role_id'];

    // Un utilisateur a UN SEUL rôle
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Un utilisateur (caissier) peut faire plusieurs transactions
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}