import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const auth = usePage().props.auth;

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                background: '#f9fafb',
            }}
        >
            <aside
                style={{
                    width: 240,
                    padding: 20,
                    background: '#ffffff',
                    borderRight: '1px solid #e5e7eb',
                }}
            >
                <div style={{ marginBottom: 18 }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#111827' }}>
                        Administration
                    </h3>
                    <p
                        style={{
                            margin: '6px 0 0 0',
                            color: '#6b7280',
                            fontSize: 13,
                        }}
                    >
                        Espace Admin
                    </p>
                </div>

                <nav
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                    <Link
                        href="/admin/dashboard"
                        style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            color: '#111827',
                            textDecoration: 'none',
                        }}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/users"
                        style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            color: '#111827',
                            textDecoration: 'none',
                        }}
                    >
                        Utilisateurs
                    </Link>
                    <Link
                        href="/gestionnaire/clients"
                        style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            color: '#111827',
                            textDecoration: 'none',
                        }}
                    >
                        Clients
                    </Link>
                    <Link
                        href="/gestionnaire/comptes"
                        style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            color: '#111827',
                            textDecoration: 'none',
                        }}
                    >
                        Comptes
                    </Link>
                    <Link
                        href="/caissier/transactions"
                        style={{
                            padding: '8px 10px',
                            borderRadius: 6,
                            color: '#111827',
                            textDecoration: 'none',
                        }}
                    >
                        Transactions
                    </Link>
                </nav>

                <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 13, color: '#374151' }}>
                        Connecté :
                    </div>
                    <div
                        style={{
                            fontWeight: 700,
                            color: '#111827',
                            marginTop: 6,
                        }}
                    >
                        {auth?.user?.name ?? '—'}
                    </div>
                </div>

                <div style={{ marginTop: 18 }}>
                    <Link
                        href={
                            typeof route !== 'undefined'
                                ? route('logout')
                                : '/logout'
                        }
                        method="post"
                        as="button"
                        style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                        }}
                    >
                        Déconnexion
                    </Link>
                </div>
            </aside>

            <main style={{ flex: 1, padding: 28 }}>{children}</main>
        </div>
    );
}
