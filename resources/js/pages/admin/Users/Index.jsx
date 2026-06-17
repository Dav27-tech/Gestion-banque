import React from 'react';
import { usePage, useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const { users = [], roles = [] } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const submitUrl =
        typeof route !== 'undefined'
            ? route('admin.users.store')
            : '/admin/users';

    const handleSubmit = (e) => {
        e.preventDefault();
        post(submitUrl, {
            onSuccess: () => reset('name', 'email', 'password', 'role_id'),
        });
    };

    return (
        <AdminLayout>
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
                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                }}
                            >
                                Nom
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="input"
                            />
                            {errors.name && (
                                <div style={{ color: '#dc2626' }}>
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                }}
                            >
                                Email
                            </label>
                            <input
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="input"
                            />
                            {errors.email && (
                                <div style={{ color: '#dc2626' }}>
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                }}
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="input"
                            />
                            {errors.password && (
                                <div style={{ color: '#dc2626' }}>
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                }}
                            >
                                Rôle
                            </label>
                            <select
                                value={data.role_id}
                                onChange={(e) =>
                                    setData('role_id', e.target.value)
                                }
                                className="input"
                            >
                                <option value="">-- Choisir un rôle --</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.role_id && (
                                <div style={{ color: '#dc2626' }}>
                                    {errors.role_id}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                background: '#1e40af',
                                color: '#fff',
                                padding: '8px 12px',
                                borderRadius: '6px',
                            }}
                        >
                            Ajouter
                        </button>
                    </form>
                </div>

                <div
                    style={{
                        backgroundColor: '#fff',
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
                            {users.map((user) => (
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
        </AdminLayout>
    );
}
