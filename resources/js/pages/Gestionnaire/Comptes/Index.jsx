import React from 'react';
import { usePage, useForm, Head, Link } from '@inertiajs/react';
import { useRoleLayout } from '../../../layouts/useRoleLayout';
import ManagerLayout from '../../../layouts/ManagerLayout';

export default function Index() {
    const Layout = ManagerLayout;
    // 1. Récupération des données partagées par le CompteController
    const { comptes, clients } = usePage().props;

    // 2. Initialisation du formulaire Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: '',
        type_compte: 'courant',
        devise: 'USD',
        solde: '0',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const url =
            typeof route !== 'undefined'
                ? route('gestionnaire.comptes.store')
                : '/gestionnaire/comptes';
        post(url, {
            onSuccess: () => reset('client_id', 'solde'), // Réinitialise le client et le solde après création
        });
    };

    return (
        <Layout>
            <div
                style={{
                    padding: '30px',
                    backgroundColor: '#f9fafb',
                    minHeight: '100vh',
                    color: '#111827',
                    fontFamily: 'sans-serif',
                }}
            >
                <Head title="Gestion des Comptes Bancaires" />

                <div
                    style={{
                        marginBottom: '25px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                margin: 0,
                            }}
                        >
                            Gestion des Comptes Bancaires
                        </h2>
                        <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                            Ouvrez et gérez les comptes bancaires des clients
                            enregistrés.
                        </p>
                    </div>

                    <div>
                        <Link
                            href={
                                typeof route !== 'undefined'
                                    ? route('logout')
                                    : '/logout'
                            }
                            method="post"
                            as="button"
                            style={{
                                padding: '8px 12px',
                                background: '#ef4444',
                                color: '#fff',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Déconnexion
                        </Link>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr',
                        gap: '30px',
                    }}
                >
                    {/* FORMULAIRE D'OUVERTURE DE COMPTE */}
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
                            Ouvrir un Compte
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Sélection du Client */}
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
                                    Titulaire du compte :
                                </label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) =>
                                        setData('client_id', e.target.value)
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
                                        Sélectionner un client...
                                    </option>
                                    {clients?.map((client) => (
                                        <option
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.nom} {client.prenom} (
                                            {client.telephone})
                                        </option>
                                    ))}
                                </select>
                                {errors.client_id && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.client_id}
                                    </span>
                                )}
                            </div>

                            {/* Type de Compte */}
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
                                    Type de compte :
                                </label>
                                <select
                                    value={data.type_compte}
                                    onChange={(e) =>
                                        setData('type_compte', e.target.value)
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
                                    <option value="courant">
                                        Compte Courant
                                    </option>
                                    <option value="epargne">
                                        Compte Épargne
                                    </option>
                                </select>
                                {errors.type_compte && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.type_compte}
                                    </span>
                                )}
                            </div>

                            {/* Devise */}
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
                                    Devise :
                                </label>
                                <select
                                    value={data.devise}
                                    onChange={(e) =>
                                        setData('devise', e.target.value)
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
                                    <option value="USD">
                                        Dollar Américain ($)
                                    </option>
                                    <option value="CDF">
                                        Franc Congolais (FC)
                                    </option>
                                </select>
                                {errors.devise && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.devise}
                                    </span>
                                )}
                            </div>

                            {/* Solde Initial */}
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
                                    Dépôt initial :
                                </label>
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
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        boxSizing: 'border-box',
                                        color: '#111827',
                                        backgroundColor: '#fff',
                                    }}
                                />
                                {errors.solde && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.solde}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#1e40af',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    cursor: processing
                                        ? 'not-allowed'
                                        : 'pointer',
                                }}
                            >
                                {processing
                                    ? 'Génération du compte...'
                                    : 'Créer le compte'}
                            </button>
                        </form>
                    </div>

                    {/* TABLEAU DES COMPTES BANCAIRES EXISTANTS */}
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
                            Registre des Comptes ({comptes?.length || 0})
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
                                        borderBottom: '2px solid #e5e7eb',
                                        color: '#4b5563',
                                        fontSize: '14px',
                                    }}
                                >
                                    <th style={{ padding: '12px 8px' }}>
                                        N° de Compte
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Client
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Type
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Solde Disponible
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comptes?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            style={{
                                                padding: '20px 8px',
                                                textAlign: 'center',
                                                color: '#9ca3af',
                                            }}
                                        >
                                            Aucun compte ouvert pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    comptes?.map((compte) => (
                                        <tr
                                            key={compte.id}
                                            style={{
                                                borderBottom:
                                                    '1px solid #f3f4f6',
                                                fontSize: '14px',
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    fontWeight: 'bold',
                                                    color: '#1e40af',
                                                }}
                                            >
                                                {compte.numero_compte}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#111827',
                                                }}
                                            >
                                                {compte.client
                                                    ? `${compte.client.nom} ${compte.client.prenom}`
                                                    : 'Inconnu'}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#4b5563',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                >
                                                    {compte.type_compte}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    fontWeight: '600',
                                                    color: '#16a34a',
                                                }}
                                            >
                                                {parseFloat(
                                                    compte.solde,
                                                ).toFixed(2)}{' '}
                                                {compte.devise}
                                            </td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <span
                                                    style={{
                                                        padding: '2px 8px',
                                                        borderRadius: '50px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        backgroundColor:
                                                            compte.actif
                                                                ? '#dcfce7'
                                                                : '#fee2e2',
                                                        color: compte.actif
                                                            ? '#166534'
                                                            : '#991b1b',
                                                    }}
                                                >
                                                    {compte.actif
                                                        ? 'Actif'
                                                        : 'Bloqué'}
                                                </span>
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
