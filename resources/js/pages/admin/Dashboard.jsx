import React from 'react';
import { usePage, Link } from '@inertiajs/react';

// --- PACK D'ICÔNES SVG ÉPURÉES ET FINTECH ---
const IconUsers = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        style={{ width: 22, height: 22 }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
    </svg>
);
const IconClients = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        style={{ width: 22, height: 22 }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.656-2.51 9.116 9.116 0 01-4.371 1.13 9.116 9.116 0 01-4.371-1.13 3 3 0 00-4.656 2.51 9.094 9.094 0 003.741.479M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"
        />
    </svg>
);
const IconComptes = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        style={{ width: 22, height: 22 }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
    </svg>
);
const IconSolde = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        style={{ width: 22, height: 22 }}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.214.074a8.374 8.374 0 001.762.313M9.281 7.051l.854.297a8.384 8.384 0 011.724.743M11.422 18v-2.518c-.378-.018-.75-.074-1.113-.167a3.75 3.75 0 01-2.457-2.99M14.718 7.051a3.74 3.74 0 012.235 2.546c.33 1.01.2 2.09-.345 3.006a3.75 3.75 0 01-2.457 1.714m-.63 4.883v-1.856c-.302-.008-.601-.03-.899-.066m.899-11.455v1.856c.264.008.525.028.783.06"
        />
    </svg>
);

export default function Dashboard() {
    const { props } = usePage();

    const stats = props?.stats || {
        utilisateurs: 0,
        clients: 0,
        comptes: 0,
        solde_total: 0,
    };

    const auth = props?.auth || {
        user: { name: 'Utilisateur', email: '', role: 'admin' },
    };

    // Couleur dynamique pour l'Admin (Bleu Nuit Professionnel)
    const adminThemeColor = '#1e3a8a';

    // Formatteur de monnaie pro pour le solde total
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

    return (
        <div className="db-container">
            <div className="db-layout">
                {/* BARRE LATÉRALE */}
                <aside className="db-sidebar">
                    <h3 className="db-sidebar-title">Navigation</h3>
                    <nav className="db-nav">
                        <Link
                            href="/admin/dashboard"
                            className="db-nav-link active"
                        >
                            Dashboard
                        </Link>
                        <Link href="/admin/users" className="db-nav-link">
                            Utilisateurs
                        </Link>
                        <Link
                            href="/gestionnaire/clients"
                            className="db-nav-link"
                        >
                            Clients
                        </Link>
                        <Link
                            href="/gestionnaire/comptes"
                            className="db-nav-link"
                        >
                            Comptes
                        </Link>
                        <Link
                            href="/caissier/transactions"
                            className="db-nav-link"
                        >
                            Transactions
                        </Link>

                        <Link
                            href={
                                typeof route !== 'undefined'
                                    ? route('logout')
                                    : '/logout'
                            }
                            method="post"
                            as="button"
                            className="db-logout-btn"
                        >
                            Déconnexion
                        </Link>
                    </nav>
                </aside>

                {/* CONTENU PRINCIPAL */}
                <main className="db-main">
                    {/* EN-TÊTE DU DASHBOARD */}
                    <div className="db-header">
                        <div>
                            <h2 className="db-title">Tableau de Bord Admin</h2>
                            <p className="db-subtitle">
                                Vue d'ensemble du système de Core Banking
                            </p>
                        </div>

                        <div className="db-user-badge">
                            Statut : Gestionnaire global | Connecté :{' '}
                            <strong style={{ color: adminThemeColor }}>
                                {auth?.user?.name}
                            </strong>
                        </div>
                    </div>

                    {/* GRILLE DES STATISTIQUES */}
                    <div className="db-stats-grid">
                        {/* Utilisateurs */}
                        <div className="db-stat-card">
                            <div>
                                <div className="db-stat-label">
                                    Collaborateurs
                                </div>
                                <div className="db-stat-value">
                                    {stats.utilisateurs}
                                </div>
                            </div>
                            <div
                                className="db-stat-icon-wrapper"
                                style={{
                                    color: adminThemeColor,
                                    backgroundColor: adminThemeColor + '10',
                                }}
                            >
                                <IconUsers />
                            </div>
                        </div>

                        {/* Clients */}
                        <div className="db-stat-card">
                            <div>
                                <div className="db-stat-label">Clients</div>
                                <div className="db-stat-value">
                                    {stats.clients}
                                </div>
                            </div>
                            <div
                                className="db-stat-icon-wrapper"
                                style={{
                                    color: '#0f766e',
                                    backgroundColor: '#0f766e10',
                                }}
                            >
                                <IconClients />
                            </div>
                        </div>

                        {/* Comptes */}
                        <div className="db-stat-card">
                            <div>
                                <div className="db-stat-label">
                                    Comptes Ouverts
                                </div>
                                <div className="db-stat-value">
                                    {stats.comptes}
                                </div>
                            </div>
                            <div
                                className="db-stat-icon-wrapper"
                                style={{
                                    color: '#4f46e5',
                                    backgroundColor: '#4f46e510',
                                }}
                            >
                                <IconComptes />
                            </div>
                        </div>

                        {/* Solde Total */}
                        <div className="db-stat-card">
                            <div>
                                <div className="db-stat-label">Solde Total</div>
                                <div className="db-stat-value">
                                    {formatCurrency(stats.solde_total)}
                                </div>
                            </div>
                            <div
                                className="db-stat-icon-wrapper"
                                style={{
                                    color: '#16a34a',
                                    backgroundColor: '#16a34a10',
                                }}
                            >
                                <IconSolde />
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS RAPIDES */}
                    <div className="db-actions-section">
                        <h4 className="db-actions-title">
                            Raccourcis de gestion système
                        </h4>
                        <div className="db-actions-flex">
                            <Link
                                href="/admin/users"
                                className="db-action-btn"
                                style={{ background: adminThemeColor }}
                            >
                                Configurer les utilisateurs
                            </Link>

                            <Link
                                href="/gestionnaire/comptes"
                                className="db-action-btn"
                                style={{ background: '#0f766e' }}
                            >
                                Accéder au registre des comptes
                            </Link>

                            <Link
                                href="/caissier/transactions"
                                className="db-action-btn"
                                style={{ background: '#2563eb' }}
                            >
                                Auditer les transactions actives
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
