import React from 'react';
import { usePage, router } from '@inertiajs/react';

export default function Dashboard() {
    // ⚠️ On extrait 'props' de manière sécurisée avec des valeurs de secours par défaut
    const { props } = usePage();
    const stats = props?.stats || {
        utilisateurs: 0,
        clients: 0,
        comptes: 0,
        solde_total: 0,
    };
    const auth = props?.auth || {
        user: { name: 'Utilisateur', email: '', role: '' },
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div
            style={{
                padding: '30px',
                backgroundColor: '#f9fafb',
                minHeight: '100vh',
                color: '#111827',
                fontFamily: 'sans-serif',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '15px',
                    marginBottom: '25px',
                }}
            >
                <div>
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: 0,
                        }}
                    >
                        Dashboard Admin
                    </h2>
                    <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                        Vue d'ensemble du système
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    <span style={{ fontSize: '15px', color: '#374151' }}>
                        Connecté :{' '}
                        <strong style={{ color: '#1e40af' }}>
                            {auth?.user?.name}
                        </strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500',
                        }}
                    >
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Reste de tes boîtes statistiques... */}
        </div>
    );
}
