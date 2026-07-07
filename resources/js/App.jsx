import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        // ⚠️ FIX CRITICAL: On vérifie si l'élément DOM existe avant de faire le createRoot
        if (el) {
            const root = createRoot(el);
            root.render(<App {...props} />);
        }
    },
    progress: {
        color: '#4B5563',
    },
});
