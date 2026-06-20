import React, { useState, useMemo } from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
    Users,
    Shield,
    UserCheck,
    UserX,
    UserPlus,
    Search,
    Filter,
    Edit2,
    Eye,
    EyeOff,
    X,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Clock,
} from 'lucide-react';

export default function Index() {
    const { users = [], roles = [] } = usePage().props;

    // --- FORMULAIRE 1 : CRÉATION D'UN AGENT ---
    const {
        data: createData,
        setData: setCreateData,
        post: postCreate,
        processing: processingCreate,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    // --- FORMULAIRE 2 : ÉDITION D'UN AGENT (SLIDE-OVER / MODAL) ---
    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: processingEdit,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        id: '',
        name: '',
        email: '',
        role_id: '',
        password: '', // Optionnel : pour réinitialisation
        status: 'active',
    });

    // --- ÉTATS LOCAUX (UX, FILTRES, MODALS) ---
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showPassword, setShowPassword] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Gère l'ouverture du volet d'édition
    const [notification, setNotification] = useState(null);

    // --- CALCUL DES STATISTIQUES EN TEMPS RÉEL ---
    const stats = useMemo(() => {
        return {
            total: users.length,
            active: users.filter((u) => (u.status ?? 'active') === 'active')
                .length,
            suspended: users.filter((u) => u.status === 'suspended').length,
            admin: users.filter((u) => u.role?.nom?.toLowerCase() === 'admin')
                .length,
            manager: users.filter(
                (u) => u.role?.nom?.toLowerCase() === 'manager',
            ).length,
            cashier: users.filter(
                (u) =>
                    u.role?.nom?.toLowerCase() === 'caissier' ||
                    u.role?.nom?.toLowerCase() === 'cashier',
            ).length,
            auditor: users.filter(
                (u) =>
                    u.role?.nom?.toLowerCase() === 'auditeur' ||
                    u.role?.nom?.toLowerCase() === 'auditor',
            ).length,
        };
    }, [users]);

    // --- INDICATEUR DE FORCE DU MOT DE PASSE ---
    const passwordStrength = useMemo(() => {
        const pass = createData.password;
        if (!pass) return { score: 0, label: 'Vide', color: '#e5e7eb' };
        if (pass.length < 6)
            return { score: 1, label: 'Faible', color: '#dc2626' };
        if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8) {
            return { score: 3, label: 'Fort / Sécurisé', color: '#16a34a' };
        }
        return { score: 2, label: 'Moyen', color: '#f59e0b' };
    }, [createData.password]);

    // --- FILTRAGE DYNAMIQUE CÔTÉ CLIENT ---
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole =
                roleFilter === 'all' ||
                String(u.role_id) === String(roleFilter);
            const currentStatus = u.status ?? 'active';
            const matchesStatus =
                statusFilter === 'all' || currentStatus === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    // --- ACTIONS : SOUMISSION CRÉATION ---
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const url =
            typeof route !== 'undefined'
                ? route('admin.users.store')
                : '/admin/users';
        postCreate(url, {
            onSuccess: () => {
                resetCreate();
                triggerNotification('Agent ajouté avec succès au système.');
            },
        });
    };

    // --- ACTIONS : SOUMISSION MODIFICATION ---
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const url =
            typeof route !== 'undefined'
                ? route('admin.users.update', editData.id)
                : `/admin/users/${editData.id}`;
        putEdit(url, {
            onSuccess: () => {
                setEditingUser(null);
                triggerNotification(
                    "Profil de l'agent mis à jour de manière sécurisée.",
                );
            },
        });
    };

    // --- ACTIONS : TOGGLE STATUT (SUSPEND / ACTIVATE) ---
    const handleToggleStatus = (user) => {
        const nextStatus =
            (user.status ?? 'active') === 'active' ? 'suspended' : 'active';
        const url =
            typeof route !== 'undefined'
                ? route('admin.users.update', user.id)
                : `/admin/users/${user.id}`;

        // Utilisation de la méthode PUT d'Inertia vers la même route de mise à jour
        Inertia.put(
            url,
            {
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                status: nextStatus,
            },
            {
                onSuccess: () =>
                    triggerNotification(
                        `Statut de l'agent modifié : ${nextStatus === 'active' ? 'Activé' : 'Suspendu'}`,
                    ),
            },
        );
    };

    const triggerNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    const openEditPanel = (user) => {
        setEditingUser(user);
        setEditData({
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            status: user.status ?? 'active',
            password: '', // Reste vide sauf si on change le mot de passe
        });
    };

    // --- STYLE DICTIONARY (THEME #1e3a8a) ---
    const styles = {
        container: {
            padding: '24px',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            transition: 'all 0.2s',
        },
        badge: (type, val) => {
            let bg = '#f3f4f6';
            let color = '#374151';
            const cleanVal = String(val).toLowerCase();
            if (type === 'role') {
                if (cleanVal === 'admin') {
                    bg = '#dbeafe';
                    color = '#1e40af';
                } else if (cleanVal === 'manager') {
                    bg = '#ccfbf1';
                    color = '#115e59';
                } else if (cleanVal === 'caissier' || cleanVal === 'cashier') {
                    bg = '#dcfce7';
                    color = '#166534';
                } else if (cleanVal === 'auditeur' || cleanVal === 'auditor') {
                    bg = '#f3e8ff';
                    color = '#6b21a8';
                }
            } else if (type === 'status') {
                if (cleanVal === 'active') {
                    bg = '#dcfce7';
                    color = '#166534';
                } else {
                    bg = '#fee2e2';
                    color = '#991b1b';
                }
            }
            return {
                padding: '4px 10px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                display: 'inline-block',
                backgroundColor: bg,
                color,
            };
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            color: '#464748',
        },
        btnPrimary: {
            background: '#1e3a8a',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
        },
        slideOver: {
            position: 'fixed',
            top: 0,
            right: 0,
            width: '420px',
            height: '100vh',
            backgroundColor: '#ffffff',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            zIndex: 100,
            padding: '28px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            transform: editingUser ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
    };

    return (
        <AdminLayout>
            <Head title="Contrôle d'Accès Système" />

            {/* INJECTION CSS POUR LES HOVERS ET FOCUS EFFECT */}
            <style>{`
                .input-field:focus { border-color: #1e3a8a !important; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15) !important; }
                .tr-hover:hover { background-color: #f8fafc !important; }
                .action-btn:hover { background-color: #f1f5f9 !important; border-radius: 6px; }
            `}</style>

            {/* NOTIFICATION FLUIDE */}
            {notification && (
                <div
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '10px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        animation: 'fadeIn 0.2s',
                    }}
                >
                    <CheckCircle size={18} style={{ color: '#10b981' }} />{' '}
                    {notification}
                </div>
            )}

            {/* EN-TÊTE DE LA PAGE */}
            <div
                style={{
                    marginBottom: '28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            color: '#0f172a',
                            margin: 0,
                            letterSpacing: '-0.025em',
                        }}
                    >
                        Gestion du Personnel
                    </h2>
                    <p
                        style={{
                            color: '#6b7280',
                            margin: '4px 0 0 0',
                            fontSize: '14px',
                        }}
                    >
                        Contrôlez les autorisations d'accès, suivez le statut et
                        provisionnez les profils applicatifs de la banque.
                    </p>
                </div>
            </div>

            {/* BLOC DES CARTES DE STATISTIQUES */}
            <div style={styles.stylesGrid || styles.statsGrid}>
                {[
                    {
                        label: 'Total Agents',
                        val: stats.total,
                        icon: <Users size={20} />,
                        col: '#1e3a8a',
                        bg: '#eff6ff',
                    },
                    {
                        label: 'Accès Actifs',
                        val: stats.active,
                        icon: <UserCheck size={20} />,
                        col: '#16a34a',
                        bg: '#dcfce7',
                    },
                    {
                        label: 'Suspendus',
                        val: stats.suspended,
                        icon: <UserX size={20} />,
                        col: '#dc2626',
                        bg: '#fee2e2',
                    },
                    {
                        label: 'Guichet (Cpt)',
                        val: stats.cashier,
                        icon: <Shield size={18} />,
                        col: '#0d9488',
                        bg: '#ccfbf1',
                    },
                    {
                        label: 'Auditeurs',
                        val: stats.auditor,
                        icon: <Clock size={18} />,
                        col: '#7c3aed',
                        bg: '#f3e8ff',
                    },
                ].map((s, i) => (
                    <div key={i} style={styles.card}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {s.label}
                            </span>
                            <div
                                style={{
                                    padding: '6px',
                                    borderRadius: '8px',
                                    backgroundColor: s.bg,
                                    color: s.col,
                                }}
                            >
                                {s.icon}
                            </div>
                        </div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '22px',
                                fontWeight: '800',
                                color: '#111827',
                            }}
                        >
                            {s.val}
                        </h3>
                    </div>
                ))}
            </div>

            {/* ARCHITECTURE PRINCIPALE : FORMULAIRE À GAUCHE | TABLEAU À DROITE */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    alignItems: 'start',
                }}
            >
                {/* FORMULAIRE DE CRÉATION MODERNISÉ */}
                <div style={styles.card}>
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
                        <UserPlus size={18} style={{ color: '#1e3a8a' }} />
                        <h3
                            style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#0f172a',
                                margin: 0,
                            }}
                        >
                            Provisionner un nouvel Agent
                        </h3>
                    </div>

                    <form
                        onSubmit={handleCreateSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#4b5563',
                                }}
                            >
                                Nom Complet
                            </label>
                            <input
                                value={createData.name}
                                onChange={(e) =>
                                    setCreateData('name', e.target.value)
                                }
                                style={styles.input}
                                className="input-field"
                                placeholder="Ex: Jean Dupont"
                                required
                            />
                            {createErrors.name && (
                                <div
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                    }}
                                >
                                    {createErrors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#4b5563',
                                }}
                            >
                                Adresse Email Institutionnelle
                            </label>
                            <input
                                type="email"
                                value={createData.email}
                                onChange={(e) =>
                                    setCreateData('email', e.target.value)
                                }
                                style={styles.input}
                                className="input-field"
                                placeholder="david@banque.cd"
                                required
                            />
                            {createErrors.email && (
                                <div
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                    }}
                                >
                                    {createErrors.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#4b5563',
                                }}
                            >
                                Mot de passe initial
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={createData.password}
                                    onChange={(e) =>
                                        setCreateData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    style={styles.input}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                    }}
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {createData.password && (
                                <div
                                    style={{
                                        marginTop: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '4px',
                                            flex: 1,
                                            backgroundColor: '#e5e7eb',
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${(passwordStrength.score / 3) * 100}%`,
                                                backgroundColor:
                                                    passwordStrength.color,
                                                transition: 'width 0.3s',
                                            }}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: passwordStrength.color,
                                        }}
                                    >
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                            {createErrors.password && (
                                <div
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                    }}
                                >
                                    {createErrors.password}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#4b5563',
                                }}
                            >
                                Rôle Métier & Droits
                            </label>
                            <select
                                value={createData.role_id}
                                onChange={(e) =>
                                    setCreateData('role_id', e.target.value)
                                }
                                style={styles.input}
                                className="input-field"
                                required
                            >
                                <option value="">Sélectionner un profil</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nom}
                                    </option>
                                ))}
                            </select>
                            {createErrors.role_id && (
                                <div
                                    style={{
                                        color: '#dc2626',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                    }}
                                >
                                    {createErrors.role_id}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processingCreate}
                            style={{
                                ...styles.btnPrimary,
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {processingCreate ? (
                                'Création...'
                            ) : (
                                <>
                                    {' '}
                                    <UserPlus size={16} /> Enregistrer
                                    l'Agent{' '}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ZONE TABLEAU : RECHERCHE, FILTRES ET ENREGISTREMENTS */}
                <div
                    style={{
                        ...styles.card,
                        gridColumn: 'span 2',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    {/* FILTRES RAPIDES ET BARRE DE RECHERCHE DYNAMIQUE */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #f1f5f9',
                            paddingBottom: '16px',
                        }}
                    >
                        <div
                            style={{ position: 'relative', flex: '1 1 240px' }}
                        >
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou adresse email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ ...styles.input, paddingLeft: '36px' }}
                                className="input-field"
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <Filter
                                    size={14}
                                    style={{ color: '#6b7280' }}
                                />
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    style={{
                                        ...styles.input,
                                        padding: '6px 10px',
                                        width: 'auto',
                                    }}
                                >
                                    <option value="all">Tous les rôles</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                style={{
                                    ...styles.input,
                                    padding: '6px 10px',
                                    width: 'auto',
                                }}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="suspended">Suspendu</option>
                            </select>
                        </div>
                    </div>

                    {/* RENDU DU TABLEAU REFAIT À NEUF */}
                    {filteredUsers.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: '#6b7280',
                            }}
                        >
                            <Users
                                size={32}
                                style={{
                                    color: '#cbd5e1',
                                    marginBottom: '8px',
                                }}
                            />
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                Aucun agent ne correspond à vos critères de
                                recherche.
                            </p>
                        </div>
                    ) : (
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
                                            color: '#475569',
                                            fontSize: '12px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        <th style={{ padding: '12px 10px' }}>
                                            Agent
                                        </th>
                                        <th style={{ padding: '12px 10px' }}>
                                            Rôle Métier
                                        </th>
                                        <th style={{ padding: '12px 10px' }}>
                                            Statut Accès
                                        </th>
                                        <th style={{ padding: '12px 10px' }}>
                                            Date d'entrée
                                        </th>
                                        <th
                                            style={{
                                                padding: '12px 10px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="tr-hover"
                                            style={{
                                                borderBottom:
                                                    '1px solid #f1f5f9',
                                                fontSize: '14px',
                                                transition:
                                                    'background-color 0.15s',
                                            }}
                                        >
                                            <td
                                                style={{ padding: '14px 10px' }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: '600',
                                                        color: '#111827',
                                                    }}
                                                >
                                                    {user.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                        marginTop: '2px',
                                                    }}
                                                >
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td
                                                style={{ padding: '14px 10px' }}
                                            >
                                                <span
                                                    style={styles.badge(
                                                        'role',
                                                        user.role?.nom,
                                                    )}
                                                >
                                                    {user.role?.nom ||
                                                        'Sans profil'}
                                                </span>
                                            </td>
                                            <td
                                                style={{ padding: '14px 10px' }}
                                            >
                                                <span
                                                    style={styles.badge(
                                                        'status',
                                                        user.status || 'active',
                                                    )}
                                                >
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '14px 10px',
                                                    color: '#6b7280',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                {user.created_at
                                                    ? new Date(
                                                          user.created_at,
                                                      ).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '14px 10px',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'inline-flex',
                                                        gap: '4px',
                                                    }}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            openEditPanel(user)
                                                        }
                                                        title="Modifier le profil"
                                                        className="action-btn"
                                                        style={{
                                                            border: 'none',
                                                            background: 'none',
                                                            padding: '6px',
                                                            cursor: 'pointer',
                                                            color: '#4b5563',
                                                        }}
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                user,
                                                            )
                                                        }
                                                        title={
                                                            (user.status ??
                                                                'active') ===
                                                            'active'
                                                                ? "Suspendre l'accès"
                                                                : "Réactiver l'accès"
                                                        }
                                                        className="action-btn"
                                                        style={{
                                                            border: 'none',
                                                            background: 'none',
                                                            padding: '6px',
                                                            cursor: 'pointer',
                                                            color:
                                                                (user.status ??
                                                                    'active') ===
                                                                'active'
                                                                    ? '#dc2626'
                                                                    : '#16a34a',
                                                        }}
                                                    >
                                                        {(user.status ??
                                                            'active') ===
                                                        'active' ? (
                                                            <UserX size={16} />
                                                        ) : (
                                                            <UserCheck
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PANNEAU COULISSANT DE MODIFICATION SECURE (SLIDE-OVER PANELS) --- */}
            {editingUser && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(15, 23, 42, 0.3)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 99,
                    }}
                    onClick={() => setEditingUser(null)}
                />
            )}

            <div style={styles.slideOver}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '16px',
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#0f172a',
                        }}
                    >
                        Habilitations de l'Agent
                    </h3>
                    <button
                        onClick={() => setEditingUser(null)}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleEditSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        flex: 1,
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Nom Complet
                        </label>
                        <input
                            value={editData.name}
                            onChange={(e) =>
                                setEditData('name', e.target.value)
                            }
                            style={styles.input}
                            className="input-field"
                            required
                        />
                        {editErrors.name && (
                            <div style={{ color: '#dc2626', fontSize: '12px' }}>
                                {editErrors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Adresse Email
                        </label>
                        <input
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                                setEditData('email', e.target.value)
                            }
                            style={styles.input}
                            className="input-field"
                            required
                        />
                        {editErrors.email && (
                            <div style={{ color: '#dc2626', fontSize: '12px' }}>
                                {editErrors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Rôle Applicatif
                        </label>
                        <select
                            value={editData.role_id}
                            onChange={(e) =>
                                setEditData('role_id', e.target.value)
                            }
                            style={styles.input}
                            className="input-field"
                            required
                        >
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.nom}
                                </option>
                            ))}
                        </select>
                        {editErrors.role_id && (
                            <div style={{ color: '#dc2626', fontSize: '12px' }}>
                                {editErrors.role_id}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                            }}
                        >
                            Statut de Connexion
                        </label>
                        <select
                            value={editData.status}
                            onChange={(e) =>
                                setEditData('status', e.target.value)
                            }
                            style={styles.input}
                            className="input-field"
                        >
                            <option value="active">
                                🟢 Actif - Autorisé à se connecter
                            </option>
                            <option value="suspended">
                                🔴 Suspendu - Accès révoqué
                            </option>
                        </select>
                    </div>

                    <div
                        style={{
                            borderTop: '1px dashed #e2e8f0',
                            paddingTop: '14px',
                            marginTop: '10px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '8px',
                                color: '#f59e0b',
                            }}
                        >
                            <AlertTriangle size={14} />
                            <label
                                style={{
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: '#374151',
                                }}
                            >
                                Réinitialiser le mot de passe
                            </label>
                        </div>
                        <input
                            type="password"
                            placeholder="Saisir un nouveau mot de passe si changement"
                            value={editData.password}
                            onChange={(e) =>
                                setEditData('password', e.target.value)
                            }
                            style={styles.input}
                            className="input-field"
                        />
                        <p
                            style={{
                                margin: '4px 0 0 0',
                                fontSize: '11px',
                                color: '#6b7280',
                            }}
                        >
                            Laissez vide pour conserver le mot de passe actuel.
                        </p>
                        {editErrors.password && (
                            <div style={{ color: '#dc2626', fontSize: '12px' }}>
                                {editErrors.password}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            marginTop: 'auto',
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            style={{
                                ...styles.input,
                                width: 'auto',
                                flex: 1,
                                cursor: 'pointer',
                                textAlign: 'center',
                                backgroundColor: '#f1f5f9',
                                border: 'none',
                                fontWeight: '600',
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processingEdit}
                            style={{
                                ...styles.btnPrimary,
                                flex: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            <RefreshCw size={14} />{' '}
                            {processingEdit ? 'Mise à jour...' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
