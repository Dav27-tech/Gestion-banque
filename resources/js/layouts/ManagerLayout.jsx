import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Landmark,
    LogOut,
    ShieldCheck,
    ChevronRight,
    Wallet,
    BriefcaseBusiness,
} from 'lucide-react';

export default function ManagerLayout({ children }) {
    const auth = usePage().props.auth;
    const urlActuelle =
        typeof window !== 'undefined' ? window.location.pathname : '';

    const logoutHref =
        typeof route !== 'undefined' ? route('logout') : '/logout';
    const dashboardHref =
        typeof route !== 'undefined'
            ? route('gestionnaire.dashboard')
            : '/gestionnaire/dashboard';
    const clientsHref =
        typeof route !== 'undefined'
            ? route('gestionnaire.clients.index')
            : '/gestionnaire/clients';
    const comptesHref =
        typeof route !== 'undefined'
            ? route('gestionnaire.comptes.index')
            : '/gestionnaire/comptes';

    // Détermination dynamique de la page active pour le style des onglets
    const isDashboardActive = urlActuelle === '/gestionnaire/dashboard';
    const isClientsActive = urlActuelle.includes('/gestionnaire/clients');
    const isComptesActive = urlActuelle.includes('/gestionnaire/comptes');

    // Générateur de styles standardisé pour la navigation
    const navLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: '10px',
        color: isActive ? '#0f766e' : '#475569',
        backgroundColor: isActive ? '#f0fdfa' : 'transparent',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.25s ease-in-out',
        borderLeft: isActive ? '4px solid #0f766e' : '4px solid transparent',
        boxSizing: 'border-box',
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
            {/* SIDEBAR GESTIONNAIRE DE GRADE BANCAIRE */}
            <aside
                style={{
                    width: '270px',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px 16px',
                    background: '#ffffff',
                    borderRight: '1px solid #ccfbf1',
                    boxShadow:
                        '0 4px 6px -1px rgba(15, 118, 110, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                    boxSizing: 'border-box',
                    zIndex: 50,
                }}
            >
                {/* SECTION SUPÉRIEURE : LOGO + NAVIGATION + DECORATIVE CARD */}
                <div>
                    {/* BRANDING HEADER AVEC DÉGRADÉ DÉCORATIF TEAL */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0 8px 20px 8px',
                            borderBottom: '1px solid #f0fdfa',
                            marginBottom: '20px',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background:
                                    'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(15, 118, 110, 0.2)',
                            }}
                        >
                            <Landmark size={20} color="#ffffff" />
                        </div>
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    color: '#134e4a',
                                    letterSpacing: '-0.025em',
                                }}
                            >
                                Gestion Bancaire
                            </h3>
                            <p
                                style={{
                                    margin: '2px 0 0 0',
                                    color: '#64748b',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                }}
                            >
                                Manager Workspace
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
                            href={clientsHref}
                            style={navLinkStyle(isClientsActive)}
                            onMouseEnter={(e) => {
                                if (!isClientsActive) {
                                    e.currentTarget.style.backgroundColor =
                                        '#f0fdfa';
                                    e.currentTarget.style.color = '#0f766e';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isClientsActive) {
                                    e.currentTarget.style.backgroundColor =
                                        'transparent';
                                    e.currentTarget.style.color = '#475569';
                                }
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <Users
                                    size={18}
                                    strokeWidth={isClientsActive ? 2.2 : 1.8}
                                />
                                <span>Clients</span>
                            </div>
                            <ChevronRight
                                size={14}
                                style={{ opacity: isClientsActive ? 1 : 0.3 }}
                            />
                        </Link>

                        <Link
                            href={comptesHref}
                            style={navLinkStyle(isComptesActive)}
                            onMouseEnter={(e) => {
                                if (!isComptesActive) {
                                    e.currentTarget.style.backgroundColor =
                                        '#f0fdfa';
                                    e.currentTarget.style.color = '#0f766e';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isComptesActive) {
                                    e.currentTarget.style.backgroundColor =
                                        'transparent';
                                    e.currentTarget.style.color = '#475569';
                                }
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <Wallet
                                    size={18}
                                    strokeWidth={isComptesActive ? 2.2 : 1.8}
                                />
                                <span>Comptes</span>
                            </div>
                            <ChevronRight
                                size={14}
                                style={{ opacity: isComptesActive ? 1 : 0.3 }}
                            />
                        </Link>
                    </nav>

                    {/* MINI CARTE STATISTIQUE DÉCORATIVE INFORMATIONS */}
                    <div
                        style={{
                            marginTop: '28px',
                            padding: '14px',
                            borderRadius: '12px',
                            background:
                                'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.15)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#ccfbf1',
                            }}
                        >
                            Gestion Financière
                        </div>
                        <div
                            style={{
                                fontSize: '13px',
                                fontWeight: '500',
                                marginTop: '4px',
                                color: '#ffffff',
                            }}
                        >
                            Clients & Comptes
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '12px',
                                fontSize: '11px',
                                color: '#ccfbf1',
                                borderTop: '1px solid rgba(204, 251, 241, 0.2)',
                                paddingTop: '8px',
                            }}
                        >
                            <span>Opérations Securisées</span>
                            <span
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2dd4bf',
                                }}
                            ></span>
                        </div>
                    </div>
                </div>

                {/* SECTION INFÉRIEURE : CARTE PROFIL + DÉCONNEXION */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        borderTop: '1px solid #f0fdfa',
                        paddingTop: '18px',
                    }}
                >
                    {/* ÉLÉGANTE CARTE DE PROFIL GESTIONNAIRE */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #ccfbf1',
                        }}
                    >
                        {/* CIRCULAR AVATAR AVEC INITIALES */}
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#0f766e',
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
                                : 'G'}
                        </div>

                        {/* INFOS COMPTE & BADGE VERT COMPACT */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: '600',
                                    color: '#134e4a',
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
                                <BriefcaseBusiness size={12} color="#14b8a6" />
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#14b8a6',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Gestionnaire
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BOUTON DE DÉCONNEXION MODERNISÉ (STYLE SOFT DANGER ARTISANAL) */}
                    <Link
                        href={logoutHref}
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
                                '0 4px 12px rgba(220, 38, 38, 0.12)';
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

            {/* CONTENU DE LA PAGE EN COURS */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
