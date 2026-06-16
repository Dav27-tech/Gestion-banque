# 🏦 Gestion Banque - Système de Gestion Bancaire

Application moderne de gestion bancaire développée avec **Laravel**, **React JSX**, **Vite** et **Tailwind CSS**.

---

## 🚀 Stack Technologique

| Domaine        | Technologie                   |
| -------------- | ----------------------------- |
| **Backend**    | Laravel 11 + PHP 8.2+         |
| **Frontend**   | React 19 + JSX + Vite         |
| **UI/CSS**     | Tailwind CSS + Radix UI       |
| **Routing**    | Inertia.js (Server-driven UI) |
| **Auth**       | Laravel Fortify + Passkeys    |
| **Database**   | MySQL/MariaDB                 |
| **Validation** | ESLint + Prettier             |
| **Testing**    | Pest (PHP)                    |

---

## 📁 Architecture du Projet

```
gestion-banque/
├── app/                          # Code Laravel backend
│   ├── Http/Controllers/        # Contrôleurs API
│   ├── Models/                  # Modèles Eloquent
│   │   ├── User.php
│   │   ├── Client.php
│   │   ├── Compte.php
│   │   ├── Transaction.php
│   │   └── Role.php
│   └── Providers/               # Service providers
├── resources/
│   ├── js/                      # Code React JSX
│   │   ├── components/          # Composants réutilisables
│   │   │   └── ui/             # Composants Radix UI
│   │   ├── pages/              # Pages de l'application
│   │   ├── layouts/            # Layouts (App, Auth, Settings)
│   │   ├── hooks/              # Hooks React personnalisés
│   │   ├── context/            # Context API
│   │   ├── lib/                # Utilitaires et helpers
│   │   ├── actions/            # Actions serveur Inertia
│   │   ├── types/              # Annotations JSDoc
│   │   ├── wayfinder/          # Composants UI générés
│   │   ├── App.jsx             # Composant racine
│   │   ├── main.jsx            # Point d'entrée
│   │   └── routes/             # Définitions des routes
│   ├── css/
│   │   └── app.css             # Styles Tailwind CSS
│   └── views/
│       └── app.blade.php       # Template HTML principal
├── database/
│   ├── migrations/             # Migrations DB
│   ├── factories/              # Model factories
│   └── seeders/                # Seeders
├── routes/
│   ├── web.php                 # Routes web (Inertia)
│   └── api.php                 # Routes API
├── tests/
│   ├── Feature/                # Tests fonctionnels
│   └── Unit/                   # Tests unitaires
├── config/                     # Fichiers de configuration
├── storage/                    # Stockage (logs, cache, sessions)
├── public/                     # Fichiers publics
└── vite.config.js             # Configuration Vite

```

---

## 🎯 Objectif de l'Application

Ce projet simule un système bancaire complet permettant de :

✅ **Gestion des Clients**

- Création, modification, suppression de clients
- Consultation des informations personnelles
- Historique des transactions par client

✅ **Gestion des Comptes**

- Création de comptes bancaires (Checking, Savings, Investment)
- Consultation des soldes
- Historique des mouvements

✅ **Opérations Financières**

- Dépôts et retraits
- Virements entre comptes
- Virements inter-banques
- Calcul des intérêts

✅ **Sécurité & Authentification**

- Login email/mot de passe
- Authentification Passkey (biométrique)
- Two-factor authentication
- Gestion des rôles et permissions

✅ **Reporting & Audit**

- Historique complet des transactions
- Rapports financiers
- Logs d'activité

---

## 👤 Rôles Utilisateurs

- **Admin** : Accès complet au système, gestion des utilisateurs
- **Manager** : Gestion des clients et comptes
- **Cashier** : Opérations de dépôt et retrait
- **Auditor** : Consultation et reporting

---

## 📊 Modèles de Données

- Ouverture de compte
- Consultation du solde
- Historique des comptes

### 💰 Transactions

- Dépôts
- Retraits
- Virements entre comptes

### 📊 Intérêts

- Calcul automatique des intérêts
- Mise à jour des soldes

---

## 🧱 Architecture

```text
React (Frontend)
      ↓
Laravel API (Backend)
      ↓
MySQL Database
```
