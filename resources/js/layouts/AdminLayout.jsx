import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    LogOut,
    ShieldCheck,
    Building2,
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const auth = usePage().props.auth;
    const urlActuelle =
        typeof window !== 'undefined' ? window.location.pathname : '';

    // Détermination de l'état actif pour les styles dynamiques
    const isDashboardActive = urlActuelle === '/admin/dashboard';
    const isUsersActive = urlActuelle === '/admin/users';

    // Style de base partagé pour les éléments de navigation
    const navLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        color: isActive ? '#1e3a8a' : '#475569',
        backgroundColor: isActive ? '#eff6ff' : 'transparent',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        borderLeft: isActive ? '4px solid #2563eb' : '4px solid transparent',
        cursor: 'pointer',
    });

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                background: '#f8fafc',
            }}
        >
            {/* BARRE LATÉRALE DE GRADE BANCAIRE */}
            <aside
                style={{
                    width: '280px',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px 16px',
                    background: '#ffffff',
                    borderRight: '1px solid #eff6ff',
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    boxSizing: 'border-box',
                    zIndex: 50,
                }}
            >
                {/* SECTION SUPÉRIEURE : EN-TÊTE & NAVIGATION */}
                <div>
                    {/* EN-TÊTE BRANDING PREMIUM */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0 8px 24px 8px',
                            borderBottom: '1px solid #f1f5f9',
                            marginBottom: '24px',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#1e3a8a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
                            }}
                        >
                            <Building2 size={22} color="#ffffff" />
                        </div>
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    color: '#0f172a',
                                    letterSpacing: '-0.025em',
                                }}
                            >
                                Bank Administration
                            </h3>
                            <p
                                style={{
                                    margin: '2px 0 0 0',
                                    color: '#64748b',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                }}
                            >
                                System Management Portal
                            </p>
                        </div>
                    </div>

                    {/* MENU DE NAVIGATION */}
                    <nav
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                        }}
                    >
                        <Link
                            href="/admin/dashboard"
                            style={navLinkStyle(isDashboardActive)}
                            onMouseEnter={(e) => {
                                if (!isDashboardActive) {
                                    e.currentTarget.style.backgroundColor =
                                        '#f8fafc';
                                    e.currentTarget.style.color = '#0f172a';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isDashboardActive) {
                                    e.currentTarget.style.backgroundColor =
                                        'transparent';
                                    e.currentTarget.style.color = '#475569';
                                }
                            }}
                        >
                            <LayoutDashboard
                                size={18}
                                strokeWidth={isDashboardActive ? 2.2 : 1.8}
                            />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href="/admin/users"
                            style={navLinkStyle(isUsersActive)}
                            onMouseEnter={(e) => {
                                if (!isUsersActive) {
                                    e.currentTarget.style.backgroundColor =
                                        '#f8fafc';
                                    e.currentTarget.style.color = '#0f172a';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isUsersActive) {
                                    e.currentTarget.style.backgroundColor =
                                        'transparent';
                                    e.currentTarget.style.color = '#475569';
                                }
                            }}
                        >
                            <Users
                                size={18}
                                strokeWidth={isUsersActive ? 2.2 : 1.8}
                            />
                            <span>Utilisateurs</span>
                        </Link>
                    </nav>
                </div>

                {/* SECTION INFÉRIEURE : UTILISATEUR & DÉCONNEXION */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '20px',
                    }}
                >
                    {/* ÉLÉGANTE CARTE DE PROFIL UTILISATEUR */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #f1f5f9',
                        }}
                    >
                        {/* AVATAR AVEC INITIALES */}
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#1e3a8a',
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
                                : 'A'}
                        </div>

                        {/* INFOS COMPTE */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: '600',
                                    color: '#0f172a',
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {auth?.user?.name ?? '—'}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '2px',
                                }}
                            >
                                <ShieldCheck size={12} color="#1e5cc0" />
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#1e5cc0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Admin
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BOUTON DE DÉCONNEXION MODERNISÉ */}
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

            {/* ESPACE DE CONTENU PRINCIPAL */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
