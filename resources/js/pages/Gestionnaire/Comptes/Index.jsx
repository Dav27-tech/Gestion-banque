import React, { useState, useMemo } from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import ManagerLayout from '../../../layouts/ManagerLayout';
import {
    UserPlus,
    Users,
    CheckCircle2,
    Layers,
    DollarSign,
    TrendingUp,
    Search,
    Filter,
    Eye,
    Slash,
    AlertTriangle,
    Check,
    Sparkles,
    RefreshCw,
    Wallet,
    Calendar,
    ArrowRight,
} from 'lucide-react';

export default function Index() {
    const Layout = ManagerLayout;

    // 1. Data recovery from your CompteController
    const { comptes = [], clients = [] } = usePage().props;

    // Local states for UI search, filter views, detail modals, and client lookup text
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCurrency, setFilterCurrency] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [clientSearchText, setClientSearchText] = useState('');
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);

    // 2. Form submission setup exactly mapping original fields
    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: '',
        type_compte: 'courant',
        devise: 'USD',
        solde: '0',
    });

    // Color definitions from your exact specification
    const colors = {
        primary: '#0f766e',
        supportingTeal: '#14b8a6',
        lightTeal: '#99f6e4',
        ultraLightTeal: '#ccfbf1',
        white: '#ffffff',
        bgBg: '#f8fafc',
        textDark: '#0f172a',
        textMuted: '#64748b',
    };

    // Calculate Dynamic Statistics directly from the parsed data array
    const stats = useMemo(() => {
        const total = comptes.length;
        const active = comptes.filter((c) => c.actif).length;
        const savings = comptes.filter(
            (c) => c.type_compte === 'epargne' || c.type_compte === 'savings',
        ).length;
        const current = comptes.filter(
            (c) => c.type_compte === 'courant' || c.type_compte === 'current',
        ).length;

        const usdSum = comptes
            .filter((c) => c.devise === 'USD')
            .reduce((sum, c) => sum + parseFloat(c.solde || 0), 0);

        const cdfSum = comptes
            .filter((c) => c.devise === 'CDF')
            .reduce((sum, c) => sum + parseFloat(c.solde || 0), 0);

        const avgBalanceUSD = total
            ? usdSum / (comptes.filter((c) => c.devise === 'USD').length || 1)
            : 0;
        const maxBalance = comptes.reduce(
            (max, c) =>
                parseFloat(c.solde || 0) > max ? parseFloat(c.solde || 0) : max,
            0,
        );

        return {
            total,
            active,
            savings,
            current,
            usdSum,
            cdfSum,
            avgBalanceUSD,
            maxBalance,
        };
    }, [comptes]);

    // Handle Client Dropdown Selection
    const handleSelectClient = (client) => {
        setData('client_id', client.id);
        setClientSearchText(`${client.nom} ${client.prenom}`);
        setIsClientDropdownOpen(false);
    };

    // Filtered Client Options
    const filteredClients = useMemo(() => {
        if (!clientSearchText || data.client_id) return clients;
        return clients.filter(
            (c) =>
                `${c.nom} ${c.prenom}`
                    .toLowerCase()
                    .includes(clientSearchText.toLowerCase()) ||
                (c.telephone && c.telephone.includes(clientSearchText)),
        );
    }, [clients, clientSearchText, data.client_id]);

    // Filtered Accounts Registry List
    const filteredAccounts = useMemo(() => {
        return comptes.filter((account) => {
            const nameStr = account.client
                ? `${account.client.nom} ${account.client.prenom}`.toLowerCase()
                : '';
            const phoneStr = account.client?.telephone || '';
            const numStr = (account.numero_compte || '')
                .toString()
                .toLowerCase();
            const matchesSearch =
                nameStr.includes(searchTerm.toLowerCase()) ||
                phoneStr.includes(searchTerm) ||
                numStr.includes(searchTerm.toLowerCase());

            const typeMatch =
                filterType === 'all' || account.type_compte === filterType;
            const currencyMatch =
                filterCurrency === 'all' || account.devise === filterCurrency;

            let statusMatch = true;
            if (filterStatus === 'active') statusMatch = account.actif;
            if (filterStatus === 'blocked') statusMatch = !account.actif;

            return matchesSearch && typeMatch && currencyMatch && statusMatch;
        });
    }, [comptes, searchTerm, filterType, filterCurrency, filterStatus]);

    // Derived Last 5 accounts
    const recentAccounts = useMemo(() => {
        return [...comptes].slice(-5).reverse();
    }, [comptes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url =
            typeof route !== 'undefined'
                ? route('gestionnaire.comptes.store')
                : '/gestionnaire/comptes';

        post(url, {
            onSuccess: () => {
                reset('client_id', 'solde');
                setClientSearchText('');
            },
        });
    };

    // Quick mock formatting method for currency representations
    const formatMoney = (val, currency) => {
        return (
            new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(
                parseFloat(val || 0),
            ) +
            ' ' +
            currency
        );
    };

    // Generate dynamic safe fake preview format account number
    const generatedAccountNumberPreview = useMemo(() => {
        const branchCode = '430';
        const randomFill = Math.floor(100000 + Math.random() * 900000);
        return `ACC-${branchCode}-${data.devise}-${randomFill}`;
    }, [data.devise, data.client_id]);

    return (
        <Layout>
            <div
                style={{
                    padding: '24px',
                    backgroundColor: colors.bgBg,
                    minHeight: '100vh',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                <Head title="Account Management Portal" />

                {/* HEADER SECTION */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '28px',
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: colors.primary,
                                    color: '#fff',
                                    padding: '8px',
                                    borderRadius: '8px',
                                }}
                            >
                                <Wallet size={22} />
                            </div>
                            <h1
                                style={{
                                    fontSize: '26px',
                                    fontWeight: '700',
                                    color: colors.textDark,
                                    margin: 0,
                                }}
                            >
                                Account Management
                            </h1>
                            <span
                                style={{
                                    backgroundColor: colors.ultraLightTeal,
                                    color: colors.primary,
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    padding: '4px 10px',
                                    borderRadius: '50px',
                                    marginLeft: '6px',
                                    border: `1px solid ${colors.lightTeal}`,
                                }}
                            >
                                Manager Workspace
                            </span>
                        </div>
                        <p
                            style={{
                                color: colors.textMuted,
                                margin: '6px 0 0 40px',
                                fontSize: '14px',
                            }}
                        >
                            Open and manage corporate and retail customer bank
                            accounts instantly.
                        </p>
                    </div>
                </div>

                {/* STATISTICS GRID */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    {[
                        {
                            title: 'Total Accounts',
                            val: stats.total,
                            icon: <Users size={20} />,
                            bg: colors.white,
                        },
                        {
                            title: 'Active Accounts',
                            val: stats.active,
                            icon: <CheckCircle2 size={20} />,
                            bg: colors.white,
                            highlightColor: '#16a34a',
                        },
                        {
                            title: 'Savings Products',
                            val: stats.savings,
                            icon: <Layers size={20} />,
                            bg: colors.white,
                        },
                        {
                            title: 'Current Products',
                            val: stats.current,
                            icon: <TrendingUp size={20} />,
                            bg: colors.white,
                        },
                        {
                            title: 'Total USD Vault',
                            val: formatMoney(stats.usdSum, 'USD'),
                            icon: <DollarSign size={20} />,
                            bg: colors.white,
                            isCurrency: true,
                        },
                        {
                            title: 'Total CDF Vault',
                            val: formatMoney(stats.cdfSum, 'CDF'),
                            icon: <Wallet size={20} />,
                            bg: colors.white,
                            isCurrency: true,
                        },
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="stat-card"
                            style={{
                                backgroundColor: card.bg,
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow:
                                    '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                }}
                            >
                                <span
                                    style={{
                                        textTransform: 'uppercase',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: colors.textMuted,
                                        trackingLetter: '0.05em',
                                    }}
                                >
                                    {card.title}
                                </span>
                                <div
                                    style={{
                                        color:
                                            card.highlightColor ||
                                            colors.primary,
                                    }}
                                >
                                    {card.icon}
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: card.isCurrency ? '18px' : '26px',
                                    fontWeight: '700',
                                    color: colors.textDark,
                                }}
                            >
                                {card.val}
                            </div>
                        </div>
                    ))}
                </div>

                {/* MAIN SPLIT PANEL */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'window.innerWidth > 1024 ? "1fr 2fr" : "1fr"',
                        gap: '30px',
                        alignItems: 'start',
                    }}
                    className="responsive-main-grid"
                >
                    {/* LEFT PANEL: ACCOUNT CREATION CARD */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: colors.white,
                                padding: '24px',
                                borderRadius: '16px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.04)',
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '20px',
                                    borderBottom: '1px solid #f1f5f9',
                                    paddingBottom: '12px',
                                }}
                            >
                                <UserPlus size={18} color={colors.primary} />
                                <h2
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: colors.textDark,
                                        margin: 0,
                                    }}
                                >
                                    Ouvrir un Compte
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* CUSTOM SEARCHABLE CLIENT SELECTOR */}
                                <div
                                    style={{
                                        marginBottom: '18px',
                                        position: 'relative',
                                    }}
                                >
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '6px',
                                            color: colors.textDark,
                                        }}
                                    >
                                        Titulaire du compte :
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="🔍 Recharger ou chercher un client..."
                                            value={clientSearchText}
                                            onChange={(e) => {
                                                setClientSearchText(
                                                    e.target.value,
                                                );
                                                setIsClientDropdownOpen(true);
                                                if (data.client_id)
                                                    setData('client_id', '');
                                            }}
                                            onFocus={() =>
                                                setIsClientDropdownOpen(true)
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                border: `1px solid ${errors.client_id ? '#dc2626' : '#cbd5e1'}`,
                                                boxSizing: 'border-box',
                                                outline: 'none',
                                                fontSize: '14px',
                                                color: '#4b4b4b',
                                            }}
                                        />
                                        {data.client_id && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform:
                                                        'translateY(-50%)',
                                                    color: '#16a34a',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                <Check size={14} /> Validé
                                            </span>
                                        )}
                                    </div>

                                    {isClientDropdownOpen &&
                                        filteredClients.length > 0 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #cbd5e1',
                                                    borderRadius: '8px',
                                                    marginTop: '4px',
                                                    maxHeight: '180px',
                                                    overflowY: 'auto',
                                                    color: '#343333',
                                                    zIndex: 50,
                                                    boxShadow:
                                                        '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                }}
                                            >
                                                {filteredClients.map(
                                                    (client) => (
                                                        <div
                                                            key={client.id}
                                                            onClick={() =>
                                                                handleSelectClient(
                                                                    client,
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    '10px 12px',
                                                                cursor: 'pointer',
                                                                borderBottom:
                                                                    '1px solid #f1f5f9',
                                                                fontSize:
                                                                    '13px',
                                                                transition:
                                                                    'background 0.15s',
                                                            }}
                                                            onMouseEnter={(e) =>
                                                                (e.target.style.backgroundColor =
                                                                    colors.ultraLightTeal)
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.target.style.backgroundColor =
                                                                    'transparent')
                                                            }
                                                        >
                                                            <div
                                                                style={{
                                                                    fontWeight:
                                                                        '600',
                                                                }}
                                                            >
                                                                {client.nom}{' '}
                                                                {client.prenom}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    color: colors.textMuted,
                                                                    fontSize:
                                                                        '11px',
                                                                }}
                                                            >
                                                                ID: {client.id}{' '}
                                                                • Tel:{' '}
                                                                {client.telephone ||
                                                                    'N/A'}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    {errors.client_id && (
                                        <span
                                            style={{
                                                color: '#dc2626',
                                                fontSize: '12px',
                                                marginTop: '4px',
                                                display: 'block',
                                            }}
                                        >
                                            {errors.client_id}
                                        </span>
                                    )}
                                </div>

                                {/* ACCOUNT TYPE SEGMENTED BUTTONS */}
                                <div style={{ marginBottom: '18px' }}>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '6px',
                                            color: colors.textDark,
                                        }}
                                    >
                                        Type de compte :
                                    </label>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '8px',
                                            backgroundColor: '#f1f5f9',
                                            padding: '4px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        {[
                                            {
                                                id: 'courant',
                                                label: 'Compte Courant',
                                            },
                                            {
                                                id: 'epargne',
                                                label: 'Compte Épargne',
                                            },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() =>
                                                    setData('type_compte', t.id)
                                                }
                                                style={{
                                                    padding: '8px 12px',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    transition: 'all 0.2s',
                                                    backgroundColor:
                                                        data.type_compte ===
                                                        t.id
                                                            ? colors.white
                                                            : 'transparent',
                                                    color:
                                                        data.type_compte ===
                                                        t.id
                                                            ? colors.primary
                                                            : colors.textMuted,
                                                    boxShadow:
                                                        data.type_compte ===
                                                        t.id
                                                            ? '0 1px 3px rgb(0 0 0 / 0.1)'
                                                            : 'none',
                                                }}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* CURRENCY CARDS SELECTION */}
                                <div style={{ marginBottom: '18px' }}>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '6px',
                                            color: colors.textDark,
                                        }}
                                    >
                                        Devise :
                                    </label>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                        }}
                                    >
                                        {[
                                            {
                                                id: 'USD',
                                                title: 'USD',
                                                desc: 'Dollar Américain ($)',
                                            },
                                            {
                                                id: 'CDF',
                                                title: 'CDF',
                                                desc: 'Franc Congolais (FC)',
                                            },
                                        ].map((c) => {
                                            const isSelected =
                                                data.devise === c.id;
                                            return (
                                                <div
                                                    key={c.id}
                                                    onClick={() =>
                                                        setData('devise', c.id)
                                                    }
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: '10px',
                                                        border: isSelected
                                                            ? `2px solid ${colors.primary}`
                                                            : '1px solid #cbd5e1',
                                                        backgroundColor:
                                                            isSelected
                                                                ? colors.ultraLightTeal
                                                                : colors.white,
                                                        cursor: 'pointer',
                                                        transition:
                                                            'all 0.15s ease',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: '16px',
                                                            fontWeight: '700',
                                                            color: isSelected
                                                                ? colors.primary
                                                                : colors.textDark,
                                                        }}
                                                    >
                                                        {c.title}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: '11px',
                                                            color: colors.textMuted,
                                                            marginTop: '2px',
                                                        }}
                                                    >
                                                        {c.desc}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* SOLDE INITIAL WITH LIVE SYMBOL */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '6px',
                                            color: colors.textDark,
                                        }}
                                    >
                                        Dépôt initial :
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span
                                            style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontWeight: '700',
                                                color: colors.textMuted,
                                                fontSize: '14px',
                                            }}
                                        >
                                            {data.devise === 'USD' ? '$' : 'FC'}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.solde}
                                            onChange={(e) =>
                                                setData('solde', e.target.value)
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px 10px 42px',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                boxSizing: 'border-box',
                                                outline: 'none',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: '#4b4b4b',
                                            }}
                                        />
                                    </div>
                                    {errors.solde && (
                                        <span
                                            style={{
                                                color: '#dc2626',
                                                fontSize: '12px',
                                                marginTop: '4px',
                                                display: 'block',
                                            }}
                                        >
                                            {errors.solde}
                                        </span>
                                    )}
                                </div>

                                {/* REAL-TIME ACCOUNT LIVE PREVIEW STATEMENT */}
                                <div
                                    style={{
                                        backgroundColor: '#f8fafc',
                                        border: '1px dashed #cbd5e1',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: colors.primary,
                                            textTransform: 'uppercase',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        <Sparkles size={12} /> Account Number
                                        Preview Blueprint
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: '13px',
                                            color: colors.textDark,
                                            fontWeight: '600',
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        {generatedAccountNumberPreview}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '8px',
                                            fontSize: '12px',
                                            color: colors.textMuted,
                                        }}
                                    >
                                        <span>
                                            Type:{' '}
                                            {data.type_compte === 'courant'
                                                ? 'Courant'
                                                : 'Épargne'}
                                        </span>
                                        <span>
                                            Initial Balance:{' '}
                                            {formatMoney(
                                                data.solde,
                                                data.devise,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: colors.primary,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: processing
                                            ? 'not-allowed'
                                            : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        fontSize: '14px',
                                        boxShadow:
                                            '0 4px 6px -1px rgb(15 118 110 / 0.2)',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />{' '}
                                            Opening Account...
                                        </>
                                    ) : (
                                        'Créer le compte'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* WIDGET: FINANCIAL OVERVIEW */}
                        <div
                            style={{
                                backgroundColor: colors.white,
                                padding: '20px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: colors.textDark,
                                    marginBottom: '14px',
                                    textTransform: 'uppercase',
                                    trackingLetter: '0.05em',
                                }}
                            >
                                Financial Matrix Widget
                            </h3>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #f1f5f9',
                                        paddingBottom: '8px',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            color: colors.textMuted,
                                        }}
                                    >
                                        Avg Balance (USD Pool)
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: colors.textDark,
                                        }}
                                    >
                                        {formatMoney(
                                            stats.avgBalanceUSD,
                                            'USD',
                                        )}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #f1f5f9',
                                        paddingBottom: '8px',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            color: colors.textMuted,
                                        }}
                                    >
                                        Largest Active Vault Balance
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: colors.textDark,
                                        }}
                                    >
                                        {formatMoney(stats.maxBalance, '')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* WIDGET: RECENT ACCOUNTS PANEL */}
                        <div
                            style={{
                                backgroundColor: colors.white,
                                padding: '20px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: colors.textDark,
                                    marginBottom: '14px',
                                    textTransform: 'uppercase',
                                    trackingLetter: '0.05em',
                                }}
                            >
                                Recent Creations
                            </h3>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                {recentAccounts.length === 0 ? (
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: colors.textMuted,
                                            textAlign: 'center',
                                            padding: '10px',
                                        }}
                                    >
                                        No records logged yet.
                                    </div>
                                ) : (
                                    recentAccounts.map((ra, rIdx) => (
                                        <div
                                            key={rIdx}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        color: colors.textDark,
                                                    }}
                                                >
                                                    {ra.numero_compte}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '11px',
                                                        color: colors.textMuted,
                                                    }}
                                                >
                                                    {ra.client
                                                        ? `${ra.client.nom}`
                                                        : 'Unknown'}
                                                </div>
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    backgroundColor:
                                                        colors.ultraLightTeal,
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    color: colors.primary,
                                                }}
                                            >
                                                {ra.type_compte}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: LIVE ACCOUNTS REGISTRY FILTER & TABLE */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        {/* SEARCH AND CONTROL ROW */}
                        <div
                            style={{
                                backgroundColor: colors.white,
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 4px rgb(0 0 0 / 0.02)',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '12px',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    flex: '1',
                                    minWidth: '240px',
                                }}
                            >
                                <Search
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: colors.textMuted,
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search by account number, holder name or phone..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 36px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        outline: 'none',
                                        fontSize: '13px',
                                        color: '#4b4b4b',
                                    }}
                                />
                            </div>

                            {/* FILTERS TOOLBAR */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: colors.textMuted,
                                    }}
                                >
                                    <Filter size={14} /> Filters:
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(e.target.value)
                                    }
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '12px',
                                        backgroundColor: '#fff',
                                        color: '#444444',
                                    }}
                                >
                                    <option value="all">All Types</option>
                                    <option value="courant">Courant</option>
                                    <option value="epargne">Épargne</option>
                                </select>
                                <select
                                    value={filterCurrency}
                                    onChange={(e) =>
                                        setFilterCurrency(e.target.value)
                                    }
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '12px',
                                        backgroundColor: '#fff',
                                        color: '#444444',
                                    }}
                                >
                                    <option value="all">All Currencies</option>
                                    <option value="USD">USD</option>
                                    <option value="CDF">CDF</option>
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    style={{
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '12px',
                                        backgroundColor: '#fff',
                                        color: '#444444',
                                    }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="blocked">
                                        Blocked Only
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* ACCOUNTS DATA REGISTRY WRAPPER */}
                        <div
                            style={{
                                backgroundColor: colors.white,
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #f1f5f9',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: colors.textDark,
                                        margin: 0,
                                    }}
                                >
                                    Registre des Comptes (
                                    {filteredAccounts.length})
                                </h3>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
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
                                                backgroundColor: '#f8fafc',
                                                borderBottom:
                                                    '1px solid #e2e8f0',
                                                color: colors.textMuted,
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            <th
                                                style={{ padding: '14px 16px' }}
                                            >
                                                N° de Compte
                                            </th>
                                            <th
                                                style={{ padding: '14px 16px' }}
                                            >
                                                Client Info
                                            </th>
                                            <th
                                                style={{ padding: '14px 16px' }}
                                            >
                                                Type
                                            </th>
                                            <th
                                                style={{ padding: '14px 16px' }}
                                            >
                                                Solde Disponible
                                            </th>
                                            <th
                                                style={{ padding: '14px 16px' }}
                                            >
                                                Statut
                                            </th>
                                            <th
                                                style={{
                                                    padding: '14px 16px',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '13.5px' }}>
                                        {filteredAccounts.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    style={{
                                                        padding: '40px 16px',
                                                        textAlign: 'center',
                                                        color: colors.textMuted,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: '15px',
                                                            fontWeight: '600',
                                                            color: colors.textDark,
                                                            marginBottom: '4px',
                                                        }}
                                                    >
                                                        No accounts have been
                                                        created yet.
                                                    </div>
                                                    <p
                                                        style={{
                                                            fontSize: '13px',
                                                            margin: '0 0 12px 0',
                                                        }}
                                                    >
                                                        Change your criteria or
                                                        fill out the
                                                        registration blueprint.
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAccounts.map((compte) => {
                                                const isSavings =
                                                    compte.type_compte ===
                                                        'epargne' ||
                                                    compte.type_compte ===
                                                        'savings';
                                                return (
                                                    <tr
                                                        key={compte.id}
                                                        style={{
                                                            borderBottom:
                                                                '1px solid #f1f5f9',
                                                            transition:
                                                                'background 0.15s',
                                                        }}
                                                        onMouseEnter={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                '#fafafa')
                                                        }
                                                        onMouseLeave={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                'transparent')
                                                        }
                                                    >
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 16px',
                                                                fontWeight:
                                                                    '700',
                                                                fontFamily:
                                                                    'monospace',
                                                                color: colors.primary,
                                                            }}
                                                        >
                                                            {
                                                                compte.numero_compte
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 16px',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    fontWeight:
                                                                        '600',
                                                                    color: colors.textDark,
                                                                }}
                                                            >
                                                                {compte.client
                                                                    ? `${compte.client.nom} ${compte.client.prenom}`
                                                                    : 'Inconnu'}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        '11px',
                                                                    color: colors.textMuted,
                                                                    marginTop:
                                                                        '2px',
                                                                }}
                                                            >
                                                                📞{' '}
                                                                {compte.client
                                                                    ?.telephone ||
                                                                    'No phone'}
                                                            </div>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 16px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    padding:
                                                                        '4px 8px',
                                                                    borderRadius:
                                                                        '6px',
                                                                    fontSize:
                                                                        '11px',
                                                                    fontWeight:
                                                                        '700',
                                                                    textTransform:
                                                                        'uppercase',
                                                                    backgroundColor:
                                                                        isSavings
                                                                            ? '#e0f2fe'
                                                                            : '#e0e7ff',
                                                                    color: isSavings
                                                                        ? '#0369a1'
                                                                        : '#4338ca',
                                                                }}
                                                            >
                                                                {
                                                                    compte.type_compte
                                                                }
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 16px',
                                                                fontWeight:
                                                                    '700',
                                                                color: '#0f172a',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    gap: '6px',
                                                                }}
                                                            >
                                                                <span>
                                                                    {parseFloat(
                                                                        compte.solde,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '10px',
                                                                        padding:
                                                                            '2px 4px',
                                                                        borderRadius:
                                                                            '4px',
                                                                        fontWeight:
                                                                            '700',
                                                                        backgroundColor:
                                                                            compte.devise ===
                                                                            'USD'
                                                                                ? '#dcfce7'
                                                                                : '#ccfbf1',
                                                                        color:
                                                                            compte.devise ===
                                                                            'USD'
                                                                                ? '#15803d'
                                                                                : '#0f766e',
                                                                    }}
                                                                >
                                                                    {
                                                                        compte.devise
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 16px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    padding:
                                                                        '3px 8px',
                                                                    borderRadius:
                                                                        '50px',
                                                                    fontSize:
                                                                        '11px',
                                                                    fontWeight:
                                                                        '600',
                                                                    display:
                                                                        'inline-flex',
                                                                    alignItems:
                                                                        'center',
                                                                    gap: '4px',
                                                                    backgroundColor:
                                                                        compte.actif
                                                                            ? '#dcfce7'
                                                                            : '#fee2e2',
                                                                    color: compte.actif
                                                                        ? '#166534'
                                                                        : '#991b1b',
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: '5px',
                                                                        height: '5px',
                                                                        borderRadius:
                                                                            '50%',
                                                                        backgroundColor:
                                                                            compte.actif
                                                                                ? '#16a34a'
                                                                                : '#dc2626',
                                                                    }}
                                                                ></span>
                                                                {compte.actif
                                                                    ? 'Actif'
                                                                    : 'Bloqué'}
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    '14px 16px',
                                                                textAlign:
                                                                    'right',
                                                            }}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedAccountDetails(
                                                                        compte,
                                                                    )
                                                                }
                                                                style={{
                                                                    padding:
                                                                        '6px',
                                                                    backgroundColor:
                                                                        'transparent',
                                                                    border: '1px solid #e2e8f0',
                                                                    borderRadius:
                                                                        '6px',
                                                                    cursor: 'pointer',
                                                                    color: colors.textDark,
                                                                    display:
                                                                        'inline-flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    gap: '4px',
                                                                    transition:
                                                                        'all 0.15s',
                                                                }}
                                                                onMouseEnter={(
                                                                    e,
                                                                ) =>
                                                                    (e.currentTarget.style.backgroundColor =
                                                                        '#f1f5f9')
                                                                }
                                                                onMouseLeave={(
                                                                    e,
                                                                ) =>
                                                                    (e.currentTarget.style.backgroundColor =
                                                                        'transparent')
                                                                }
                                                            >
                                                                <Eye
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL SIDE PANEL: VIEW DETAILS & ACTIONS SIMULATOR */}
                {selectedAccountDetails && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            zIndex: 100,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '440px',
                                backgroundColor: '#fff',
                                height: '100%',
                                padding: '28px',
                                boxSizing: 'border-box',
                                boxShadow: '-4px 0 25px -5px rgb(0 0 0 / 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '24px',
                                        borderBottom: '1px solid #f1f5f9',
                                        paddingBottom: '14px',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: colors.textDark,
                                            margin: 0,
                                        }}
                                    >
                                        Account Specifications
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setSelectedAccountDetails(null)
                                        }
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: colors.textMuted,
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: '#f8fafc',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                color: colors.textMuted,
                                                fontWeight: '600',
                                            }}
                                        >
                                            ACCOUNT NUMBER
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: '700',
                                                fontFamily: 'monospace',
                                                color: colors.primary,
                                                marginTop: '2px',
                                            }}
                                        >
                                            {
                                                selectedAccountDetails.numero_compte
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                color: colors.textMuted,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Account Holder
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: colors.textDark,
                                                marginTop: '2px',
                                            }}
                                        >
                                            {selectedAccountDetails.client
                                                ? `${selectedAccountDetails.client.nom} ${selectedAccountDetails.client.prenom}`
                                                : 'Inconnu'}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                color: colors.textMuted,
                                            }}
                                        >
                                            {
                                                selectedAccountDetails.client
                                                    ?.telephone
                                            }
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    color: colors.textMuted,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Product Type
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: colors.textDark,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {
                                                    selectedAccountDetails.type_compte
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    color: colors.textMuted,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Active Vault Balance
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    color: '#16a34a',
                                                }}
                                            >
                                                {formatMoney(
                                                    selectedAccountDetails.solde,
                                                    selectedAccountDetails.devise,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CRITICAL feature: Block/Activate Warning Alerts Notice */}
                                <div
                                    style={{
                                        marginTop: '30px',
                                        padding: '14px',
                                        borderRadius: '10px',
                                        backgroundColor:
                                            selectedAccountDetails.actif
                                                ? '#fff7ed'
                                                : '#f0fdf4',
                                        border: `1px solid ${selectedAccountDetails.actif ? '#ffedd5' : '#bbf7d0'}`,
                                        display: 'flex',
                                        gap: '10px',
                                    }}
                                >
                                    <AlertTriangle
                                        size={18}
                                        color={
                                            selectedAccountDetails.actif
                                                ? '#ea580c'
                                                : '#16a34a'
                                        }
                                        style={{
                                            flexShrink: 0,
                                            marginTop: '2px',
                                        }}
                                    />
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: selectedAccountDetails.actif
                                                    ? '#c2410c'
                                                    : '#15803d',
                                            }}
                                        >
                                            {selectedAccountDetails.actif
                                                ? 'Restriction Guard'
                                                : 'Account Blocked Status'}
                                        </div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                margin: '4px 0 0 0',
                                                color: selectedAccountDetails.actif
                                                    ? '#9a3412'
                                                    : '#166534',
                                            }}
                                        >
                                            {selectedAccountDetails.actif
                                                ? 'Blocking this account immediately restricts all incoming/outgoing wire transfers and cashier withdrawals.'
                                                : 'Activating this account restores standard customer transaction workflows instantly.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* BACKEND IMMUTABLE FALLBACK INFO FOOTER */}
                            <div
                                style={{
                                    borderTop: '1px solid #f1f5f9',
                                    paddingTop: '16px',
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: colors.textMuted,
                                        margin: '0 0 12px 0',
                                        textAlign: 'center',
                                    }}
                                >
                                    To alter status or modify parameters, submit
                                    requests via your default configuration
                                    routes.
                                </p>
                                <button
                                    onClick={() =>
                                        setSelectedAccountDetails(null)
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                    }}
                                >
                                    Dismiss Panel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
