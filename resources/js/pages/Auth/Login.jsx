import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
// 💡 On importe explicitement le helper route pour éviter le "ReferenceError"
import { route } from '../../../../vendor/tightenco/ziggy';

export default function Login({ intendedRole }) {
    const roleActuel = intendedRole || 'admin';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role_attendu: roleActuel, 
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Maintenant "route" est bien défini !
        post(route('login')); 
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <Head title={`Connexion - Espace ${roleActuel.toUpperCase()}`} />

            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                
                {/* Entête dynamique du formulaire */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', margin: '0 0 5px 0' }}>Système Bancaire</h2>
                    <span style={{ 
                        display: 'inline-block', 
                        padding: '5px 14px', 
                        borderRadius: '50px', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        backgroundColor: thèmes[roleActuel] + '20', 
                        color: thèmes[roleActuel] 
                    }}>
                        PORTAIL {roleActuel.toUpperCase()}
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* Champ Adresse Email */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                            Adresse Email :
                        </label>
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)}
                            autoComplete="username"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db', 
                                boxSizing: 'border-box',
                                outlineColor: thèmes[roleActuel]
                            }}
                            required 
                        />
                        {errors.email && (
                            <p style={{ color: '#dc2626', fontSize: '13px', margin: '5px 0 0 0' }}>{errors.email}</p>
                        )}
                    </div>

                    {/* Champ Mot de passe */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                            Mot de passe :
                        </label>
                        <input 
                            type="password" 
                            value={data.password} 
                            onChange={e => setData('password', e.target.value)}
                            autoComplete="current-password"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                border: errors.password ? '1px solid #dc2626' : '1px solid #d1d5db', 
                                boxSizing: 'border-box',
                                outlineColor: thèmes[roleActuel]
                            }}
                            required 
                        />
                        {errors.password && (
                            <p style={{ color: '#dc2626', fontSize: '13px', margin: '5px 0 0 0' }}>{errors.password}</p>
                        )}
                    </div>

                    {/* Option Se souvenir de moi */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <input 
                            type="checkbox" 
                            id="remember"
                            checked={data.remember} 
                            onChange={e => setData('remember', e.target.checked)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <label htmlFor="remember" style={{ fontSize: '14px', color: '#4b5563', cursor: 'pointer', userSelect: 'none' }}>
                            Rester connecté sur ce poste
                        </label>
                    </div>

                    {/* Bouton de validation */}
                    <button 
                        type="submit" 
                        disabled={processing}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: thèmes[roleActuel], 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            fontWeight: '600', 
                            fontSize: '15px',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: `0 2px 4px ${thèmes[roleActuel]}30`,
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        {processing ? 'Vérification des droits...' : `S'authentifier comme ${roleActuel}`}
                    </button>
                </form>
            </div>
        </div>
    );
}