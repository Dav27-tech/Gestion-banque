<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleAdmin = Role::firstOrCreate(['nom' => 'admin']);

        Role::firstOrCreate(['nom' => 'caissier']);
        Role::firstOrCreate(['nom' => 'gestionnaire']);
        Role::firstOrCreate(['nom' => 'auditeur']);
        Role::firstOrCreate(['nom' => 'client']);

        $motDePasse = env('ADMIN_PASSWORD', "122345678");

        User::updateOrCreate(
            ['email' => 'amanimusafiri2007@gmail.com'],
            [
                'name' => 'David MUSAFIRI',
                'password' => Hash::make($motDePasse),
                'role_id' => $roleAdmin->id, 
            ]
        );
    }
}
