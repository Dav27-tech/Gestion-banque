import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Icône Verrou SVG professionnelle
const LockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
    </svg>
);

export default function Login({ intendedRole }) {
    const roleActuel = intendedRole || 'admin';
    // État pour gérer la visibilité du mot de passe
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role_attendu: roleActuel,
    });

    // message d'alerte contrôlé côté client (rempli par onError de useForm.post)
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const url =
            typeof window !== 'undefined' && window.route
                ? window.route('login.attempt')
                : '/login';

        post(url, {
            onError: (errs) => {
                const first = Object.values(errs)[0] ?? null;
                setAlertMessage(Array.isArray(first) ? first[0] : first);
            },
            onSuccess: () => setAlertMessage(null),
        });
    };

    // Afficher une alerte simple quand il y a une erreur d'authentification
    const firstErrorMessage =
        alertMessage || (Object.values(errors)[0] ?? null);

    // Couleurs de thèmes mises à jour pour un look plus Fintech/Moderne
    const thèmes = {
        admin: '#1e3a8a', // Bleu Nuit Royal
        gestionnaire: '#0f766e', // Sarcelle Foncé
        caissier: '#2563eb', // Bleu Lumineux
        auditeur: '#4f46e5', // Indigo
    };

    const couleurActive = thèmes[roleActuel];

    return (
        <div className="bank-login-container">
            <Head
                title={`Connexion sécurisée - Espace ${roleActuel.toUpperCase()}`}
            />

            <div className="bank-login-card">
                <div className="bank-login-header">
                    <div className="bank-security-icon">
                        <LockIcon />
                    </div>
                    <h2 className="bank-login-title">Système Bancaire</h2>
                    <span
                        className="bank-role-badge"
                        style={{
                            backgroundColor: couleurActive + '15', // Fond très clair de la couleur du thème
                            color: couleurActive,
                        }}
                    >
                        PORTAIL {roleActuel.toUpperCase()}
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    {firstErrorMessage && (
                        <div
                            className="bank-alert"
                            role="alert"
                            style={{
                                backgroundColor: '#fff1f2',
                                color: '#991b1b',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #fecaca',
                                marginBottom: '12px',
                                fontWeight: 600,
                            }}
                        >
                            {firstErrorMessage}
                        </div>
                    )}
                    {/* Champ Adresse Email */}
                    <div className="bank-form-group">
                        <label className="bank-label" htmlFor="email">
                            Email :
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            className={`bank-input ${errors.email ? 'error' : ''}`}
                            placeholder="votre.nom@banque.com"
                            style={{ '--focus-color': couleurActive }} // Variable CSS pour le focus
                            required
                            autoFocus
                        />
                        {errors.email && (
                            <p className="bank-error-text">{errors.email}</p>
                        )}
                    </div>

                    {/* Champ Mot de passe avec option de visibilité */}
                    <div className="bank-form-group">
                        <label className="bank-label" htmlFor="password">
                            Mot de passe :
                        </label>

                        <div className="bank-input-container">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'} // Type dynamique
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                autoComplete="current-password"
                                className={`bank-input bank-input-with-icon ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••••••"
                                style={{ '--focus-color': couleurActive }}
                                required
                            />

                            {/* Bouton de l'œil */}
                            <button
                                type="button" // TRÈS IMPORTANT: Évite de soumettre le formulaire par erreur au clic
                                className="bank-toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? 'Cacher le mot de passe'
                                        : 'Afficher le mot de passe'
                                }
                            >
                                {showPassword ? (
                                    /* Icône Œil Barré (Masquer) */
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="bank-password-svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                ) : (
                                    /* Icône Œil Ouvert (Afficher) */
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="bank-password-svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="bank-error-text">
                                Identifiants incorrects ou accès non autorisé.
                            </p>
                        )}
                    </div>

                    {/* Option Se souvenir de moi */}
                    <div className="bank-remember-group">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="bank-checkbox"
                            style={{ accentColor: couleurActive }} // Change la couleur de la coche dynamiquement
                        />
                        <label
                            htmlFor="remember"
                            className="bank-remember-label"
                        >
                            Mémoriser l'identifiant sur cet appareil
                        </label>
                    </div>

                    {/* Bouton de validation */}
                    <button
                        type="submit"
                        className="bank-submit-button"
                        disabled={processing}
                        style={{
                            backgroundColor: couleurActive,
                            boxShadow: `0 4px 12px ${couleurActive}30`, // Ombre portée de la couleur du bouton
                        }}
                    >
                        {processing ? (
                            <>
                                <span className="bank-spinner"></span>
                                Authentification en cours...
                            </>
                        ) : (
                            `Accéder à l'Espace ${roleActuel.charAt(0).toUpperCase() + roleActuel.slice(1)}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
