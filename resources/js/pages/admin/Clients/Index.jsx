import React from 'react';
import { usePage, useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const { clients = [] } = usePage().props;

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
        post(url, { onSuccess: () => reset() });
    };

    return (
        <AdminLayout>
            <div
                style={{
                    padding: '30px',
                    backgroundColor: '#f9fafb',
                    minHeight: '100vh',
                    color: '#111827',
                    fontFamily: 'sans-serif',
                }}
            >
                <Head title="Gestion des Clients" />

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
                            Gestion des Clients
                        </h2>
                        <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                            Enregistrez les profils des clients de la banque
                            avant l'ouverture de leurs comptes.
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
                            Nouveau Client
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    marginBottom: '15px',
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            marginBottom: '5px',
                                            color: '#374151',
                                        }}
                                    >
                                        Nom :
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) =>
                                            setData('nom', e.target.value)
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
                                    {errors.nom && (
                                        <span
                                            style={{
                                                color: '#dc2626',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {errors.nom}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            marginBottom: '5px',
                                            color: '#374151',
                                        }}
                                    >
                                        Prénom :
                                    </label>
                                    <input
                                        type="text"
                                        value={data.prenom}
                                        onChange={(e) =>
                                            setData('prenom', e.target.value)
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
                                    {errors.prenom && (
                                        <span
                                            style={{
                                                color: '#dc2626',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {errors.prenom}
                                        </span>
                                    )}
                                </div>
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
                                    Téléphone :
                                </label>
                                <input
                                    type="text"
                                    value={data.telephone}
                                    onChange={(e) =>
                                        setData('telephone', e.target.value)
                                    }
                                    placeholder="+243..."
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
                                {errors.telephone && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.telephone}
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
                                    Email (Optionnel) :
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
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
                                {errors.email && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.email}
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
                                    Adresse Physique :
                                </label>
                                <input
                                    type="text"
                                    value={data.adresse}
                                    onChange={(e) =>
                                        setData('adresse', e.target.value)
                                    }
                                    placeholder="Numéro, Avenue, Quartier, Ville"
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
                                {errors.adresse && (
                                    <span
                                        style={{
                                            color: '#dc2626',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {errors.adresse}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#16a34a',
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
                                    ? 'Enregistrement...'
                                    : 'Enregistrer le client'}
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
                            Registre des Clients ({clients?.length || 0})
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
                                        Nom & Prénom
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Téléphone
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Email
                                    </th>
                                    <th style={{ padding: '12px 8px' }}>
                                        Adresse
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            style={{
                                                padding: '20px 8px',
                                                textAlign: 'center',
                                                color: '#9ca3af',
                                            }}
                                        >
                                            Aucun client enregistré pour le
                                            moment.
                                        </td>
                                    </tr>
                                ) : (
                                    clients?.map((client) => (
                                        <tr
                                            key={client.id}
                                            style={{
                                                borderBottom:
                                                    '1px solid #f3f4f6',
                                                fontSize: '14px',
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    fontWeight: '500',
                                                    color: '#111827',
                                                }}
                                            >
                                                {client.nom} {client.prenom}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#111827',
                                                }}
                                            >
                                                {client.telephone}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#4b5563',
                                                }}
                                            >
                                                {client.email || '-'}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '12px 8px',
                                                    color: '#6b7280',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                {client.adresse || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
