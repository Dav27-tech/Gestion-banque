import React from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import ManagerLayout from '../../layouts/ManagerLayout';

export default function Dashboard() {
    const { props } = usePage();
    const stats = props?.stats || {
        clients: 0,
        comptes: 0,
    };

    return (
        <ManagerLayout>
            <Head title="Dashboard Gestionnaire" />

            <div style={{ marginBottom: '20px' }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: '22px',
                        fontWeight: '700',
                    }}
                >
                    Dashboard Manager
                </h2>
                <p style={{ margin: '6px 0 0 0', color: '#6b7280' }}>
                    Gestion des clients et des comptes
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2,1fr)',
                    gap: '16px',
                    marginBottom: '20px',
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>
                        Clients
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {stats.clients}
                    </div>
                </div>

                <div
                    style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>
                        Comptes
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {stats.comptes}
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
