import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import {
    Lock,
    ShieldCheck,
    ChevronLeft,
    LayoutDashboard,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
} from 'lucide-react';

export default function ChangePassword() {
    // Formulaire Inertia
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    // États UX locaux
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [focusField, setFocusField] = useState(null);
    const [hoverBtn, setHoverBtn] = useState(null);

    // Détermination de l'URL du tableau de bord (Inertia Global Route Check)
    const dashboardHref =
        typeof route !== 'undefined'
            ? route('client.dashboard')
            : '/client/dashboard';

    // Évaluation rapide de la force du mot de passe
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { label: '', color: 'transparent', width: '0%' };

        if (pwd.length < 6)
            return { label: 'Faible', color: '#EF4444', width: '33%' };

        if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
            return { label: 'Moyen', color: '#F59E0B', width: '66%' };

        return { label: 'Fort', color: '#10B981', width: '100%' };
    };

    const strength = getPasswordStrength(data.password);
    const isFormEmpty = !data.password || !data.password_confirmation;

    // Gestion de la soumission
    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (isFormEmpty || processing) return;
        setShowConfirmation(true);
    };

    const confirmSubmit = () => {
        setShowConfirmation(false);
        post('/client/change-password');
    };

    // Palette de couleurs & Styles CSS-in-JS
    const colors = {
        primary: '#9f2d2d',
        secondary: '#7A1C1C',
        textMain: '#1F2937',
        textMuted: '#6B7280',
        bgPage: '#F9FAFB',
        border: '#E5E7EB',
        glow: 'rgba(159, 45, 45, 0.15)',
    };

    const styles = {
        wrapper: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: colors.bgPage,
            minHeight: '100vh',
            padding: '40px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        container: {
            width: '100%',
            maxWidth: '480px',
        },
        backButton: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.textMuted,
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px',
            transition: 'all 0.2s ease',
            opacity: hoverBtn === 'back' ? 0.85 : 1,
            transform: hoverBtn === 'back' ? 'translateX(-2px)' : 'none',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.03)',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
        },
        headerGradient: {
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            padding: '32px 24px',
            textAlign: 'center',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
        },
        iconHeader: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
        },
        title: {
            margin: 0,
            fontSize: '22px',
            fontWeight: '700',
            letterSpacing: '-0.025em',
        },
        subtitle: {
            margin: 0,
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.5',
            maxWidth: '320px',
        },
        formBody: {
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: colors.textMain,
        },
        inputWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
        },
        inputIconLeft: {
            position: 'absolute',
            left: '14px',
            color: colors.textMuted,
            pointerEvents: 'none',
        },
        inputIconRight: {
            position: 'absolute',
            right: '14px',
            color: colors.textMuted,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
        },
        input: (fieldName) => ({
            width: '100%',
            padding: '14px 40px 14px 42px',
            fontSize: '15px',
            borderRadius: '10px',
            border: `1px solid ${focusField === fieldName ? colors.primary : colors.border}`,
            backgroundColor: '#FAFAFA',
            color: colors.textMain,
            outline: 'none',
            transition: 'all 0.2s ease-in-out',
            boxShadow:
                focusField === fieldName ? `0 0 0 4px ${colors.glow}` : 'none',
            boxSizing: 'border-box',
        }),
        strengthContainer: {
            marginTop: '4px',
        },
        strengthBarOuter: {
            height: '4px',
            width: '100%',
            backgroundColor: '#E5E7EB',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '6px',
        },
        strengthBarInner: {
            height: '100%',
            width: strength.width,
            backgroundColor: strength.color,
            transition: 'width 0.3s ease',
        },
        strengthText: {
            fontSize: '12px',
            fontWeight: '500',
            color: colors.textMuted,
            textAlign: 'right',
        },
        errorBlock: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#EF4444',
            fontSize: '13px',
            marginTop: '4px',
            fontWeight: '500',
        },
        submitBtn: {
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isFormEmpty || processing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity:
                isFormEmpty || processing
                    ? 0.6
                    : hoverBtn === 'submit'
                      ? 0.95
                      : 1,
            boxShadow:
                !isFormEmpty && hoverBtn === 'submit'
                    ? `0 4px 12px rgba(159, 45, 45, 0.25)`
                    : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out',
        },
        modalCard: {
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            maxWidth: '400px',
            width: '100%',
            padding: '28px 24px',
            boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
        },
        modalTitle: {
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: colors.textMain,
        },
        modalText: {
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: colors.textMuted,
            lineHeight: '1.5',
        },
        modalActions: {
            display: 'flex',
            gap: '12px',
        },
        modalCancelBtn: {
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backgroundColor: '#ffffff',
            color: colors.textMain,
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s',
        },
        modalConfirmBtn: {
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.primary,
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
        },
    };

    return (
        <div style={styles.wrapper}>
            <Head title="Change Password" />

            <div style={styles.container}>
                {/* Bouton Retour Dashboard */}
                <Link
                    href={dashboardHref}
                    style={styles.backButton}
                    onMouseEnter={() => setHoverBtn('back')}
                    onMouseLeave={() => setHoverBtn(null)}
                >
                    <ChevronLeft size={16} />
                    <LayoutDashboard size={16} />
                    Retour au tableau de bord
                </Link>

                {/* Formulaire principal sous forme de Carte Premium */}
                <div style={styles.card}>
                    <div style={styles.headerGradient}>
                        <div style={styles.iconHeader}>
                            <ShieldCheck size={32} strokeWidth={1.5} />
                        </div>
                        <h2 style={styles.title}>Sécurité du compte</h2>
                        <p style={styles.subtitle}>
                            Modifiez votre mot de passe en toute sécurité
                        </p>
                    </div>

                    <form onSubmit={handlePreSubmit} style={styles.formBody}>
                        {/* Champ : Nouveau mot de passe */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Nouveau mot de passe
                            </label>
                            <div style={styles.inputWrapper}>
                                <Lock size={18} style={styles.inputIconLeft} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    onFocus={() => setFocusField('password')}
                                    onBlur={() => setFocusField(null)}
                                    style={styles.input('password')}
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={styles.inputIconRight}
                                    tabIndex="-1"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {/* Indicateur de force du mot de passe */}
                            {data.password && (
                                <div style={styles.strengthContainer}>
                                    <div style={styles.strengthBarOuter}>
                                        <div
                                            style={styles.strengthBarInner}
                                        ></div>
                                    </div>
                                    <div style={styles.strengthText}>
                                        Sécurité : {strength.label}
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <div style={styles.errorBlock}>
                                    <AlertCircle size={14} />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Champ : Confirmation du mot de passe */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Confirmer le mot de passe
                            </label>
                            <div style={styles.inputWrapper}>
                                <Lock size={18} style={styles.inputIconLeft} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    onFocus={() =>
                                        setFocusField('password_confirmation')
                                    }
                                    onBlur={() => setFocusField(null)}
                                    style={styles.input(
                                        'password_confirmation',
                                    )}
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        {/* Bouton de Soumission */}
                        <button
                            type="submit"
                            disabled={isFormEmpty || processing}
                            style={styles.submitBtn}
                            onMouseEnter={() => setHoverBtn('submit')}
                            onMouseLeave={() => setHoverBtn(null)}
                        >
                            {processing ? (
                                <>
                                    <Loader2
                                        size={18}
                                        style={{
                                            animation:
                                                'spin 1s linear infinite',
                                        }}
                                    />
                                    Mise à jour en cours...
                                </>
                            ) : (
                                'Enregistrer les modifications'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal de Confirmation Bancaire */}
            {showConfirmation && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <h3 style={styles.modalTitle}>
                            Confirmer la modification ?
                        </h3>
                        <p style={styles.modalText}>
                            Êtes-vous sûr de vouloir modifier votre mot de passe
                            ? Cette action renforcera la sécurité de votre
                            compte.
                        </p>
                        <div style={styles.modalActions}>
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                style={styles.modalCancelBtn}
                                onMouseEnter={(e) =>
                                    (e.target.style.backgroundColor = '#F9FAFB')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.backgroundColor = '#ffffff')
                                }
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={confirmSubmit}
                                style={styles.modalConfirmBtn}
                                onMouseEnter={(e) =>
                                    (e.target.style.opacity = '0.9')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.opacity = '1')
                                }
                            >
                                Confirmer le changement
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Injection des animations CSS standard requises pour les micro-interactions */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
