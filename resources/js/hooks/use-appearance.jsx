import { useSyncExternalStore } from 'react';

/**
 * @typedef {'light' | 'dark'} ResolvedAppearance
 * @typedef {'light' | 'dark' | 'system'} Appearance
 * @typedef {{
 *   appearance: Appearance,
 *   resolvedAppearance: ResolvedAppearance,
 *   updateAppearance: (mode: Appearance) => void
 * }} UseAppearanceReturn
 */

const listeners = new Set();
let currentAppearance = 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name, value, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = () => {
    if (typeof window === 'undefined') {
        return 'system';
    }
    return localStorage.getItem('appearance') || 'system';
};

const isDarkMode = (appearance) => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance) => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);
    const root = document.documentElement;

    if (isDark) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    setCookie('appearance', appearance);
};

const emit = () => {
    listeners.forEach((listener) => listener());
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = () => {
    if (typeof window === 'undefined') {
        return;
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);

    // Listen for system theme changes
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
            if (currentAppearance === 'system') {
                applyTheme('system');
                emit();
            }
        });
};

/**
 * Hook to manage appearance/theme
 * @returns {UseAppearanceReturn}
 */
export const useAppearance = () => {
    const appearance = useSyncExternalStore(
        (onStoreChange) => {
            listeners.add(onStoreChange);
            return () => listeners.delete(onStoreChange);
        },
        () => currentAppearance,
    );

    const resolvedAppearance = isDarkMode(appearance) ? 'dark' : 'light';

    const updateAppearance = (newAppearance) => {
        currentAppearance = newAppearance;
        applyTheme(newAppearance);
        emit();
    };

    return {
        appearance,
        resolvedAppearance,
        updateAppearance,
    };
};
