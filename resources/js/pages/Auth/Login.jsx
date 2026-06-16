import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    // Le hook useForm d'Inertia gère les états, les erreurs et la soumission automatiquement
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envoie directement les données à la route POST /login de Laravel
        post('/login');
    };

    return (
        <div
            style={{
                maxWidth: '400px',
                margin: '100px auto',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
            }}
        >
            <Head title="Connexion" />
            <h2>Connexion - Système Bancaire</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Adresse Email :
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.email && (
                        <span style={{ color: 'red', fontSize: '14px' }}>
                            {errors.email}
                        </span>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Mot de passe :
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.password && (
                        <span style={{ color: 'red', fontSize: '14px' }}>
                            {errors.password}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    style={{
                        width: '100%',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                >
                    {processing ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}
