import React, { useState, useMemo } from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import CashierLayout from '../../../layouts/CashierLayout';

export default function Index() {
    const Layout = CashierLayout;
    const { transactions = [], comptes = [] } = usePage().props;

    // Local states for search and table filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'depot', 'retrait', 'virement'

    const { data, setData, post, processing, errors, reset } = useForm({
        compte_id: '',
        type: 'depot',
        montant: '',
        compte_destination_id: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const url =
            typeof route !== 'undefined'
                ? route('caissier.transactions.store')
                : '/caissier/transactions';

        post(url, {
            onSuccess: () =>
                reset('montant', 'compte_destination_id', 'description'),
        });
    };

    // Calculate aggregated stats on the fly
    const stats = useMemo(() => {
        return transactions.reduce(
            (acc, tx) => {
                const amount = parseFloat(tx.montant) || 0;
                acc.totalCount += 1;
                if (tx.type === 'depot') acc.totalDeposits += amount;
                if (tx.type === 'retrait') acc.totalWithdrawals += amount;
                if (tx.type === 'virement') acc.totalTransfers += amount;
                return acc;
            },
            {
                totalCount: 0,
                totalDeposits: 0,
                totalWithdrawals: 0,
                totalTransfers: 0,
            },
        );
    }, [transactions]);

    // Fast local client side search & filter logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesFilter =
                activeFilter === 'all' || tx.type === activeFilter;

            const ref = (tx.reference_unique || '').toLowerCase();
            const accountNum = (tx.compte?.numero_compte || '').toLowerCase();
            const clientName = (tx.compte?.client?.nom || '').toLowerCase();
            const destAccountNum = (
                (tx.compte_destination || tx.compteDestination)
                    ?.numero_compte || ''
            ).toLowerCase();

            const matchesSearch =
                ref.includes(searchTerm.toLowerCase()) ||
                accountNum.includes(searchTerm.toLowerCase()) ||
                destAccountNum.includes(searchTerm.toLowerCase()) ||
                clientName.includes(searchTerm.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [transactions, activeFilter, searchTerm]);

    return (
        <Layout>
            <Head title="Guichet des Opérations" />

            {/* Scoped CSS Injector for modern interactive states & loading frames */}
            <style>{`
                .banking-input:focus {
                    border-color: #2563eb !important;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15) !important;
                    outline: none;
                }
                .filter-btn {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
                }
                .hover-row {
                    transition: background-color 0.15s ease;
                }
                .hover-row:hover {
                    background-color: #f8fafc !important;
                }
                @media (max-width: 1024px) {
                    .desktop-layout { grid-template-columns: 1fr !important; }
                    .desktop-table-view { display: none !important; }
                    .mobile-cards-view { display: grid !important; }
                }
            `}</style>

            <div
                style={{
                    backgroundColor: '#f8fafc',
                    minHeight: '100vh',
                    padding: '12px',
                }}
            >
                {/* Header Section */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#2563eb',
                            padding: '14px',
                            borderRadius: '12px',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                        }}
                    >
                        <svg
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2
                            style={{
                                fontSize: '26px',
                                fontWeight: '800',
                                margin: 0,
                                color: '#111827',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Guichet des Opérations
                        </h2>
                        <p
                            style={{
                                color: '#6b7280',
                                margin: '4px 0 0 0',
                                fontSize: '14px',
                                fontWeight: '400',
                            }}
                        >
                            Perform deposits, withdrawals and transfers
                            securely.
                        </p>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px',
                        marginBottom: '32px',
                    }}
                >
                    {[
                        {
                            title: 'Total Transactions',
                            value: stats.totalCount,
                            color: '#2563eb',
                            bg: '#eff6ff',
                            desc: 'Opérations exécutées',
                        },
                        {
                            title: 'Total Dépôts',
                            value: `${stats.totalDeposits.toFixed(2)}`,
                            color: '#16a34a',
                            bg: '#f0fdf4',
                            desc: 'Flux entrants total',
                        },
                        {
                            title: 'Total Retraits',
                            value: `${stats.totalWithdrawals.toFixed(2)}`,
                            color: '#dc2626',
                            bg: '#fef2f2',
                            desc: 'Flux sortants total',
                        },
                        {
                            title: 'Total Virements',
                            value: `${stats.totalTransfers.toFixed(2)}`,
                            color: '#f59e0b',
                            bg: '#fffbeb',
                            desc: 'Mouvements internes',
                        },
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="hover-card"
                            style={{
                                backgroundColor: '#ffffff',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'between',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {card.title}
                                </span>
                                <span
                                    style={{
                                        backgroundColor: card.bg,
                                        color: card.color,
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                    }}
                                >
                                    {idx === 0 ? 'Vol' : 'Val'}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: '24px',
                                    fontWeight: '800',
                                    color: '#111827',
                                    marginBottom: '4px',
                                }}
                            >
                                {card.value}
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                }}
                            >
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div
                    className="desktop-layout"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '420px 1fr',
                        gap: '32px',
                        alignItems: 'start',
                    }}
                >
                    {/* Operation Execution Form Panel */}
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '28px',
                            borderRadius: '18px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <h3
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    margin: 0,
                                    color: '#111827',
                                }}
                            >
                                Nouvelle Opération
                            </h3>
                            <p
                                style={{
                                    margin: '4px 0 0 0',
                                    fontSize: '13px',
                                    color: '#6b7280',
                                }}
                            >
                                Renseignez soigneusement les critères de
                                transfert.
                            </p>
                        </div>

                        {errors.error && (
                            <div
                                style={{
                                    padding: '14px',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fca5a5',
                                    color: '#dc2626',
                                    borderRadius: '10px',
                                    marginBottom: '20px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    gap: '8px',
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                {errors.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Primary Target Account Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}
                                >
                                    {data.type === 'virement'
                                        ? "Compte d'origine / Source :"
                                        : 'Compte concerné :'}
                                </label>
                                <select
                                    value={data.compte_id}
                                    onChange={(e) =>
                                        setData('compte_id', e.target.value)
                                    }
                                    className="banking-input"
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: '#fff',
                                        color: '#111827',
                                        fontSize: '14px',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <option value="">
                                        Sélectionner un compte...
                                    </option>
                                    {comptes?.map((compte) => (
                                        <option
                                            key={compte.id}
                                            value={compte.id}
                                        >
                                            {compte.numero_compte} -{' '}
                                            {compte.client?.nom}{' '}
                                            {compte.client?.prenom} (
                                            {parseFloat(compte.solde).toFixed(
                                                2,
                                            )}{' '}
                                            {compte.devise})
                                        </option>
                                    ))}
                                </select>
                                {errors.compte_id && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '12px',
                                            marginTop: '6px',
                                            display: 'block',
                                        }}
                                    >
                                        {errors.compte_id}
                                    </span>
                                )}
                            </div>

                            {/* Action Typology Selector */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}
                                >
                                    Type d'opération :
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    className="banking-input"
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: '#fff',
                                        color: '#111827',
                                        fontSize: '14px',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <option value="depot">
                                        Dépôt (Crédit)
                                    </option>
                                    <option value="retrait">
                                        Retrait (Débit)
                                    </option>
                                    <option value="virement">
                                        Virement (Transfert)
                                    </option>
                                </select>
                                {errors.type && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '12px',
                                            marginTop: '6px',
                                            display: 'block',
                                        }}
                                    >
                                        {errors.type}
                                    </span>
                                )}
                            </div>

                            {/* Dynamic Inter-bank Destinataire Panel */}
                            {data.type === 'virement' && (
                                <div
                                    style={{
                                        marginBottom: '20px',
                                        padding: '16px',
                                        backgroundColor: '#eff6ff',
                                        borderRadius: '12px',
                                        border: '1px solid #bfdbfe',
                                        animation: 'fadeIn 0.2s ease',
                                    }}
                                >
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: '#1e40af',
                                        }}
                                    >
                                        Compte bénéficiaire (Destination) :
                                    </label>
                                    <select
                                        value={data.compte_destination_id}
                                        onChange={(e) =>
                                            setData(
                                                'compte_destination_id',
                                                e.target.value,
                                            )
                                        }
                                        className="banking-input"
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '10px',
                                            border: '1px solid #bfdbfe',
                                            backgroundColor: '#fff',
                                            color: '#111827',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <option value="">
                                            Choisir le bénéficiaire...
                                        </option>
                                        {comptes
                                            ?.filter(
                                                (c) =>
                                                    c.id !==
                                                    Number(data.compte_id),
                                            )
                                            .map((compte) => (
                                                <option
                                                    key={compte.id}
                                                    value={compte.id}
                                                >
                                                    {compte.numero_compte} -{' '}
                                                    {compte.client?.nom}{' '}
                                                    {compte.client?.prenom} (
                                                    {compte.devise})
                                                </option>
                                            ))}
                                    </select>
                                    {errors.compte_destination_id && (
                                        <span
                                            style={{
                                                color: '#dc2626',
                                                fontSize: '12px',
                                                marginTop: '6px',
                                                display: 'block',
                                            }}
                                        >
                                            {errors.compte_destination_id}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Numeric Allocation Input */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}
                                >
                                    Montant :
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.montant}
                                        onChange={(e) =>
                                            setData('montant', e.target.value)
                                        }
                                        placeholder="0.00"
                                        className="banking-input"
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '10px',
                                            border: '1px solid #d1d5db',
                                            color: '#111827',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                {errors.montant && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '12px',
                                            marginTop: '6px',
                                            display: 'block',
                                        }}
                                    >
                                        {errors.montant}
                                    </span>
                                )}
                            </div>

                            {/* Description Annotation Container */}
                            <div style={{ marginBottom: '26px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '8px',
                                        color: '#374151',
                                    }}
                                >
                                    Libellé / Motif (Optionnel) :
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Ex: Retrait guichet, Virement loyer..."
                                    className="banking-input"
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #d1d5db',
                                        color: '#111827',
                                        backgroundColor: '#fff',
                                        height: '72px',
                                        resize: 'none',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                {errors.description && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '12px',
                                            marginTop: '6px',
                                            display: 'block',
                                        }}
                                    >
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Execution Blueprint Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    backgroundColor: processing
                                        ? '#93c5fd'
                                        : '#2563eb',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: processing
                                        ? 'not-allowed'
                                        : 'pointer',
                                    boxShadow:
                                        '0 4px 12px rgba(37, 99, 235, 0.15)',
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e) =>
                                    !processing &&
                                    (e.target.style.backgroundColor = '#1d4ed8')
                                }
                                onMouseLeave={(e) =>
                                    !processing &&
                                    (e.target.style.backgroundColor = '#2563eb')
                                }
                            >
                                {processing
                                    ? 'Validation en cours...'
                                    : "Exécuter l'opération"}
                            </button>
                        </form>
                    </div>

                    {/* Historical Logs & Filtration Core */}
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '28px',
                            borderRadius: '18px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                marginBottom: '24px',
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        margin: 0,
                                        color: '#111827',
                                    }}
                                >
                                    Journal des Transactions (
                                    {filteredTransactions.length})
                                </h3>
                                <p
                                    style={{
                                        margin: '4px 0 0 0',
                                        fontSize: '13px',
                                        color: '#6b7280',
                                    }}
                                >
                                    Historique récapitulatif en temps réel.
                                </p>
                            </div>

                            {/* Client Side Search Matrix */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        flex: '1',
                                        minWidth: '240px',
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Rechercher par Réf, compte, nom..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="banking-input"
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            borderRadius: '10px',
                                            border: '1px solid #e5e7eb',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                            color: '#343435',
                                        }}
                                    />
                                </div>

                                {/* Structural Type Filter Tabs */}
                                <div
                                    style={{
                                        display: 'flex',
                                        backgroundColor: '#f1f5f9',
                                        padding: '4px',
                                        borderRadius: '10px',
                                        gap: '2px',
                                    }}
                                >
                                    {[
                                        { id: 'all', label: 'Tous' },
                                        { id: 'depot', label: 'Dépôts' },
                                        { id: 'retrait', label: 'Retraits' },
                                        { id: 'virement', label: 'Virements' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() =>
                                                setActiveFilter(tab.id)
                                            }
                                            className="filter-btn"
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                backgroundColor:
                                                    activeFilter === tab.id
                                                        ? '#ffffff'
                                                        : 'transparent',
                                                color:
                                                    activeFilter === tab.id
                                                        ? '#2563eb'
                                                        : '#6b7280',
                                                boxShadow:
                                                    activeFilter === tab.id
                                                        ? '0 1px 3px rgba(0,0,0,0.05)'
                                                        : 'none',
                                            }}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Responsive Interface Handler */}
                        {filteredTransactions.length === 0 ? (
                            <div
                                style={{
                                    padding: '48px 16px',
                                    textAlign: 'center',
                                    border: '2px dashed #e5e7eb',
                                    borderRadius: '14px',
                                    backgroundColor: '#f8fafc',
                                }}
                            >
                                <div
                                    style={{
                                        color: '#9ca3af',
                                        marginBottom: '12px',
                                    }}
                                >
                                    <svg
                                        width="40"
                                        height="40"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        style={{ margin: '0 auto' }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <h4
                                    style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: '#374151',
                                    }}
                                >
                                    No transactions found.
                                </h4>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        color: '#6b7280',
                                    }}
                                >
                                    Create a transaction to begin.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Matrix Table View */}
                                <div
                                    className="desktop-table-view"
                                    style={{ overflowX: 'auto' }}
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
                                                        '1px solid #e5e7eb',
                                                    color: '#4b5563',
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    Référence / Date
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    Comptes (Src & Dest)
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        fontWeight: '600',
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    Montant
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        fontWeight: '600',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Caissier
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontSize: '13px' }}>
                                            {filteredTransactions.map((tx) => {
                                                const isDeposit =
                                                    tx.type === 'depot';
                                                const isWithdrawal =
                                                    tx.type === 'retrait';

                                                let badgeBg = '#eff6ff',
                                                    badgeColor = '#2563eb'; // Virement defaults
                                                if (isDeposit) {
                                                    badgeBg = '#e6f4ea';
                                                    badgeColor = '#137333';
                                                }
                                                if (isWithdrawal) {
                                                    badgeBg = '#fce8e6';
                                                    badgeColor = '#c5221f';
                                                }

                                                return (
                                                    <tr
                                                        key={tx.id}
                                                        className="hover-row"
                                                        style={{
                                                            borderBottom:
                                                                '1px solid #f1f5f9',
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                padding: '16px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        '600',
                                                                    color: '#111827',
                                                                    display:
                                                                        'block',
                                                                }}
                                                            >
                                                                {
                                                                    tx.reference_unique
                                                                }
                                                            </span>
                                                            <span
                                                                style={{
                                                                    color: '#9ca3af',
                                                                    fontSize:
                                                                        '11px',
                                                                    marginTop:
                                                                        '2px',
                                                                    display:
                                                                        'block',
                                                                }}
                                                            >
                                                                {new Date(
                                                                    tx.created_at,
                                                                ).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: '16px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    padding:
                                                                        '4px 10px',
                                                                    borderRadius:
                                                                        '9999px',
                                                                    fontSize:
                                                                        '11px',
                                                                    fontWeight:
                                                                        '700',
                                                                    backgroundColor:
                                                                        badgeBg,
                                                                    color: badgeColor,
                                                                    textTransform:
                                                                        'uppercase',
                                                                    letterSpacing:
                                                                        '0.02em',
                                                                }}
                                                            >
                                                                {tx.type}
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: '16px',
                                                                color: '#374151',
                                                            }}
                                                        >
                                                            <div>
                                                                <span
                                                                    style={{
                                                                        color: '#6b7280',
                                                                        fontSize:
                                                                            '12px',
                                                                    }}
                                                                >
                                                                    Src:
                                                                </span>{' '}
                                                                <strong>
                                                                    {
                                                                        tx
                                                                            .compte
                                                                            ?.numero_compte
                                                                    }
                                                                </strong>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '11px',
                                                                        color: '#9ca3af',
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    (
                                                                    {
                                                                        tx
                                                                            .compte
                                                                            ?.client
                                                                            ?.nom
                                                                    }
                                                                    )
                                                                </span>
                                                            </div>
                                                            {tx.type ===
                                                                'virement' &&
                                                                (tx.compte_destination ||
                                                                    tx.compteDestination) && (
                                                                    <div
                                                                        style={{
                                                                            marginTop:
                                                                                '4px',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                color: '#2563eb',
                                                                                fontSize:
                                                                                    '12px',
                                                                            }}
                                                                        >
                                                                            Dest:
                                                                        </span>{' '}
                                                                        <strong>
                                                                            {
                                                                                (
                                                                                    tx.compte_destination ||
                                                                                    tx.compteDestination
                                                                                )
                                                                                    ?.numero_compte
                                                                            }
                                                                        </strong>
                                                                        <span
                                                                            style={{
                                                                                fontSize:
                                                                                    '11px',
                                                                                color: '#9ca3af',
                                                                            }}
                                                                        >
                                                                            {' '}
                                                                            (
                                                                            {
                                                                                (
                                                                                    tx.compte_destination ||
                                                                                    tx.compteDestination
                                                                                )
                                                                                    ?.client
                                                                                    ?.nom
                                                                            }
                                                                            )
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: '16px',
                                                                fontWeight:
                                                                    '700',
                                                                fontSize:
                                                                    '14px',
                                                                textAlign:
                                                                    'right',
                                                                color: isDeposit
                                                                    ? '#16a34a'
                                                                    : '#dc2626',
                                                            }}
                                                        >
                                                            {isDeposit
                                                                ? '+'
                                                                : '-'}{' '}
                                                            {parseFloat(
                                                                tx.montant,
                                                            ).toFixed(2)}{' '}
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '11px',
                                                                    fontWeight:
                                                                        '500',
                                                                    color: '#6b7280',
                                                                }}
                                                            >
                                                                {
                                                                    tx.compte
                                                                        ?.devise
                                                                }
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: '16px',
                                                                color: '#6b7280',
                                                                textAlign:
                                                                    'center',
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {tx.caissier.name ||
                                                                'Système'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Structural Adaptive Layout List */}
                                <div
                                    className="mobile-cards-view"
                                    style={{
                                        display: 'none',
                                        gridTemplateColumns: '1fr',
                                        gap: '16px',
                                    }}
                                >
                                    {filteredTransactions.map((tx) => {
                                        const isDeposit = tx.type === 'depot';
                                        let badgeBg = '#eff6ff',
                                            badgeColor = '#2563eb';
                                        if (isDeposit) {
                                            badgeBg = '#e6f4ea';
                                            badgeColor = '#137333';
                                        }
                                        if (tx.type === 'retrait') {
                                            badgeBg = '#fce8e6';
                                            badgeColor = '#c5221f';
                                        }

                                        return (
                                            <div
                                                key={tx.id}
                                                style={{
                                                    p: '16px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    backgroundColor: '#ffffff',
                                                    padding: '16px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '12px',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: '700',
                                                            color: '#111827',
                                                            fontSize: '14px',
                                                        }}
                                                    >
                                                        {tx.reference_unique}
                                                    </span>
                                                    <span
                                                        style={{
                                                            padding: '2px 8px',
                                                            borderRadius:
                                                                '9999px',
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            backgroundColor:
                                                                badgeBg,
                                                            color: badgeColor,
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                    >
                                                        {tx.type}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '13px',
                                                        color: '#4b5563',
                                                        marginBottom: '12px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '4px',
                                                    }}
                                                >
                                                    <div>
                                                        <span
                                                            style={{
                                                                color: '#9ca3af',
                                                            }}
                                                        >
                                                            Compte:
                                                        </span>{' '}
                                                        {
                                                            tx.compte
                                                                ?.numero_compte
                                                        }
                                                    </div>
                                                    {tx.type === 'virement' &&
                                                        (tx.compte_destination ||
                                                            tx.compteDestination) && (
                                                            <div>
                                                                <span
                                                                    style={{
                                                                        color: '#2563eb',
                                                                    }}
                                                                >
                                                                    Bénéficiaire:
                                                                </span>{' '}
                                                                {
                                                                    (
                                                                        tx.compte_destination ||
                                                                        tx.compteDestination
                                                                    )
                                                                        ?.numero_compte
                                                                }
                                                            </div>
                                                        )}
                                                    <div
                                                        style={{
                                                            fontSize: '11px',
                                                            color: '#9ca3af',
                                                        }}
                                                    >
                                                        {new Date(
                                                            tx.created_at,
                                                        ).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        borderTop:
                                                            '1px solid #f1f5f9',
                                                        paddingTop: '10px',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: '12px',
                                                            color: '#6b7280',
                                                        }}
                                                    >
                                                        Montant global:
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontWeight: '800',
                                                            fontSize: '15px',
                                                            color: isDeposit
                                                                ? '#16a34a'
                                                                : '#dc2626',
                                                        }}
                                                    >
                                                        {isDeposit ? '+' : '-'}{' '}
                                                        {parseFloat(
                                                            tx.montant,
                                                        ).toFixed(2)}{' '}
                                                        {tx.compte?.devise}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
