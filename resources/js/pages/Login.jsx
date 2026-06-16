import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });

            // Sauvegarde des données de session
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem('user_role', response.data.user.role);
            localStorage.setItem('user_name', response.data.user.name);

            // Redirection dynamique selon le rôle renvoyé par Laravel
            const role = response.data.user.role;
            if (role === 'admin') navigate('/admin/dashboard');
            else if (role === 'caissier') navigate('/caissier/dashboard');
            else if (role === 'gestionnaire')
                navigate('/gestionnaire/dashboard');
            else if (role === 'auditeur') navigate('/auditeur/dashboard');
            else navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                setError(
                    err.response.data.message || 'Une erreur est survenue.',
                );
            } else {
                setError('Impossible de joindre le serveur.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: '400px',
                margin: '50px auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
            }}
        >
            <h2>Connexion - Système Bancaire</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Adresse Email :
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Mot de passe :
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}
