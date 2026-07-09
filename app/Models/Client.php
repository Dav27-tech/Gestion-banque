<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'adresse',
        'user_id'
        
    ];   // Un client peut avoir plusieurs comptes bancaires (courant ou epargne)
    public function comptes()
    {
        return $this->hasMany(Compte::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function temporary(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function compte(): BelongsTo
    {
        return $this->belongsTo(Compte::class, 'compte_id');
    }
}