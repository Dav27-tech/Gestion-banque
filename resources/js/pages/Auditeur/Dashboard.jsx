import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuditorLayout from '@/layouts/AuditorLayout';
import {
    Printer,
    FileSpreadsheet,
    ShieldAlert,
    TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
    // Récupération complète des données fournies par AuditeurController
    const { transactions, stats } = usePage().props;

    const declencherImpression = () => {
        window.print();
    };

    return (
        <div
            style={{
                padding: '40px',
                color: '#0f172a',
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <Head title="Contrôle Interne & Audit Financier" />

            {/* Injection CSS pour l'impression directe conforme */}
            <style>{`
                @media print {
                    body { background-color: #ffffff; color: #000000; padding: 0; margin: 0; }
                    .zone-boutons, aside { display: none !important; }
                    .carte-stat { border: 1px solid #000000 !important; box-shadow: none !important; background: #ffffff !important; }
                    .conteneur-audit { padding: 0 !important; }
                    table { width: 100% !important; page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                }
            `}</style>

            <div className="conteneur-audit">
                {/* Entête du rapport d'audit */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '35px',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '20px',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: '26px',
                                fontWeight: '800',
                                margin: 0,
                                color: '#0f172a',
                                letterSpacing: '-0.025em',
                            }}
                        >
                            Rapport d'Audit Comptable
                        </h2>
                        <p
                            style={{
                                color: '#64748b',
                                margin: '6px 0 0 0',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Situation des liquidités de la banque et traçabilité
                            des opérations.
                        </p>
                    </div>

                    <div
                        className="zone-boutons"
                        style={{ display: 'flex', gap: '12px' }}
                    >
                        <button
                            onClick={declencherImpression}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                backgroundColor: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow:
                                    '0 4px 12px rgba(16, 185, 129, 0.15)',
                                fontSize: '14px',
                            }}
                        >
                            <Printer size={16} />
                            Imprimer le Rapport (PDF)
                        </button>
                    </div>
                </div>

                {/* Indicateurs de masses monétaires réalignés */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '20px',
                        marginBottom: '40px',
                    }}
                >
                    {/* Carte 1 */}
                    <div
                        className="carte-stat"
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '24px',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Encaisse Totale (USD)
                        </span>
                        <h3
                            style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#7A1C1C',
                                margin: '12px 0 0 0',
                                letterSpacing: '-0.025em',
                            }}
                        >
                            {parseFloat(stats.masse_monetaire_usd).toFixed(2)} $
                        </h3>
                    </div>

                    {/* Carte 2 */}
                    <div
                        className="carte-stat"
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '24px',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Encaisse Totale (CDF)
                        </span>
                        <h3
                            style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#9f2d2d',
                                margin: '12px 0 0 0',
                                letterSpacing: '-0.025em',
                            }}
                        >
                            {parseFloat(stats.masse_monetaire_cdf).toFixed(2)}{' '}
                            FC
                        </h3>
                    </div>
                    {/* Carte 3 */}
                    <div
                        className="carte-stat"
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '24px',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Total Comptes Ouverts
                        </span>
                        <h3
                            style={{
                                fontSize: '22px',
                                fontWeight: '800',
                                color: '#0f172a',
                                margin: '12px 0 0 0',
                                letterSpacing: '-0.025em',
                            }}
                        >
                            {stats.comptes_courant + stats.comptes_epargne}{' '}
                            <span
                                style={{
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: '#64748b',
                                }}
                            >
                                ({stats.comptes_epargne} Épargnes)
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Journal de traçabilité bancaire */}
                <div
                    style={{
                        backgroundColor: '#ffffff',
                        padding: '30px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            borderBottom: '1px solid #f1f5f9',
                            paddingBottom: '14px',
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <FileSpreadsheet size={18} color="#7A1C1C" />
                        Journal Général des Mouvements Comptables (
                        {stats.total_operations} écritures)
                    </h3>

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
                                    borderBottom: '2px solid #f1f5f9',
                                    color: '#64748b',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                <th
                                    style={{
                                        padding: '12px 10px',
                                        fontWeight: '700',
                                    }}
                                >
                                    Date & Réf Unique
                                </th>
                                <th
                                    style={{
                                        padding: '12px 10px',
                                        fontWeight: '700',
                                    }}
                                >
                                    Type
                                </th>
                                <th
                                    style={{
                                        padding: '12px 10px',
                                        fontWeight: '700',
                                    }}
                                >
                                    Compte Concerné
                                </th>
                                <th
                                    style={{
                                        padding: '12px 10px',
                                        fontWeight: '700',
                                    }}
                                >
                                    Montant
                                </th>
                                <th
                                    style={{
                                        padding: '12px 10px',
                                        fontWeight: '700',
                                    }}
                                >
                                    Opérateur (Caissier/Système)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        fontSize: '14px',
                                        transition: 'background-color 150ms',
                                    }}
                                    className="table-row-hover"
                                >
                                    <td style={{ padding: '16px 10px' }}>
                                        <span
                                            style={{
                                                fontWeight: '700',
                                                display: 'block',
                                                color: '#0f172a',
                                            }}
                                        >
                                            {tx.reference_unique}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '12px',
                                                color: '#94a3b8',
                                                marginTop: '2px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {new Date(
                                                tx.created_at,
                                            ).toLocaleString()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 10px' }}>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                backgroundColor:
                                                    tx.type === 'depot'
                                                        ? '#dcfce7'
                                                        : tx.type === 'retrait'
                                                          ? '#fee2e2'
                                                          : '#fef3c7',
                                                color:
                                                    tx.type === 'depot'
                                                        ? '#166534'
                                                        : tx.type === 'retrait'
                                                          ? '#991b1b'
                                                          : '#92400e',
                                            }}
                                        >
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 10px' }}>
                                        <strong
                                            style={{
                                                color: '#0f172a',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {tx.compte?.numero_compte}
                                        </strong>
                                        <span
                                            style={{
                                                display: 'block',
                                                fontSize: '12px',
                                                color: '#64748b',
                                                marginTop: '2px',
                                            }}
                                        >
                                            Client : {tx.compte?.client?.nom}{' '}
                                            {tx.compte?.client?.prenom}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            padding: '16px 10px',
                                            fontWeight: '700',
                                            fontSize: '15px',
                                            color:
                                                tx.type === 'depot'
                                                    ? '#16a34a'
                                                    : '#dc2626',
                                        }}
                                    >
                                        {tx.type === 'depot' ? '+' : '-'}{' '}
                                        {parseFloat(tx.montant).toFixed(2)}{' '}
                                        {tx.compte?.devise}
                                    </td>
                                    <td
                                        style={{
                                            padding: '16px 10px',
                                            color: '#475569',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {tx.caissier
                                            ? tx.caissier.name
                                            : '🎛️ SYSTÈME (Intérêts)'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Configuration d'Inertia : Persistance du Layout d'Audit Global
Dashboard.layout = (page) => <AuditorLayout children={page} />;
