# Structure React JSX - Guide

Cette application utilise une structure React JSX complète avec Inertia.js pour le rendu côté serveur.

## 📁 Organisation des dossiers

### `components/`

Composants réutilisables de l'application.

```
components/
├── ui/                    # Composants Radix UI stylisés
│   ├── button.jsx
│   ├── input.jsx
│   ├── dialog.jsx
│   └── ...
├── Navbar.jsx            # Barre de navigation
├── Sidebar.jsx           # Barre latérale
└── [autres composants]
```

**Conventions:**

- Noms en PascalCase pour les composants
- Un fichier = un composant
- Sous-dossier pour les variantes (ex: `ui/`)

### `pages/`

Pages principales avec structure par rôle.

```
pages/
├── Login.jsx             # Page de connexion
├── admin/               # Pages admin
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   └── ...
├── manager/             # Pages manager
│   ├── Clients.jsx
│   ├── Accounts.jsx
│   └── ...
├── cashier/             # Pages cashier
│   ├── Transactions.jsx
│   └── ...
└── auditor/             # Pages auditor
    ├── Reports.jsx
    └── ...
```

### `layouts/`

Layouts réutilisables.

```
layouts/
├── app-layout.jsx       # Layout principal
├── auth-layout.jsx      # Layout authentification
└── settings/
    └── layout.jsx       # Layout paramètres
```

### `hooks/`

Hooks React personnalisés.

```
hooks/
├── use-appearance.jsx   # Gestion du thème
├── use-form.jsx         # Gestion des formulaires
├── use-request.jsx      # Gestion des requêtes
└── index.js            # Ré-exports
```

### `context/`

Contextes React pour l'état global.

```
context/
├── auth-context.jsx     # Contexte d'authentification
└── [...autres contextes]
```

### `lib/`

Utilitaires et helpers.

```
lib/
├── api-client.js        # Client HTTP (fetch)
├── formatters.js        # Formatage (devise, date, etc.)
├── validators.js        # Validation (email, IBAN, etc.)
└── index.js            # Ré-exports
```

### `actions/`

Actions serveur Inertia / Redux-like actions.

```
actions/
├── App/                 # Actions d'application
├── Illuminate/         # Actions Laravel
├── Inertia/           # Actions Inertia
└── Laravel/           # Actions Laravel spécifiques
```

### `types/`

Définitions de types JSDoc.

```
types/
├── auth.js            # Types d'authentification
├── navigation.js      # Types de navigation
├── ui.js             # Types d'interface
├── models.js         # Modèles de données
└── index.js          # Ré-exports
```

### `routes/`

Configuration des routes.

```
routes/
├── [...routes configuration]
```

### `wayfinder/`

Composants UI générés automatiquement.

```
wayfinder/
├── [...composants générés]
```

## 🚀 Conventions de code

### Composants

```jsx
/**
 * Composant Button réutilisable
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'primary' | 'secondary' | 'danger',
 *   size?: 'sm' | 'md' | 'lg',
 *   disabled?: boolean,
 *   onClick?: (e: React.MouseEvent) => void
 * }} props
 * @returns {React.ReactNode}
 */
export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    return (
        <button className={`btn btn-${variant} btn-${size}`} {...props}>
            {children}
        </button>
    );
};
```

### Hooks

```jsx
/**
 * Hook personnalisé pour gérer les formulaires
 * @param {Object} initialValues
 * @returns {{
 *   values: Object,
 *   errors: Object,
 *   touched: Object,
 *   handleChange: Function,
 *   handleBlur: Function,
 *   resetForm: Function
 * }}
 */
export const useForm = (initialValues) => {
    // ...
};
```

### Pages

```jsx
import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

/**
 * Page Dashboard
 * @param {{
 *   clients: Array<Client>,
 *   accounts: Array<Compte>,
 *   transactions: Array<Transaction>
 * }} props
 */
export default function Dashboard({ clients, accounts, transactions }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-4">{/* Contenu */}</div>
        </>
    );
}
```

## 📦 Imports recommandés

```jsx
// Depuis lib/
import { formatCurrency, formatDate, isValidEmail, apiClient } from '@/lib';

// Depuis hooks/
import { useForm, useRequest, useAppearance } from '@/hooks';

// Depuis context/
import { useAuth } from '@/context/auth-context';

// Depuis components/
import { Button, Input, Dialog } from '@/components';

// Depuis types/
import * as Types from '@/types';
```

## 🎨 Tailwind CSS

L'application utilise Tailwind CSS v4 avec:

- Thème personnalisé (light/dark)
- Plugins Radix UI
- Prettier plugin pour l'ordre des classes

## 🔗 Inertia.js

La communication serveur-client se fait via Inertia.js:

```jsx
import { router } from '@inertiajs/react';

// Navigation
router.visit('/dashboard');

// POST/PUT/DELETE
router.post('/clients', data);
router.put(`/clients/${id}`, data);
router.delete(`/clients/${id}`);
```

## 📝 Fichiers à créer

Quand vous créez une nouvelle feature:

1. **Modèle Laravel** - `app/Models/NewModel.php`
2. **Migration** - `database/migrations/...`
3. **Contrôleur** - `app/Http/Controllers/NewModelController.php`
4. **Routes** - Ajouter dans `routes/web.php` ou `routes/api.php`
5. **Composant Page** - `resources/js/pages/NewModelPage.jsx`
6. **Composants UI** - `resources/js/components/NewModelForm.jsx`
7. **Hooks** - `resources/js/hooks/use-new-model.jsx` (si nécessaire)

## ✅ Checklist pour une nouvelle feature

- [ ] Modèle Eloquent créé
- [ ] Migration exécutée
- [ ] Contrôleur avec les actions CRUD
- [ ] Routes enregistrées
- [ ] Page Inertia créée
- [ ] Composants UI créés
- [ ] Validation côté client (JSDoc + validators.js)
- [ ] Validation côté serveur (Laravel)
- [ ] Tests Pest écrits
- [ ] Documentation mise à jour
