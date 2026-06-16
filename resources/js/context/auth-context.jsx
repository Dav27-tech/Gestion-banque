/**
 * Contexte d'authentification
 */

import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children, auth }) => {
    const user = auth?.user;

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};
