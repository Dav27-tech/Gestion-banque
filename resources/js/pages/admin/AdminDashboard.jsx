import React from 'react';
import { router } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Espace Administrateur 🛡️</h1>
            <p>Bienvenue sur ton tableau de bord, David.</p>
            <button
                onClick={() => router.post('/logout')}
                style={{ padding: '8px', cursor: 'pointer' }}
            >
                Déconnexion
            </button>
        </div>
    );
}
