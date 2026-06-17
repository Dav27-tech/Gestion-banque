<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    protected $fillable = ['numero_compte', 'solde', 'type_compte', 'taux_interet', 'client_id', 'devise', 'actif'];

    // Un compte appartient à un seul client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // Un compte peut subir plusieurs transactions (dépôts/retraits)
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}