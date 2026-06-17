import React from 'react';
import { usePage, Link } from '@inertiajs/react';

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

    // Utiliser Link Inertia avec `method="post"` pour la déconnexion

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
            <div style={{ display: 'flex', gap: '20px' }}>
                <aside style={{ width: '220px', background: '#ffffff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>Admin</h3>
                    <nav style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Link href="/admin/dashboard" style={{ padding: '8px 10px', borderRadius: '6px', color: '#111827', textDecoration: 'none' }}>Dashboard</Link>
                        <Link href="/admin/users" style={{ padding: '8px 10px', borderRadius: '6px', color: '#111827', textDecoration: 'none' }}>Utilisateurs</Link>
                        <Link href="/gestionnaire/clients" style={{ padding: '8px 10px', borderRadius: '6px', color: '#111827', textDecoration: 'none' }}>Clients</Link>
                        <Link href="/gestionnaire/comptes" style={{ padding: '8px 10px', borderRadius: '6px', color: '#111827', textDecoration: 'none' }}>Comptes</Link>
                        <Link href="/caissier/transactions" style={{ padding: '8px 10px', borderRadius: '6px', color: '#111827', textDecoration: 'none' }}>Transactions</Link>
                        <Link href={typeof route !== 'undefined' ? route('logout') : '/logout'} method="post" as="button" style={{ marginTop: '12px', padding: '8px 10px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', textAlign: 'center' }}>Déconnexion</Link>
                    </nav>
                </aside>

                <main style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '25px' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Dashboard Admin</h2>
                            <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Vue d'ensemble du système</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '15px', color: '#374151' }}>
                                Connecté : <strong style={{ color: '#1e40af' }}>{auth?.user?.name}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Boîtes statistiques simples */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '20px' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Utilisateurs</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{stats.utilisateurs}</div>
                </div>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Clients</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{stats.clients}</div>
                </div>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Comptes</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{stats.comptes}</div>
                </div>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Solde total</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{stats.solde_total}</div>
                </div>
            </div>

            {/* Actions rapides pour l'admin */}
            <div style={{ marginTop: '28px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link href="/admin/users" style={{ padding: '10px 14px', background: '#1e40af', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    Gérer les utilisateurs
                </Link>

                <Link href="/gestionnaire/comptes" style={{ padding: '10px 14px', background: '#0d9488', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    Aller aux comptes (Gestionnaire)
                </Link>

                <Link href="/caissier/transactions" style={{ padding: '10px 14px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    Voir les transactions (Caissier)
                </Link>
            </div>
                </main>
            </div>
        </div>
    );
}
