import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Wallet,
    Clock,
    History,
    ShieldCheck,
    User,
    Bell,
    LogOut,
    ChevronRight,
    Landmark,
    Settings,
} from 'lucide-react';

import ApplicationFeedback from '../components/ApplicationFeedback';

export default function ClientLayout({ children, nombre_t, nombre_tr }) {
    const { props } = usePage();
    const auth = props.auth;
    // Simulation du nombre de transactions en attente (à lier avec vos props réelles, ex: props.pendingCount)
    const pendingTransactionsCount = nombre_t ?? nombre_tr;

    const urlActuelle =
        typeof window !== 'undefined' ? window.location.pathname : '';

    // Définition des routes de l'espace client
    const logoutHref =
        typeof route !== 'undefined' ? route('logout') : '/logout';
    const dashboardHref =
        typeof route !== 'undefined'
            ? route('client.dashboard')
            : '/client/dashboard';
    const attentesHref =
        typeof route !== 'undefined'
            ? route('client.transactions')
            : '/client/transactions';

    const setting =
        typeof route !== 'undefined'
            ? route('client.change-password')
            : '/client/change-password';

    // Détermination dynamique de la page active
    const isDashboardActive = urlActuelle === '/client/dashboard';
    const isAttentesActive = urlActuelle.includes('/client/transactions');

    // Générateur de styles standardisé (strictement identique à votre référence)
    const navLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: '10px',
        color: isActive ? '#7A1C1C' : '#475569',
        backgroundColor: isActive ? '#fff7f7' : 'transparent',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.25s ease-in-out',
        borderLeft: isActive ? '4px solid #7A1C1C' : '4px solid transparent',
        boxSizing: 'border-box',
        cursor: 'pointer',
    });

    // Fonction de survol générique pour éviter la répétition du code
    const handleMouseEnter = (e, isActive) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = '#fff7f7';
            e.currentTarget.style.color = '#7A1C1C';
        }
    };

    const handleMouseLeave = (e, isActive) => {
        if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#475569';
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                background: '#f8fafc',
            }}
        >
            {/* SIDEBAR CLIENT DE GRADE BANCAIRE */}
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
                    borderRight: '1px solid #fdf2f2',
                    boxShadow:
                        '0 4px 6px -1px rgba(122, 28, 28, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                    boxSizing: 'border-box',
                    zIndex: 50,
                }}
            >
                {/* SECTION SUPÉRIEURE : LOGO + NAVIGATION + DECORATIVE CARD */}
                <div
                    style={{
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 140px)',
                        paddingRight: '4px',
                    }}
                >
                    {/* BRANDING HEADER */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0 8px 20px 8px',
                            borderBottom: '1px solid #fff7f7',
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
                                    'linear-gradient(135deg, #7A1C1C 0%, #9f2d2d 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(122, 28, 28, 0.2)',
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
                                    color: '#423b3b',
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
                                Espace Client
                            </p>
                        </div>
                        <div>
                            <Link href={setting}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                    }}
                                >
                                    <Settings size={20} color="#9f2d2d" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* MENU DE NAVIGATION CLIENT */}
                    <nav
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                        }}
                    >
                        {/* Dashboard */}
                        <Link
                            href={dashboardHref}
                            style={navLinkStyle(isDashboardActive)}
                            onMouseEnter={(e) =>
                                handleMouseEnter(e, isDashboardActive)
                            }
                            onMouseLeave={(e) =>
                                handleMouseLeave(e, isDashboardActive)
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <LayoutDashboard
                                    size={18}
                                    strokeWidth={isDashboardActive ? 2.2 : 1.8}
                                />
                                <span>Dashboard</span>
                            </div>
                            <ChevronRight
                                size={14}
                                style={{ opacity: isDashboardActive ? 1 : 0.3 }}
                            />
                        </Link>

                        {/* Transactions en Attente + BADGE NUMÉRIQUE */}
                        <Link
                            href={attentesHref}
                            style={navLinkStyle(isAttentesActive)}
                            onMouseEnter={(e) =>
                                handleMouseEnter(e, isAttentesActive)
                            }
                            onMouseLeave={(e) =>
                                handleMouseLeave(e, isAttentesActive)
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <Clock
                                    size={18}
                                    strokeWidth={isAttentesActive ? 2.2 : 1.8}
                                />
                                <span>Transactions</span>
                            </div>
                            {pendingTransactionsCount > 0 ? (
                                <span
                                    style={{
                                        background: '#7A1C1C',
                                        color: '#ffffff',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        padding: '2px 8px',
                                        borderRadius: '20px',
                                        minWidth: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {pendingTransactionsCount}
                                </span>
                            ) : (
                                <ChevronRight
                                    size={14}
                                    style={{
                                        opacity: isAttentesActive ? 1 : 0.3,
                                    }}
                                />
                            )}
                        </Link>
                    </nav>

                    {/* MINI CARTE STATISTIQUE DÉCORATIVE INFORMATIONS */}
                    <div
                        style={{
                            marginTop: '28px',
                            padding: '14px',
                            borderRadius: '12px',
                            background:
                                'linear-gradient(135deg, #7A1C1C 0%, #410f0f 100%)',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(122, 28, 28, 0.15)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#fdf2f2',
                            }}
                        >
                            Espace Sécurisé
                        </div>
                        <div
                            style={{
                                fontSize: '13px',
                                fontWeight: '500',
                                marginTop: '4px',
                                color: '#ffffff',
                            }}
                        >
                            Comptes & Actifs
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '12px',
                                fontSize: '11px',
                                color: '#fdf2f2',
                                borderTop: '1px solid rgba(204, 251, 241, 0.2)',
                                paddingTop: '8px',
                            }}
                        >
                            <span>Données Chiffrées</span>
                            <span
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10b981',
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
                        borderTop: '1px solid #fff7f7',
                        paddingTop: '18px',
                    }}
                >
                    {/* ÉLÉGANTE CARTE DE PROFIL CLIENT */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #fdf2f2',
                        }}
                    >
                        {/* CIRCULAR AVATAR AVEC INITIALES */}
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#7A1C1C',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(122, 28, 28, 0.15)',
                            }}
                        >
                            {auth?.user?.name
                                ? auth.user.name.charAt(0).toUpperCase()
                                : 'C'}
                        </div>

                        {/* INFOS COMPTE CLIENT COMPACTES */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: '600',
                                    color: '#423b3b',
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {auth?.user?.name ?? 'Client Unique'}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '2px',
                                }}
                            >
                                <User size={12} color="#9f2d2d" />
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#9f2d2d',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Client
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BOUTON DE DÉCONNEXION */}
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
                <ApplicationFeedback />
                {children}
            </main>
        </div>
    );
}
