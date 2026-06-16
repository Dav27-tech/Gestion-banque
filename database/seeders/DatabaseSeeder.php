<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // On demande uniquement d'exécuter la création de l'admin
        $this->call([
            AdminSeeder::class,
        ]);
    }
}