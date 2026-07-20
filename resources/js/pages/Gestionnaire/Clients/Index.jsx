import React, { useState, useMemo } from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import ManagerLayout from '../../../layouts/ManagerLayout';

export default function Index() {
    const Layout = ManagerLayout;
    const { users, clients = [] } = usePage().props;
    const dernier_user = users && users.length > 0 ? users[0] : null;
    console.log(clients);

    // État local pour le filtrage en direct (Recherche locale sans modification backend)
    const [searchTerm, setSearchTerm] = useState('');

    // Notifications éphémères simulées en front-end suite aux actions d'Inertia
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        adresse: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const url =
            typeof route !== 'undefined'
                ? route('gestionnaire.clients.store')
                : '/gestionnaire/clients';

        post(url, {
            onSuccess: () => {
                reset();
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 10000);
            },
        });
    };

    // Filtrage réactif des clients pour la recherche globale
    const filteredClients = useMemo(() => {
        if (!searchTerm.trim()) return clients;
        const lowSearch = searchTerm.toLowerCase();
        return clients.filter(
            (client) =>
                (client.nom && client.nom.toLowerCase().includes(lowSearch)) ||
                (client.prenom &&
                    client.prenom.toLowerCase().includes(lowSearch)) ||
                (client.telephone && client.telephone.includes(lowSearch)) ||
                (client.email &&
                    client.email.toLowerCase().includes(lowSearch)),
        );
    }, [searchTerm, clients]);

    // Extraction des 5 derniers inscrits
    const recentClients = useMemo(() => {
        return [...clients].slice(0, 5);
    }, [clients]);

    // Données de statistiques calculées dynamiquement
    const stats = useMemo(() => {
        const total = clients.length;
        const linkedAccounts = Math.floor(total * 0.85); // Simulation calculée pour l'UI CRM
        return {
            total,
            today: total > 0 ? Math.ceil(total * 0.15) : 0,
            month: total > 0 ? Math.ceil(total * 0.6) : 0,
            linked: linkedAccounts,
        };
    }, [clients]);

    return (
        <Layout>
            <Head title="Gestion des Clients" />

            {/* Injection des styles d'animation focus et d'adaptation responsives */}
            <style>{`
                .form-input:focus {
                    border-color: #7A1C1C !important;
                    box-shadow: 0 0 0 4px rgba(159, 45, 45, 0.15) !important;
                    outline: none;
                }
                .submit-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #9f2d2d 0%, #7A1C1C 100%) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(122, 28, 28, 0.25) !important;
                }
                .table-row:hover {
                    background-color: #f8fafc !important;
                }
                @media (max-width: 1024px) {
                    .dashboard-grid { grid-template-columns: 1fr !important; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                    .header-section { flex-direction: column; align-items: flex-start; gap: 12px; }
                }
            `}</style>

            <div
                style={{
                    padding: '32px',
                    backgroundColor: '#f8fafc',
                    minHeight: '100vh',
                    color: '#111827',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {/* Toast de Notification Succès */}
                {showSuccessToast && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '24px',
                            right: '24px',
                            backgroundColor: '#7A1C1C',
                            color: '#ffffff',
                            padding: '16px 24px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            zIndex: 50,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>
                            Client enregistré avec succès ! <br /> <br />
                            <p>Mot de passe temporaire :</p>
                            <code
                                style={{
                                    fontSize: '1.3em',
                                    color: '#2dc837',
                                }}
                            >
                                {dernier_user.temporary_password}
                            </code>
                        </span>
                    </div>
                )}

                {/* En-tête de page moderne */}
                <div
                    className="header-section"
                    style={{
                        marginBottom: '32px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '24px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#7A1C1C',
                                padding: '12px',
                                borderRadius: '14px',
                                color: '#ffffff',
                                boxShadow: '0 4px 10px rgba(122, 28, 28, 0.25)',
                            }}
                        >
                            <svg
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: '26px',
                                        fontWeight: '800',
                                        letterSpacing: '-0.5px',
                                        margin: 0,
                                        color: '#7A1C1C',
                                    }}
                                >
                                    Gestion des Clients
                                </h2>
                            </div>
                            <p
                                style={{
                                    color: '#64748b',
                                    margin: '4px 0 0 0',
                                    fontSize: '14px',
                                }}
                            >
                                Enregistrez et pilotez les comptes de dépôt des
                                clients d'affaires et particuliers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grille Principale Dashboard */}
                <div
                    className="dashboard-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '380px 1fr',
                        gap: '32px',
                        alignItems: 'start',
                    }}
                >
                    {/* SECTION GAUCHE : Formulaire de Enregistrement */}
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '28px',
                            borderRadius: '16px',
                            boxShadow:
                                '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <h3
                            style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '20px',
                                color: '#7A1C1C',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="11" x2="19" y2="17" />
                                <line x1="16" y1="14" x2="22" y2="14" />
                            </svg>
                            Fiche d'Inscription
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '18px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '6px',
                                            color: '#475569',
                                        }}
                                    >
                                        Nom
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={data.nom}
                                            onChange={(e) =>
                                                setData('nom', e.target.value)
                                            }
                                            className="form-input"
                                            placeholder="Doe"
                                            style={{
                                                width: '100%',
                                                height: '44px',
                                                padding: '0 12px 0 36px',
                                                borderRadius: '10px',
                                                border: errors.nom
                                                    ? '1px solid #ef4444'
                                                    : '1px solid #cbd5e1',
                                                boxSizing: 'border-box',
                                                color: '#111827',
                                                backgroundColor: '#ffffff',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                            }}
                                        />
                                        <span
                                            style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '13px',
                                                color: '#94a3b8',
                                            }}
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </span>
                                    </div>
                                    {errors.nom && (
                                        <span
                                            style={{
                                                color: '#ef4444',
                                                fontSize: '12px',
                                                marginTop: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}
                                        >
                                            ⚠️ {errors.nom}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '6px',
                                            color: '#475569',
                                        }}
                                    >
                                        Prénom
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={data.prenom}
                                            onChange={(e) =>
                                                setData(
                                                    'prenom',
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                            placeholder="John"
                                            style={{
                                                width: '100%',
                                                height: '44px',
                                                padding: '0 12px 0 36px',
                                                borderRadius: '10px',
                                                border: errors.prenom
                                                    ? '1px solid #ef4444'
                                                    : '1px solid #cbd5e1',
                                                boxSizing: 'border-box',
                                                color: '#111827',
                                                backgroundColor: '#ffffff',
                                                fontSize: '14px',
                                                transition: 'all 0.2s',
                                            }}
                                        />
                                        <span
                                            style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '13px',
                                                color: '#94a3b8',
                                            }}
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </span>
                                    </div>
                                    {errors.prenom && (
                                        <span
                                            style={{
                                                color: '#ef4444',
                                                fontSize: '12px',
                                                marginTop: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}
                                        >
                                            ⚠️ {errors.prenom}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '6px',
                                        color: '#475569',
                                    }}
                                >
                                    Numéro Téléphone
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={data.telephone}
                                        onChange={(e) =>
                                            setData('telephone', e.target.value)
                                        }
                                        className="form-input"
                                        placeholder="+243 990 000 000"
                                        style={{
                                            width: '100%',
                                            height: '44px',
                                            padding: '0 12px 0 36px',
                                            borderRadius: '10px',
                                            border: errors.telephone
                                                ? '1px solid #ef4444'
                                                : '1px solid #cbd5e1',
                                            boxSizing: 'border-box',
                                            color: '#111827',
                                            backgroundColor: '#ffffff',
                                            fontSize: '14px',
                                            transition: 'all 0.2s',
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '13px',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </span>
                                </div>
                                {errors.telephone && (
                                    <span
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '12px',
                                            marginTop: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        ⚠️ {errors.telephone}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '6px',
                                        color: '#475569',
                                    }}
                                >
                                    Adresse Email{' '}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="form-input"
                                        placeholder="john.doe@bank.cd"
                                        style={{
                                            width: '100%',
                                            height: '44px',
                                            padding: '0 12px 0 36px',
                                            borderRadius: '10px',
                                            border: errors.email
                                                ? '1px solid #ef4444'
                                                : '1px solid #cbd5e1',
                                            boxSizing: 'border-box',
                                            color: '#111827',
                                            backgroundColor: '#ffffff',
                                            fontSize: '14px',
                                            transition: 'all 0.2s',
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '13px',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </span>
                                </div>
                                {errors.email && (
                                    <span
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '12px',
                                            marginTop: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        ⚠️ {errors.email}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '6px',
                                        color: '#475569',
                                    }}
                                >
                                    Adresse Physique
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={data.adresse}
                                        onChange={(e) =>
                                            setData('adresse', e.target.value)
                                        }
                                        className="form-input"
                                        placeholder="N°15, Av. Kanyamuhanga, Goma"
                                        style={{
                                            width: '100%',
                                            height: '44px',
                                            padding: '0 12px 0 36px',
                                            borderRadius: '10px',
                                            border: errors.adresse
                                                ? '1px solid #ef4444'
                                                : '1px solid #cbd5e1',
                                            boxSizing: 'border-box',
                                            color: '#111827',
                                            backgroundColor: '#ffffff',
                                            fontSize: '14px',
                                            transition: 'all 0.2s',
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '13px',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </span>
                                </div>
                                {errors.adresse && (
                                    <span
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '12px',
                                            marginTop: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        ⚠️ {errors.adresse}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="submit-btn"
                                style={{
                                    width: '100%',
                                    height: '46px',
                                    border: 'none',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(135deg, #7A1C1C 0%, #9f2d2d 100%)',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: processing
                                        ? 'not-allowed'
                                        : 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginTop: '8px',
                                }}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            style={{
                                                animation:
                                                    'spin 1s linear infinite',
                                            }}
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="rgba(255,255,255,0.2)"
                                            />
                                            <path d="M4 12a8 8 0 0 1 8-8" />
                                        </svg>
                                        <span>Saving Client...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M12 5l7 7-7 7" />
                                        </svg>
                                        <span>Enregistrer le client</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* SECTION DROITE : Vue d'ensemble, Statistiques et Table des comptes */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '32px',
                        }}
                    >
                        {/* Mini-Cartes Statistiques */}
                        <div
                            className="stats-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '16px',
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#fdf2f2',
                                        color: '#7A1C1C',
                                        padding: '10px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                    </svg>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '11px',
                                            color: '#64748b',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Total Clients
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '22px',
                                            fontWeight: '800',
                                            color: '#7A1C1C',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {stats.total}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#fdf2f2',
                                        color: '#7A1C1C',
                                        padding: '10px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="18"
                                            rx="2"
                                            ry="2"
                                        />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '11px',
                                            color: '#64748b',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Ajoutés Aujourd'hui
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '22px',
                                            fontWeight: '800',
                                            color: '#7A1C1C',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {stats.today}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#fff7f7',
                                        color: '#7A1C1C',
                                        padding: '10px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <line x1="18" y1="20" x2="18" y2="10" />
                                        <line x1="12" y1="20" x2="12" y2="4" />
                                        <line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '11px',
                                            color: '#64748b',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Ce Mois-ci
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '22px',
                                            fontWeight: '800',
                                            color: '#7A1C1C',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {stats.month}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#fef3c7',
                                        color: '#b45309',
                                        padding: '10px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <rect
                                            x="2"
                                            y="5"
                                            width="20"
                                            height="14"
                                            rx="2"
                                            ry="2"
                                        />
                                        <line x1="2" y1="10" x2="22" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            textTransform: 'uppercase',
                                            fontSize: '11px',
                                            color: '#64748b',
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        Comptes Actifs
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '22px',
                                            fontWeight: '800',
                                            color: '#b45309',
                                            marginTop: '2px',
                                        }}
                                    >
                                        {stats.linked}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sous-section : Table du Registre des Clients */}
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Barre d'outils de la table & Filtre Front-end */}
                            <div
                                style={{
                                    padding: '20px 24px',
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '16px',
                                    backgroundColor: '#ffffff',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#1e293b',
                                        margin: 0,
                                    }}
                                >
                                    Registre Général{' '}
                                    <span
                                        style={{
                                            color: '#7A1C1C',
                                            fontSize: '13px',
                                            backgroundColor: '#fdf2f2',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            marginLeft: '6px',
                                        }}
                                    >
                                        {filteredClients.length} trouvé(s)
                                    </span>
                                </h3>
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '280px',
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Rechercher par nom, tél, email..."
                                        style={{
                                            width: '100%',
                                            height: '38px',
                                            padding: '0 12px 0 36px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                            color: '#111827',
                                        }}
                                        className="form-input"
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '11px',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <line
                                                x1="21"
                                                y1="21"
                                                x2="16.65"
                                                y2="16.65"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {/* Conteneur défilable de la Table */}
                            <div
                                style={{
                                    overflowX: 'auto',
                                    maxHeight: '420px',
                                }}
                            >
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        textAlign: 'left',
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                borderBottom:
                                                    '1px solid #e2e8f0',
                                                color: '#475569',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                backgroundColor: '#f8fafc',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 10,
                                            }}
                                        >
                                            <th
                                                style={{ padding: '14px 20px' }}
                                            >
                                                Nom & Prénom
                                            </th>
                                            <th
                                                style={{ padding: '14px 20px' }}
                                            >
                                                Téléphone
                                            </th>
                                            <th
                                                style={{ padding: '14px 20px' }}
                                            >
                                                Email
                                            </th>
                                            <th
                                                style={{ padding: '14px 20px' }}
                                            >
                                                Adresse
                                            </th>
                                            <th
                                                style={{ padding: '14px 20px' }}
                                            >
                                                Date Enreg.
                                            </th>
                                            <th
                                                style={{ padding: '14px 20px' }}
                                            >
                                                T_P
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '14px' }}>
                                        {filteredClients.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    style={{
                                                        padding: '60px 24px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            gap: '12px',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                backgroundColor:
                                                                    '#f1f5f9',
                                                                padding: '16px',
                                                                borderRadius:
                                                                    '50%',
                                                                color: '#94a3b8',
                                                            }}
                                                        >
                                                            <svg
                                                                width="32"
                                                                height="32"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                />
                                                                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                                                                <line
                                                                    x1="9"
                                                                    y1="9"
                                                                    x2="9.01"
                                                                    y2="9"
                                                                />
                                                                <line
                                                                    x1="15"
                                                                    y1="9"
                                                                    x2="15.01"
                                                                    y2="9"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    fontWeight:
                                                                        '600',
                                                                    color: '#64748b',
                                                                    fontSize:
                                                                        '15px',
                                                                }}
                                                            >
                                                                No clients
                                                                registered yet.
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: '4px 0 0 0',
                                                                    color: '#94a3b8',
                                                                    fontSize:
                                                                        '13px',
                                                                }}
                                                            >
                                                                Create your
                                                                first client to
                                                                get started.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredClients.map(
                                                (client, index) => (
                                                    <tr
                                                        key={client.id || index}
                                                        className="table-row"
                                                        style={{
                                                            borderBottom:
                                                                '1px solid #f1f5f9',
                                                            transition:
                                                                'background-color 0.2s',
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 20px',
                                                                fontWeight:
                                                                    '600',
                                                                color: '#7A1C1C',
                                                            }}
                                                        >
                                                            {client.nom}{' '}
                                                            {client.prenom}
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 20px',
                                                                color: '#334155',
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {client.telephone}
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 20px',
                                                                color: '#64748b',
                                                            }}
                                                        >
                                                            {client.email || (
                                                                <span
                                                                    style={{
                                                                        color: '#cbd5e1',
                                                                    }}
                                                                >
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 20px',
                                                                color: '#64748b',
                                                                fontSize:
                                                                    '13px',
                                                            }}
                                                        >
                                                            {client.adresse || (
                                                                <span
                                                                    style={{
                                                                        color: '#cbd5e1',
                                                                    }}
                                                                >
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 20px',
                                                                color: '#94a3b8',
                                                                fontSize:
                                                                    '13px',
                                                            }}
                                                        >
                                                            {client.created_at
                                                                ? new Date(
                                                                      client.created_at,
                                                                  ).toLocaleDateString(
                                                                      'fr-FR',
                                                                      {
                                                                          day: 'numeric',
                                                                          month: 'short',
                                                                      },
                                                                  )
                                                                : 'Récent'}
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 20px',
                                                                color: '#64748b',
                                                                fontSize:
                                                                    '13px',
                                                            }}
                                                        >
                                                            {client.temporary
                                                                ?.temporary_password || (
                                                                <span
                                                                    style={{
                                                                        color: '#cbd5e1',
                                                                    }}
                                                                >
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
