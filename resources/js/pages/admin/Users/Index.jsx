import React from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';

export default function Index() {
    // 1. Récupération des données envoyées par le UserController de Laravel
    const { users, roles } = usePage().props;

    // 2. Initialisation du formulaire avec le hook useForm d'Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => reset('name', 'email', 'password', 'role_id'), // Vide le formulaire après succès
        });
    };

    return (
        <div
            style={{
                padding: '30px',
                backgroundColor: '#f9fafb',
                minHeight: '100vh',
                color: '#111827',
                fontFamily: 'sans-serif',
            }}
        >
            <Head title="Gestion du Personnel" />

            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                    Gestion du Personnel
                </h2>
                <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                    Ajoutez et gérez les accès des agents de la banque
                    (Caissiers, Auditeurs, Gestionnaires).
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '30px',
                }}
            >
                {/* FORMULAIRE DE CRÉATION */}
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
                        Ajouter un Agent
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
                                Nom Complet :
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    boxSizing: 'border-box',
                                }}
                            />
                            {errors.name && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.name}
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
                                Adresse Email :
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
                                Mot de passe :
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    boxSizing: 'border-box',
                                }}
                            />
                            {errors.password && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.password}
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
                                Rôle de l'Agent :
                            </label>
                            <select
                                value={data.role_id}
                                onChange={(e) =>
                                    setData('role_id', e.target.value)
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#fff',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <option value="">Choisir un rôle...</option>
                                {roles?.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.nom.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.role_id && (
                                <span
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '13px',
                                    }}
                                >
                                    {errors.role_id}
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
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing
                                ? 'Enregistrement...'
                                : "Créer l'utilisateur"}
                        </button>
                    </form>
                </div>

                {/* TABLEAU DES UTILISATEURS EXISTANTS */}
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
                        Membres du Personnel
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
                                <th style={{ padding: '12px 8px' }}>Nom</th>
                                <th style={{ padding: '12px 8px' }}>Email</th>
                                <th style={{ padding: '12px 8px' }}>Rôle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: '1px solid #f3f4f6',
                                        fontSize: '14px',
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: '12px 8px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {user.name}
                                    </td>
                                    <td
                                        style={{
                                            padding: '12px 8px',
                                            color: '#4b5563',
                                        }}
                                    >
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <span
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '50px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor:
                                                    user.role?.nom === 'admin'
                                                        ? '#fee2e2'
                                                        : user.role?.nom ===
                                                            'caissier'
                                                          ? '#dcfce7'
                                                          : '#f3f4f6',
                                                color:
                                                    user.role?.nom === 'admin'
                                                        ? '#991b1b'
                                                        : user.role?.nom ===
                                                            'caissier'
                                                          ? '#166534'
                                                          : '#374151',
                                            }}
                                        >
                                            {user.role?.nom}
                                        </span>
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
