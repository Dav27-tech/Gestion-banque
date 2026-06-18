import React from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import CashierLayout from '../../../layouts/CashierLayout';

export default function Index() {
    const Layout = CashierLayout;
    const { transactions, comptes } = usePage().props;

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

    return (
        <Layout>
            <Head title="Guichet des Opérations" />

            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                    Guichet des Opérations
                </h2>
                <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                    Effectuez des dépôts, des retraits ou des virements
                    inter-comptes en temps réel.
                </p>
            </div>

            {errors.error && (
                <div
                    style={{
                        padding: '12px',
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontWeight: '500',
                    }}
                >
                    {errors.error}
                </div>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '30px',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb',
                        height: 'fit-content',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#1f2937',
                        }}
                    >
                        Nouvelle Opération
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    marginBottom: '5px',
                                    color: '#374151',
                                }}
                            >
                                Compte concerné :
                            </label>
                            <select
                                value={data.compte_id}
                                onChange={(e) =>
                                    setData('compte_id', e.target.value)
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#fff',
                                    boxSizing: 'border-box',
                                    color: '#111827',
                                }}
                            >
                                <option value="">
                                    Sélectionner un compte...
                                </option>
                                {comptes?.map((compte) => (
                                    <option key={compte.id} value={compte.id}>
                                        {compte.numero_compte} -{' '}
                                        {compte.client?.nom}{' '}
                                        {compte.client?.prenom} (
                                        {parseFloat(compte.solde).toFixed(2)}{' '}
                                        {compte.devise})
                                    </option>
                                ))}
                            </select>
                            {errors.compte_id && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.compte_id}
                                </span>
                            )}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    marginBottom: '5px',
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
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#fff',
                                    boxSizing: 'border-box',
                                    color: '#111827',
                                }}
                            >
                                <option value="depot">Dépôt (Crédit)</option>
                                <option value="retrait">Retrait (Débit)</option>
                                <option value="virement">
                                    Virement (Transfert)
                                </option>
                            </select>
                            {errors.type && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.type}
                                </span>
                            )}
                        </div>

                        {data.type === 'virement' && (
                            <div
                                style={{
                                    marginBottom: '15px',
                                    padding: '12px',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '6px',
                                    border: '1px solid #bfdbfe',
                                }}
                            >
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '5px',
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
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: '#fff',
                                        boxSizing: 'border-box',
                                        color: '#111827',
                                    }}
                                >
                                    <option value="">
                                        Choisir le bénéficiaire...
                                    </option>
                                    {comptes
                                        ?.filter((c) => c.id !== data.compte_id)
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
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.compte_destination_id}
                                    </span>
                                )}
                            </div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    marginBottom: '5px',
                                    color: '#374151',
                                }}
                            >
                                Montant :
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.montant}
                                onChange={(e) =>
                                    setData('montant', e.target.value)
                                }
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    boxSizing: 'border-box',
                                    color: '#111827',
                                    backgroundColor: '#fff',
                                }}
                            />
                            {errors.montant && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.montant}
                                </span>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    marginBottom: '5px',
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
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    boxSizing: 'border-box',
                                    color: '#111827',
                                    backgroundColor: '#fff',
                                    height: '60px',
                                    resize: 'none',
                                }}
                            />
                            {errors.description && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.description}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing
                                ? 'Validation en cours...'
                                : "Exécuter l'opération"}
                        </button>
                    </form>
                </div>

                <div
                    style={{
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '15px',
                            color: '#1f2937',
                        }}
                    >
                        Journal des Transactions ({transactions?.length || 0})
                    </h3>

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
                                        borderBottom: '2px solid #e5e7eb',
                                        color: '#4b5563',
                                        fontSize: '14px',
                                    }}
                                >
                                    <th style={{ padding: '12px 8px' }}>
                                        Référence / Date
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Type
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Comptes
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Montant
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Caissier
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            style={{
                                                padding: '20px 8px',
                                                textAlign: 'center',
                                                color: '#9ca3af',
                                            }}
                                        >
                                            Aucune transaction enregistrée dans
                                            le journal.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions?.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            style={{
                                                borderBottom:
                                                    '1px solid #f3f4f6',
                                                fontSize: '13px',
                                            }}
                                        >
                                            <td style={{ padding: '12px 8px' }}>
                                                <span
                                                    style={{
                                                        fontWeight: '600',
                                                        color: '#374151',
                                                        display: 'block',
                                                    }}
                                                >
                                                    {tx.reference_unique}
                                                </span>
                                                <span
                                                    style={{
                                                        color: '#9ca3af',
                                                        fontSize: '11px',
                                                    }}
                                                >
                                                    {new Date(
                                                        tx.created_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <span
                                                    style={{
                                                        padding: '3px 8px',
                                                        borderRadius: '50px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        backgroundColor:
                                                            tx.type === 'depot'
                                                                ? '#dcfce7'
                                                                : tx.type ===
                                                                    'retrait'
                                                                  ? '#fee2e2'
                                                                  : '#fef3c7',
                                                        color:
                                                            tx.type === 'depot'
                                                                ? '#166534'
                                                                : tx.type ===
                                                                    'retrait'
                                                                  ? '#991b1b'
                                                                  : '#92400e',
                                                        textTransform:
                                                            'uppercase',
                                                    }}
                                                >
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#111827',
                                                }}
                                            >
                                                <div>
                                                    Source:{' '}
                                                    <strong>
                                                        {
                                                            tx.compte
                                                                ?.numero_compte
                                                        }
                                                    </strong>{' '}
                                                    <span
                                                        style={{
                                                            fontSize: '11px',
                                                            color: '#6b7280',
                                                        }}
                                                    >
                                                        (
                                                        {tx.compte?.client?.nom}
                                                        )
                                                    </span>
                                                </div>
                                                {tx.type === 'virement' &&
                                                    (tx.compte_destination ||
                                                        tx.compteDestination) && (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    '2px',
                                                                color: '#1e40af',
                                                            }}
                                                        >
                                                            Dest:{' '}
                                                            <strong>
                                                                {
                                                                    (
                                                                        tx.compte_destination ||
                                                                        tx.compteDestination
                                                                    )
                                                                        ?.numero_compte
                                                                }
                                                            </strong>{' '}
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '11px',
                                                                    color: '#6b7280',
                                                                }}
                                                            >
                                                                (
                                                                {
                                                                    (
                                                                        tx.compte_destination ||
                                                                        tx.compteDestination
                                                                    )?.client
                                                                        ?.nom
                                                                }
                                                                )
                                                            </span>
                                                        </div>
                                                    )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    fontWeight: '600',
                                                    fontSize: '14px',
                                                    color:
                                                        tx.type === 'depot'
                                                            ? '#16a34a'
                                                            : '#dc2626',
                                                }}
                                            >
                                                {tx.type === 'depot'
                                                    ? '+'
                                                    : '-'}{' '}
                                                {parseFloat(tx.montant).toFixed(
                                                    2,
                                                )}{' '}
                                                {tx.compte?.devise}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#4b5563',
                                                }}
                                            >
                                                {tx.caissier?.name || 'Système'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
