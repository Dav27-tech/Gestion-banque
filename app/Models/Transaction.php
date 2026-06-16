<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['compte_id', 'user_id', 'type', 'montant'];

    // Une transaction concerne UN SEUL compte
    public function compte()
    {
        return $this->belongsTo(Compte::class);
    }

    // Une transaction est effectuée par UN SEUL employé (le caissier)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}