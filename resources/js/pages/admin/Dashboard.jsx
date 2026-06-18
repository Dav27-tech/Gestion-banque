import React from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

const IconUsers = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 12a4 4 0 100-8 4 4 0 000 8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconClients = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
            d="M4 20c0-4 4-6 8-6s8 2 8 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconComptes = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="3"
            y="4"
            width="18"
            height="6"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
        />
        <rect
            x="3"
            y="14"
            width="18"
            height="6"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
        />
    </svg>
);

const IconSolde = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 8v8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 10h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function formatCurrency(amount) {
    try {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount || 0);
    } catch (e) {
        return (amount || 0).toFixed(2) + ' €';
    }
}

export default function Dashboard() {
    const { props } = usePage();
    const auth = props?.auth || {};
    const stats = props?.stats || {
        utilisateurs: 0,
        clients: 0,
        comptes: 0,
        solde_total: 0,
    };
    const adminThemeColor = '#1e40af';

    const usersHref =
        typeof route !== 'undefined'
            ? route('admin.users.index')
            : '/admin/users';
    const comptesHref =
        typeof route !== 'undefined'
            ? route('gestionnaire.comptes.index')
            : '/gestionnaire/comptes';
    const transactionsHref =
        typeof route !== 'undefined'
            ? route('caissier.transactions.index')
            : '/caissier/transactions';

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                    Dashboard Admin
                </h2>
                <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                    Vue d'ensemble du système
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4,1fr)',
                    gap: '16px',
                    marginTop: '20px',
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        Utilisateurs
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {stats.utilisateurs}
                    </div>
                </div>
                <div
                    style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
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
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        Comptes
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {stats.comptes}
                    </div>
                </div>
                <div
                    style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        Solde total
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {formatCurrency(stats.solde_total)}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <Link
                    href={usersHref}
                    className="db-action-btn"
                    style={{
                        padding: '10px 14px',
                        background: adminThemeColor,
                        color: '#fff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                    }}
                >
                    Gérer les utilisateurs
                </Link>
            </div>
        </AdminLayout>
    );
}
