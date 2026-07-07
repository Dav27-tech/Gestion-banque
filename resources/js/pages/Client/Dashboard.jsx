import React, { useState } from 'react';
import ClientLayout from '@/layouts/ClientLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Wallet,
    CreditCard,
    Clock,
    CheckCircle2,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldCheck,
    Bell,
    Eye,
    KeyRound,
    History,
    User,
    LayoutDashboard,
    AlertCircle,
    XCircle,
    ThumbsUp,
} from 'lucide-react';

export default function Dashboard({
    transactions = [],
    transferts = [],
    transferts_rejetes = [],
}) {
    const { props } = usePage();
    const auth = props.auth;
    const trans = usePage().props;

    const Layout = ClientLayout;
    const nombre_tr = transactions.length;
    const nombre = transferts.length;
    const nombre_rejetes = transferts_rejetes.length;
    const compte = transactions?.compte;

    const date = (date) => {
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const accounts = [
        {
            id: 1,
            type: 'Compte Courant',
            currency: 'USD',
            balance: 5420.5,
            status: 'Actif',
            cardColor: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        },
    ];

    const pendingApprovals =
        transferts.filter((t) => t.statut?.toLowerCase() === 'en_attente') ||
        [];

    const notifications = [
        {
            id: 1,
            title: 'Demande de transfert en attente',
            desc: 'Une validation est requise pour le transfert REF-9921.',
            type: 'warning',
            time: 'Il y a 10 min',
        },
        {
            id: 2,
            title: 'Mise à jour de sécurité',
            desc: 'Votre mot de passe a été modifié avec succès.',
            type: 'info',
            time: 'Hier',
        },
    ];

    // --- Variables de calculs rapides ---
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    const completedCount = transferts.filter(
        (t) =>
            t.status?.toLowerCase() === 'approved' ||
            t.status?.toLowerCase() === 'completed' ||
            t.status?.toLowerCase() === 'validé',
    ).length;

    // --- Utilitaires de Stylisation Dynamique ---
    const getBadgeStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'validee')
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (s === 'rejetee' || s === 'rejected' || s === 'annulé')
            return 'bg-rose-50 text-rose-700 border-rose-200';
        if (s === 'virement' || s === 'blue')
            return 'bg-blue-50 text-blue-700 border-blue-200';
        return 'bg-amber-50 text-amber-700 border-amber-200'; // Pending / default
    };

    return (
        <Layout nombre_tr={nombre_tr}>
            <Head title="Tableau de Bord Client" />

            <div className="min-h-screen bg-slate-50/50 pb-12 antialiased">
                {/* 1. Welcome Header Section */}
                <div className="mb-8 border-b border-slate-200 bg-white px-6 py-8 lg:px-10">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="text-xs font-bold tracking-wider text-[#9f2d2d] uppercase">
                                Espace Client Sécurisé
                            </span>
                            <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
                                Ravis de vous revoir,{' '}
                                <span className="bg-gradient-to-r from-[#9f2d2d] to-[#7A1C1C] bg-clip-text text-transparent">
                                    {auth?.user?.name ?? 'David Amani'}
                                </span>
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Gérez vos comptes bancaires et validez vos
                                opérations en attente en toute sécurité.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-3 lg:px-10">
                    {/* COLONNE GAUCHE & CENTRE (Principale) */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* 2. Banking Overview Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Solde Total */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">
                                        Solde Total
                                    </span>
                                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                        <Wallet size={16} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {transferts[0].compte?.solde}
                                    </h3>
                                    <span className="mt-0.5 block text-[11px] font-medium text-emerald-600">
                                        Devise principale:{' '}
                                        {transferts[0].compte?.devise}
                                    </span>
                                </div>
                            </div>

                            {/* En Attente */}
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                                <div className="absolute top-0 right-0 left-0 h-[3px] bg-amber-500"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">
                                        En Attente
                                    </span>
                                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                        <Clock size={16} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {nombre_tr}
                                        </h3>
                                        {nombre_tr > 0 && (
                                            <span className="animate-pulse rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                                Action
                                            </span>
                                        )}
                                    </div>
                                    <span className="mt-0.5 block text-[11px] font-medium text-amber-600">
                                        À approuver ou rejeter
                                    </span>
                                </div>
                            </div>

                            {/* Transactions Validées */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">
                                        Approuvées
                                    </span>
                                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                        <CheckCircle2 size={16} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {nombre}
                                    </h3>
                                    <span className="mt-0.5 block text-[11px] font-medium text-emerald-600">
                                        Opérations exécutées
                                    </span>
                                </div>
                            </div>

                            {/* Transactions rejetées */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">
                                        rejetées
                                    </span>
                                    <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                                        <XCircle size={16} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {nombre_rejetes}
                                    </h3>
                                    <span className="mt-0.5 block text-[11px] font-medium text-rose-600">
                                        Opérations rejetées
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Accounts Section (Cartes Bancaires) */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <CreditCard
                                        size={18}
                                        className="text-[#9f2d2d]"
                                    />{' '}
                                    Mes Comptes Bancaires
                                </h2>
                            </div>

                            {accounts.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                                    <CreditCard
                                        size={36}
                                        className="mx-auto mb-2 text-slate-300"
                                    />
                                    <p className="text-sm font-medium">
                                        Aucun compte bancaire enregistré.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {accounts.map((account) => (
                                        <div
                                            key={account.id}
                                            style={{
                                                background: account.cardColor,
                                            }}
                                            className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-md transition-all duration-300 hover:shadow-xl"
                                        >
                                            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/5 transition-all duration-500 group-hover:scale-150"></div>
                                            <div className="mb-8 flex items-start justify-between">
                                                <div>
                                                    <p className="text-xs font-medium tracking-wide text-white/70">
                                                        {account.type}
                                                    </p>
                                                    <p className="mt-1 text-lg font-bold tracking-widest">
                                                        {account.number}
                                                    </p>
                                                </div>
                                                <span className="rounded-full border border-white/10 bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                                                    {account.status}
                                                </span>
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <span className="block text-[10px] font-semibold tracking-wider text-white/60 uppercase">
                                                        Solde Disponible
                                                    </span>
                                                    <span className="text-xl font-bold">
                                                        {
                                                            transferts[0].compte
                                                                ?.solde
                                                        }{' '}
                                                        {
                                                            transferts[0].compte
                                                                ?.devise
                                                        }
                                                    </span>
                                                </div>
                                                <button className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100">
                                                    Détails{' '}
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 4. Pending Transactions Section (Prioritaire & Alerte) */}
                        <div className="overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/60 px-6 py-4">
                                <h2 className="flex items-center gap-2 text-base font-bold text-amber-900">
                                    <Clock
                                        size={18}
                                        className="animate-spin-slow text-amber-600"
                                    />{' '}
                                    Approbations en attente
                                </h2>
                                <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-bold text-white">
                                    {nombre_tr} Action
                                    {nombre_tr > 1 ? 's' : ''} requise
                                </span>
                            </div>

                            {nombre_tr === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <ThumbsUp
                                        size={36}
                                        className="mx-auto mb-2 text-emerald-400"
                                    />
                                    <p className="text-sm font-medium">
                                        Parfait ! Aucune transaction en attente
                                        de validation.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {pendingApprovals.map((tr, idx) => (
                                        <div
                                            key={tr.id || idx}
                                            className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-xl bg-amber-50 p-2.5 text-amber-600">
                                                    <ArrowUpRight size={18} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            {tr.type ||
                                                                'Transfert Sortant'}
                                                        </span>
                                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-400">
                                                            Ref:{' '}
                                                            {tr.reference ||
                                                                `#TR-${1000 + idx}`}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Date d'initialisation :{' '}
                                                        {date(tr.created_at) ||
                                                            "Aujourd'hui"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-6 sm:justify-end">
                                                <div className="text-right">
                                                    <span className="block text-base font-extrabold text-slate-900">
                                                        -{tr.montant}{' '}
                                                        {tr.compte?.devise}
                                                    </span>
                                                    <span className="text-[11px] font-semibold tracking-wide text-amber-600 uppercase">
                                                        En attente de signature
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100">
                                                        Rejeter
                                                    </button>
                                                    <button className="rounded-lg bg-gradient-to-r from-[#9f2d2d] to-[#7A1C1C] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-95">
                                                        Approuver
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 5. Recent Activity Table Section */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                                    <History
                                        size={18}
                                        className="text-slate-500"
                                    />{' '}
                                    Activité Récente
                                </h2>
                            </div>

                            {transferts.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <AlertCircle
                                        size={36}
                                        className="mx-auto mb-2 text-slate-300"
                                    />
                                    <p className="text-sm font-medium">
                                        Aucune activité récente enregistrée sur
                                        ce compte.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                <th className="px-6 py-3">
                                                    Référence
                                                </th>
                                                <th className="px-6 py-3">
                                                    Type d'Opération
                                                </th>
                                                <th className="px-6 py-3 text-right">
                                                    Montant
                                                </th>
                                                <th className="px-6 py-3">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-center">
                                                    Statut
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {transferts.map((tr, idx) => (
                                                <tr
                                                    key={tr.id}
                                                    className="transition-colors hover:bg-slate-50/40"
                                                >
                                                    <td className="px-6 py-3.5 font-mono text-xs text-slate-400">
                                                        {tr.reference_unique ||
                                                            `#TR-${2045 + idx}`}
                                                    </td>
                                                    <td className="px-6 py-3.5 font-bold text-slate-800">
                                                        {tr.type ||
                                                            'Virement Reçu'}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-3.5 text-right font-extrabold ${tr.type?.toLowerCase() === 'withdrawal' || tr.type?.toLowerCase() === 'transfert' ? 'text-slate-900' : 'text-emerald-600'}`}
                                                    >
                                                        {tr.montant}{' '}
                                                        {tr.compte?.devise}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-xs text-slate-500">
                                                        {date(tr.created_at) ||
                                                            'Récemment'}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-center">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getBadgeStyle(tr.status)}`}
                                                        >
                                                            {tr.statut ||
                                                                'Validé'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLONNE DROITE (Actions, Alertes, Sécurité) */}
                    <div className="space-y-8">
                        {/* 6. Quick Actions Area */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-1.5 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                <LayoutDashboard
                                    size={16}
                                    className="text-slate-400"
                                />{' '}
                                Actions Rapides
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white p-2 text-[#9f2d2d] shadow-sm">
                                            <CreditCard size={16} />
                                        </div>
                                        Voir mes comptes
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-slate-400 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>

                                <button className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white p-2 text-amber-600 shadow-sm">
                                            <Clock size={16} />
                                        </div>
                                        Opérations en attente
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-slate-400 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>

                                <button className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
                                            <History size={16} />
                                        </div>
                                        Historique global
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-slate-400 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>

                                <button className="group flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
                                            <User size={16} />
                                        </div>
                                        Profil & Coordonnées
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-slate-400 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* 7. Notifications Sidepanel Component */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-slate-800 uppercase">
                                    <Bell
                                        size={16}
                                        className="text-slate-400"
                                    />{' '}
                                    Alertes Bancaires
                                </h3>
                                {notifications.length > 0 && (
                                    <span className="h-2 w-2 rounded-full bg-[#9f2d2d]"></span>
                                )}
                            </div>

                            {notifications.length === 0 ? (
                                <p className="py-4 text-center text-xs text-slate-400">
                                    Aucune nouvelle notification.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="group relative rounded-xl border border-slate-100 bg-slate-50 p-3"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-xs font-bold text-slate-900">
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] font-medium whitespace-nowrap text-slate-400">
                                                    {notif.time}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                                                {notif.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 8. Security Status Card Component */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7A1C1C] to-[#9f2d2d] p-6 text-white shadow-md">
                            <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-10">
                                <ShieldCheck size={160} />
                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <div className="rounded-lg bg-white/10 p-2 backdrop-blur-md">
                                    <ShieldCheck size={18} />
                                </div>
                                <h3 className="text-sm font-bold tracking-wider uppercase">
                                    Statut de Sécurité
                                </h3>
                            </div>

                            <div className="mb-4 space-y-3 border-b border-white/10 pb-4 text-xs text-white/80">
                                <div className="flex justify-between">
                                    <span>État du Compte:</span>
                                    <span className="font-bold text-emerald-300">
                                        Protégé
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Mot de passe:</span>
                                    <span className="font-medium">
                                        Mis à jour récemment
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dernier accès IP:</span>
                                    <span className="font-mono text-white/60">
                                        192.168.1.104
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/client/change-password"
                                className="text-none flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition-colors hover:bg-slate-100"
                            >
                                <KeyRound size={14} /> Modifier le mot de passe
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
