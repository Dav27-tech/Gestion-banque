<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = ['nom', 'prenom', 'telephone'];

    // Un client peut avoir plusieurs comptes bancaires (ex: un compte courant ET un compte épargne)
    public function comptes()
    {
        return $this->hasMany(Compte::class);
    }
}