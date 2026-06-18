import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    CreditCard,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    ArrowLeftRight,
    ChevronRight,
    Wallet,
    HandCoins,
    WalletCards,
} from 'lucide-react';

export default function CashierLayout({ children }) {
    const { props, url } = usePage();
    const auth = props.auth;

    // Fallback/Dynamic Routing
    const logoutHref =
        typeof route !== 'undefined' ? route('logout') : '/logout';
    const transactionsHref =
        typeof route !== 'undefined'
            ? route('caissier.transactions.index')
            : '/caissier/transactions';

    // Active state detection
    const isTransactionsActive =
        url.startsWith('/caissier/transactions') || url === '/caissier';

    // State for interactive UI element hovers
    const [hoveredNav, setHoveredNav] = useState(false);
    const [hoveredLogout, setHoveredLogout] = useState(false);

    // Shared Premium Styling Tokens
    const styles = {
        wrapper: {
            display: 'flex',
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        sidebar: {
            width: 270,
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxShadow:
                '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
            boxSizing: 'border-box',
        },
        topSection: {
            padding: '24px 20px',
        },
        headerBlock: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
            paddingBottom: 16,
            borderBottom: '1px solid #f1f5f9',
            position: 'relative',
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
        },
        brandTitle: {
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.025em',
        },
        brandSubtitle: {
            margin: '2px 0 0 0',
            fontSize: 12,
            color: '#64748b',
            fontWeight: 500,
        },
        navLink: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
            padding: '12px 14px',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 250ms ease-in-out',
            borderLeft: isTransactionsActive
                ? '4px solid #2563eb'
                : '4px solid transparent',
            background: isTransactionsActive
                ? '#eff6ff'
                : hoveredNav
                  ? '#f8fafc'
                  : 'transparent',
            color: isTransactionsActive
                ? '#2563eb'
                : hoveredNav
                  ? '#0f172a'
                  : '#52647c',
        },
        infoCard: {
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #93c5fd',
        },
        infoTitle: {
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            color: '#2563eb',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        infoText: {
            margin: '4px 0 0 0',
            fontSize: 11,
            color: '#334155',
            fontWeight: 500,
            display: 'flex',
            gap: 6,
        },
        bottomSection: {
            padding: '20px',
            borderTop: '1px solid #f1f5f9',
            background: '#f8fafc',
        },
        userCard: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            borderRadius: 12,
            background: '#ffffff',
            boxShadow:
                '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
            border: '1px solid #e2e8f0',
            marginBottom: 16,
        },
        avatar: {
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#dbeafe',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
            border: '2px solid #93c5fd',
        },
        userName: {
            fontWeight: 600,
            fontSize: 13,
            color: '#0f172a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 130,
        },
        roleBadge: {
            display: 'inline-block',
            padding: '2px 6px',
            fontSize: 10,
            fontWeight: 700,
            background: '#eff6ff',
            color: '#2563eb',
            borderRadius: 6,
            marginTop: 2,
            border: '1px solid #93c5fd',
        },
        logoutBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '11px 16px',
            background: hoveredLogout ? '#fef2f2' : '#ffffff',
            color: hoveredLogout ? '#dc2626' : '#64748b',
            border: hoveredLogout ? '1px solid #fee2e2' : '1px solid #e2e8f0',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 200ms ease-in-out',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
        mainContent: {
            flex: 1,
            padding: 40,
            overflowY: 'auto',
        },
    };

    return (
        <div style={styles.wrapper}>
            <aside style={styles.sidebar}>
                {/* Upper Structural Block */}
                <div style={styles.topSection}>
                    {/* Header/Branding Block */}
                    <div style={styles.headerBlock}>
                        <div style={styles.logoContainer}>
                            <Wallet size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 style={styles.brandTitle}>Guichet Bancaire</h3>
                            <p style={styles.brandSubtitle}>
                                Cashier Operations
                            </p>
                        </div>
                    </div>

                    {/* Navigation Block */}
                    <nav
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                        }}
                    >
                        <Link
                            href={transactionsHref}
                            style={styles.navLink}
                            onMouseEnter={() => setHoveredNav(true)}
                            onMouseLeave={() => setHoveredNav(false)}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    width: '100%',
                                }}
                            >
                                <CreditCard
                                    size={18}
                                    strokeWidth={
                                        isTransactionsActive ? 2.2 : 1.8
                                    }
                                />
                                <span style={{ flex: 1 }}>Transactions</span>
                                <ChevronRight
                                    size={14}
                                    style={{
                                        opacity: isTransactionsActive ? 1 : 0.3,
                                        transform: isTransactionsActive
                                            ? 'translateX(0)'
                                            : 'translateX(-4px)',
                                        transition: 'transform 200ms ease',
                                    }}
                                />
                            </div>
                        </Link>
                    </nav>

                    {/* Informational Card */}
                    <div style={styles.infoCard}>
                        <h4 style={styles.infoTitle}>Opérations Bancaires</h4>
                        <p style={styles.infoText}>
                            <span>Dépôts</span> • <span>Retraits</span> •{' '}
                            <span>Virements</span>
                        </p>
                    </div>
                </div>

                {/* Footer Structural Block */}
                <div style={styles.bottomSection}>
                    {/* Professional Profile Card */}
                    <div style={styles.userCard}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#3b82f6',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
                            }}
                        >
                            {auth?.user?.name
                                ? auth.user.name.charAt(0).toUpperCase()
                                : 'C'}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 0,
                            }}
                        >
                            <span
                                style={styles.userName}
                                title={auth?.user?.name ?? 'Caissier'}
                            >
                                {auth?.user?.name ?? '—'}
                            </span>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '2px',
                                }}
                            >
                                <Wallet size={12} color="#2563eb" />
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#2563eb',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Caissier
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Style Logout Button */}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px',
                            background: '#ffffff',
                            color: '#dc2626',
                            border: '1px solid #fee2e2',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#dc2626';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = '#dc2626';
                            e.currentTarget.style.boxShadow =
                                '0 4px 12px rgba(220, 38, 38, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.borderColor = '#fee2e2';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                    </Link>
                </div>
            </aside>

            {/* Core Workspace Main Panel */}
            <main style={styles.mainContent}>{children}</main>
        </div>
    );
}
