<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
    ];   // Un client peut avoir plusieurs comptes bancaires (ex: un compte courant ET un compte épargne)
    public function comptes()
    {
        return $this->hasMany(Compte::class);
    }
}