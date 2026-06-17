import React from 'react';
import { usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    const { props } = usePage();
    const stats = props?.stats || {
        clients: 0,
        comptes: 0,
    };
    const auth = props?.auth || { user: { name: 'Gestionnaire' } };

    return (
        <div style={{ padding: '28px', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>Dashboard Gestionnaire</h2>
                    <p style={{ margin: 0, color: '#6b7280' }}>Gestion des clients et des comptes</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ color: '#374151' }}>Connecté : <strong style={{ color: '#0d9488' }}>{auth?.user?.name}</strong></div>
                    {auth?.user?.role === 'admin' && (
                        <Link href="/admin/dashboard" style={{ padding: '8px 12px', background: '#1e40af', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>Retour Admin</Link>
                    )}
                    <Link href={typeof route !== 'undefined' ? route('logout') : '/logout'} method="post" as="button" style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Déconnexion</Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>Clients</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.clients}</div>
                </div>

                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>Comptes</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.comptes}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/gestionnaire/clients" style={{ padding: '10px 14px', background: '#0d9488', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    Gérer les clients
                </Link>

                <Link href="/gestionnaire/comptes" style={{ padding: '10px 14px', background: '#06b6d4', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    Gérer les comptes
                </Link>

                {/* Le gestionnaire n'a pas accès aux opérations caissier; lien supprimé */}
            </div>
        </div>
    );
}
