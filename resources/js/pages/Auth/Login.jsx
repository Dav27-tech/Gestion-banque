import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import logo from '../../../images/equity-bank-logo.png';

// Icônes SVG pour l'interface
const UserIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5 text-gray-400"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
    </svg>
);

const LockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5 text-gray-400"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
    </svg>
);

const BoltIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
    </svg>
);

export default function Login({ intendedRole }) {
    const roleActuel = intendedRole || 'admin';
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role_attendu: roleActuel,
    });

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

    const firstErrorMessage =
        alertMessage || (Object.values(errors)[0] ?? null);

    // Couleur bordeaux principale de l'image
    const bordeauxColor = '#7A1C1C';

    return (
        <div className="flex min-h-screen w-full bg-gray-50 font-sans">
            <Head
                title={`Connexion sécurisée - Espace ${roleActuel.toUpperCase()}`}
            />

            {/* Section Gauche - Image d'arrière-plan avec overlay */}
            <div
                className="relative hidden flex-col justify-between bg-cover bg-center p-10 text-white md:flex md:w-[40%]"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(122, 28, 28, 0.92), rgba(65, 15, 15, 0.95)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop')`,
                }}
            >
                {/* Message de bienvenue */}
                <div className="my-auto max-w-sm space-y-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Bienvenue dans votre Espace
                        </h1>
                        <p className="text-sm leading-relaxed text-gray-200">
                            Connectez-vous pour accéder à votre espace de
                            gestion et suivre vos opérations en temps réel.
                        </p>
                    </div>

                    <div className="my-6 h-px w-full bg-white/20" />

                    {/* Badges de confiance */}
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-100">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheckIcon />
                            <span>Sécurisé</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <BoltIcon />
                            <span>Rapide</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheckIcon />
                            <span>Fiable</span>
                        </div>
                    </div>
                </div>

                {/* Footer Gauche */}
                <div className="text-xs text-gray-300">
                    &copy; {new Date().getFullYear()} Tous droits réservés.
                </div>
            </div>

            {/* Section Droite - Formulaire de connexion */}
            <div className="flex w-full items-center justify-center p-6 sm:p-12 md:w-[60%]">
                <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 shadow-xl sm:p-10">
                    {/* Conteneur Logo Formulaire */}
                    <div className="mb-6 flex flex-col items-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-20 w-auto object-contain"
                        />
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Portail {roleActuel}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Entrez vos identifiants pour continuer
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        {firstErrorMessage && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                                {firstErrorMessage}
                            </div>
                        )}

                        {/* Champ Email / Nom d'utilisateur */}
                        <div className="space-y-1.5">
                            <label
                                className="text-sm font-semibold text-gray-700"
                                htmlFor="email"
                            >
                                Identifiant professionnel
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3.5">
                                    <UserIcon />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    autoComplete="username"
                                    className={`w-full border bg-gray-50 py-3 pr-4 pl-11 ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:outline-none`}
                                    style={{
                                        '--tw-ring-color': bordeauxColor,
                                        borderColor: errors.email
                                            ? '#ef4444'
                                            : undefined,
                                        color: '#423b3b',
                                    }}
                                    placeholder="votre.nom@institution.com"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="space-y-1.5">
                            <label
                                className="text-sm font-semibold text-gray-700"
                                htmlFor="password"
                            >
                                Mot de passe
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3.5">
                                    <LockIcon />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    autoComplete="current-password"
                                    className={`w-full border bg-gray-50 py-3 pr-12 pl-11 ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:outline-none`}
                                    style={{
                                        '--tw-ring-color': bordeauxColor,
                                        borderColor: errors.password
                                            ? '#ef4444'
                                            : undefined,
                                        color: '#423b3b',
                                    }}
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Option Se souvenir de moi */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-red-800 focus:ring-red-700"
                                style={{ accentColor: bordeauxColor }}
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 cursor-pointer text-sm text-gray-600 select-none"
                            >
                                Se souvenir de moi
                            </label>
                        </div>

                        {/* Bouton de validation principal */}
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.99]"
                            disabled={processing}
                            style={{ backgroundColor: bordeauxColor }}
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="h-5 w-5 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span>Vérification...</span>
                                </>
                            ) : (
                                <span>Se connecter</span>
                            )}
                        </button>

                        {/* Séparateur horizontal optionnel conforme au design */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="mx-4 flex-shrink text-xs font-medium text-gray-400 uppercase">
                                Ou
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Bouton secondaire d'information */}
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-600 select-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4 text-emerald-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                                />
                            </svg>
                            <span>Connexion sécurisée de bout en bout</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
