import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    History,
    SearchCheck,
    ShieldCheck,
    LogOut,
    ChevronRight,
    FileCheck,
} from 'lucide-react';

export default function AuditorLayout({ children }) {
    const { props, url } = usePage();
    const auth = props.auth;

    const logoutHref =
        typeof route !== 'undefined' ? route('logout') : '/logout';

    // Éléments du menu de navigation
    const menuItems = [
        {
            label: 'Dashboard Audit',
            href: '/auditeur/dashboard',
            icon: LayoutDashboard,
            active: url === '/auditeur/dashboard' || url === '/auditeur',
        },
        {
            label: 'Rapports',
            href: '#',
            icon: FileText,
            active: false,
            disabled: true,
        },
        {
            label: 'Historique',
            href: '#',
            icon: History,
            active: false,
            disabled: true,
        },
        {
            label: 'Vérifications',
            href: '#',
            icon: SearchCheck,
            active: false,
            disabled: true,
        },
    ];

    // États pour gérer les effets de survol de manière isolée
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredLogout, setHoveredLogout] = useState(false);

    const styles = {
        wrapper: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        sidebar: {
            width: 270,
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            boxSizing: 'border-box',
            zIndex: 50,
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
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(124, 58, 237, 0.25)',
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
        navLink: (item, index) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '12px 14px',
            borderRadius: 10,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 200ms ease-in-out',
            borderLeft: item.active
                ? '4px solid #7c3aed'
                : '4px solid transparent',
            background: item.active
                ? '#f5f3ff'
                : hoveredItem === index
                  ? '#f8fafc'
                  : 'transparent',
            color: item.active
                ? '#7c3aed'
                : hoveredItem === index
                  ? '#0f172a'
                  : '#475569',
            opacity: item.disabled ? 0.6 : 1,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
        }),
        infoCard: {
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)',
            border: '1px solid #a78bfa',
        },
        infoTitle: {
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            color: '#7c3aed',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        infoText: {
            margin: '4px 0 0 0',
            fontSize: 11,
            color: '#475569',
            fontWeight: 500,
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
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
            border: '1px solid #e2e8f0',
            marginBottom: 16,
        },
        avatar: {
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#ddd6fe',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
            border: '2px solid #a78bfa',
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
        logoutBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            background: hoveredLogout ? '#dc2626' : '#ffffff',
            color: hoveredLogout ? '#ffffff' : '#dc2626',
            border: hoveredLogout ? '1px solid #dc2626' : '1px solid #fee2e2',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            boxShadow: hoveredLogout
                ? '0 4px 12px rgba(220, 38, 38, 0.15)'
                : 'none',
        },
        mainContent: {
            flex: 1,
            overflowY: 'auto',
        },
    };

    return (
        <div style={styles.wrapper}>
            <aside style={styles.sidebar}>
                <div style={styles.topSection}>
                    {/* Header Section */}
                    <div style={styles.headerBlock}>
                        <div style={styles.logoContainer}>
                            <ShieldCheck size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 style={styles.brandTitle}>Audit Bancaire</h3>
                            <p style={styles.brandSubtitle}>
                                Audit & Compliance
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
                        {menuItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={index}
                                    href={item.disabled ? '#' : item.href}
                                    style={styles.navLink(item, index)}
                                    onMouseEnter={() =>
                                        !item.disabled && setHoveredItem(index)
                                    }
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={(e) =>
                                        item.disabled && e.preventDefault()
                                    }
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            width: '100%',
                                        }}
                                    >
                                        <IconComponent
                                            size={18}
                                            strokeWidth={
                                                item.active ? 2.2 : 1.8
                                            }
                                        />
                                        <span style={{ flex: 1 }}>
                                            {item.label}
                                        </span>
                                        {!item.disabled && (
                                            <ChevronRight
                                                size={14}
                                                style={{
                                                    opacity: item.active
                                                        ? 1
                                                        : 0.3,
                                                    transform: item.active
                                                        ? 'translateX(0)'
                                                        : 'translateX(-4px)',
                                                    transition:
                                                        'transform 200ms ease',
                                                }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Operational Guard/Audit Card */}
                    <div style={styles.infoCard}>
                        <h4 style={styles.infoTitle}>Audit & Contrôle</h4>
                        <p style={styles.infoText}>
                            Surveillance des opérations en temps réel.
                        </p>
                    </div>
                </div>

                {/* Profile and Logout Section */}
                <div style={styles.bottomSection}>
                    <div style={styles.userCard}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#7c3aed',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(15, 118, 110, 0.15)',
                            }}
                        >
                            {auth?.user?.name
                                ? auth.user.name.charAt(0).toUpperCase()
                                : 'A'}
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
                                title={auth?.user?.name ?? 'Auditeur'}
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
                                <FileCheck size={12} color="#7c3aed" />
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#7c3aed',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Auditeur
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href={logoutHref}
                        method="post"
                        as="button"
                        style={styles.logoutBtn}
                        onMouseEnter={() => setHoveredLogout(true)}
                        onMouseLeave={() => setHoveredLogout(false)}
                    >
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                    </Link>
                </div>
            </aside>

            <main style={styles.mainContent}>{children}</main>
        </div>
    );
}
