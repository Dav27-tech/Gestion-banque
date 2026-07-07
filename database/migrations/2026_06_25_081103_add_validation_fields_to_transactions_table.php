<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {

            $table->enum('statut', [
                'en_attente',
                'validee',
                'rejetee'
            ])->default('en_attente');

            $table->timestamp('validated_at')->nullable();

            $table->foreignId('client_validateur_id')
                ->nullable()
                ->constrained('clients')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {

            $table->dropForeign(['client_validateur_id']);

            $table->dropColumn([
                'statut',
                'validated_at',
                'client_validateur_id'
            ]);
        });
    }
};