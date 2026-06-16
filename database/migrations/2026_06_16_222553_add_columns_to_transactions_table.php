<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // 1. Pour l'éventuel compte bénéficiaire d'un virement
            $table->foreignId('compte_destination_id')->nullable()->after('compte_id')->constrained('comptes')->onDelete('set null');
            
            // 2. Référence unique pour les reçus de la banque
            $table->string('reference_unique')->unique()->after('montant');
            
            // 3. Motif ou libellé de l'opération
            $table->text('description')->nullable()->after('reference_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['compte_destination_id']);
            $table->dropColumn(['compte_destination_id', 'reference_unique', 'description']);
        });
    }
};
