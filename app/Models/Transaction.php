<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'compte_id',
        'compte_destination_id',
        'user_id', // Le caissier
        'type',    // depot, retrait, virement
        'montant',
        'reference_unique',
        'description',
    ];

   // Le compte principal émetteur ou concerné
    public function compte(): BelongsTo
    {
        return $this->belongsTo(Compte::class, 'compte_id');
    }

    // Le compte bénéficiaire (si virement)
    public function compteDestination(): BelongsTo
    {
        return $this->belongsTo(Compte::class, 'compte_destination_id');
    }

    // Le caissier qui a fait l'action
    public function caissier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}