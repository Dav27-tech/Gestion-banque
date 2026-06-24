import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    CheckCircle,
    Clock,
    CreditCard,
    Settings,
    TrendingUp,
    UserCheck,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import AdminLayout from '../../Layouts/AdminLayout';

const emptyStats = {
    utilisateurs: 0,
    admins: 0,
    managers: 0,
    cashiers: 0,
    auditors: 0,
    clients: 0,
    comptes: 0,
    comptes_actifs: 0,
    comptes_courant: 0,
    comptes_epargne: 0,
    solde_usd: 0,
    solde_cdf: 0,
    total_operations: 0,
    transactionsEvolution: [],
    depositsVsWithdrawals: [],
};

const transactionLabels = {
    depot: 'Dépôt',
    retrait: 'Retrait',
    virement: 'Virement',
};

export default function Dashboard() {
    const { props } = usePage();
    const auth = props?.auth || {};
    const stats = { ...emptyStats, ...(props?.stats || {}) };
    const recentTransactions = props?.recentTransactions || [];
    const recentActivities = props?.recentActivities || [];
    const notifications = props?.notifications || [];
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString('fr-FR'),
    );

    useEffect(() => {
        const timer = setInterval(
            () => setCurrentTime(new Date().toLocaleTimeString('fr-FR')),
            1000,
        );

        return () => clearInterval(timer);
    }, []);

    const formatCurrency = (amount, currency) =>
        new Intl.NumberFormat(currency === 'CDF' ? 'fr-CD' : 'en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: currency === 'CDF' ? 0 : 2,
        }).format(Number(amount) || 0);

    const usersHref =
        typeof route !== 'undefined'
            ? route('admin.users.index')
            : '/admin/users';
    const comptesHref =
        typeof route !== 'undefined'
            ? route('gestionnaire.comptes.index')
            : '/gestionnaire/comptes';
    const transactionsHref =
        typeof route !== 'undefined'
            ? route('caissier.transactions.index')
            : '/caissier/transactions';

    const evolutionData = useMemo(
        () => stats.transactionsEvolution || [],
        [stats.transactionsEvolution],
    );
    const volumeData = useMemo(
        () => stats.depositsVsWithdrawals || [],
        [stats.depositsVsWithdrawals],
    );

    return (
        <AdminLayout>
            <Head title="Tableau de bord administrateur" />

            <div className="min-h-screen space-y-8 bg-[#f8fafc] p-1 font-sans text-slate-800 antialiased">
                <header className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#7A1C1C]">
                            Bonjour, {auth?.user?.name || 'Administrateur'}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Vue générale des utilisateurs, clients, comptes et
                            opérations bancaires.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 rounded-xl border border-[#f5d6d6] bg-[#fff7f7] px-4 py-2 text-[#7A1C1C]">
                            <Clock className="h-4 w-4 text-[#9f2d2d]" />
                            <span>
                                {new Date().toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="opacity-40">|</span>
                            <span className="font-semibold tabular-nums">
                                {currentTime}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-emerald-700">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold tracking-wide uppercase">
                                Système opérationnel
                            </span>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Utilisateurs du système
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.utilisateurs}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-[#fff7f7] p-3 text-[#9f2d2d]">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-1 border-t border-slate-50 pt-4 text-center text-[10px] font-semibold text-slate-500">
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.admins ?? 0}
                                </span>
                                Admin
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.managers ?? 0}
                                </span>
                                Gest.
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.cashiers ?? 0}
                                </span>
                                Caiss.
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.auditors ?? 0}
                                </span>
                                Audit.
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Clients enregistrés
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.clients}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-[#fff7f7] p-3 text-[#7A1C1C]">
                                <UserCheck className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between border-t border-slate-50 pt-4 text-xs font-medium text-slate-500">
                            <span>Registre client</span>
                            <span className="font-bold text-emerald-600">
                                Données réelles
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Comptes bancaires
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.comptes}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                                <CreditCard className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between border-t border-slate-50 pt-4 text-xs font-medium text-slate-500">
                            <span>{stats.comptes_actifs} actifs</span>
                            <span className="font-bold text-slate-900">
                                {stats.comptes_courant} courant /{' '}
                                {stats.comptes_epargne} épargne
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-[#fff7f7] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-[#7A1C1C] uppercase">
                                    Fonds sous gestion
                                </p>
                                <div className="mt-2 space-y-1">
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900">
                                        {formatCurrency(
                                            stats.solde_usd,
                                            'USD',
                                        )}
                                    </h3>
                                    <h4 className="text-sm font-bold tracking-tight text-slate-500">
                                        {formatCurrency(
                                            stats.solde_cdf,
                                            'CDF',
                                        )}
                                    </h4>
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#7A1C1C] p-3 text-white shadow-sm">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">
                                Évolution des transactions
                            </h3>
                            <span className="text-xs font-medium text-slate-400">
                                7 derniers jours
                            </span>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={evolutionData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorTx"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#9f2d2d"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#9f2d2d"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 12px rgba(0,0,0,0.05)',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#9f2d2d"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorTx)"
                                        name="Transactions"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-base font-bold text-slate-900">
                            Dépôts et retraits
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={volumeData}
                                    margin={{
                                        top: 10,
                                        right: 0,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="period"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{
                                            fontSize: '12px',
                                            paddingTop: 10,
                                        }}
                                    />
                                    <Bar
                                        dataKey="deposits"
                                        fill="#7A1C1C"
                                        radius={[4, 4, 0, 0]}
                                        name="Dépôts"
                                    />
                                    <Bar
                                        dataKey="withdrawals"
                                        fill="#c46a6a"
                                        radius={[4, 4, 0, 0]}
                                        name="Retraits"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Dernières transactions
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Opérations réellement enregistrées dans le
                                    journal bancaire
                                </p>
                            </div>
                            <Link
                                href={transactionsHref}
                                className="rounded-xl bg-[#fff7f7] px-4 py-2 text-xs font-bold text-[#9f2d2d] transition-all hover:bg-[#f5d6d6]"
                            >
                                Voir tout
                            </Link>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-500">
                                        <th className="p-3.5">Référence</th>
                                        <th className="p-3.5">Type</th>
                                        <th className="p-3.5">Compte</th>
                                        <th className="p-3.5 text-right">
                                            Montant
                                        </th>
                                        <th className="p-3.5 text-right">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.map((tx) => (
                                            <tr
                                                key={tx.id}
                                                className="transition-colors hover:bg-slate-50/80"
                                            >
                                                <td className="p-3.5 font-mono tracking-wider text-[#7A1C1C] uppercase">
                                                    {tx.reference}
                                                </td>
                                                <td className="p-3.5">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                            tx.type === 'depot'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : tx.type ===
                                                                    'retrait'
                                                                  ? 'bg-rose-50 text-rose-700'
                                                                  : 'bg-[#fff7f7] text-[#7A1C1C]'
                                                        }`}
                                                    >
                                                        {transactionLabels[
                                                            tx.type
                                                        ] || tx.type}
                                                    </span>
                                                </td>
                                                <td className="p-3.5">
                                                    {tx.account_number || '—'}
                                                </td>
                                                <td className="p-3.5 text-right font-bold text-slate-900">
                                                    {formatCurrency(
                                                        tx.amount,
                                                        tx.currency || 'USD',
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-right text-slate-400 tabular-nums">
                                                    {tx.created_at}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-6 text-center font-normal text-slate-400"
                                            >
                                                Aucune transaction récente.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Bell className="h-4 w-4 text-amber-500" />
                                Notifications système
                            </h3>
                            <div className="space-y-2">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-2.5 rounded-xl border border-[#f5d6d6] bg-[#fff7f7] p-3 text-xs text-slate-700"
                                        >
                                            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9f2d2d]" />
                                            <span>{notif.message}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-2 text-center text-xs text-slate-400">
                                        Aucune alerte à examiner.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Activity className="h-4 w-4 text-[#9f2d2d]" />
                                Activité récente
                            </h3>
                            <div className="relative space-y-4 border-l border-slate-100 pl-4 text-xs">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((act) => (
                                        <div
                                            key={act.id}
                                            className="group relative"
                                        >
                                            <div className="absolute top-1 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300 transition-colors group-hover:bg-[#9f2d2d]" />
                                            <div className="font-semibold text-slate-800">
                                                {act.action}
                                            </div>
                                            <div className="mt-0.5 text-[11px] text-slate-400">
                                                Par {act.user_responsible} ·{' '}
                                                {act.timestamp}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-2 text-xs text-slate-400">
                                        Aucune activité récente.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold tracking-wide text-slate-900">
                        Actions rapides administrateur
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href={usersHref}
                            className="flex items-center gap-3 rounded-xl border border-[#f5d6d6] bg-[#fff7f7] p-4 text-left text-xs font-semibold text-[#7A1C1C] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fdf2f2]"
                        >
                            <UserPlus className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Gérer les utilisateurs
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Rôles et accès du personnel
                                </span>
                            </div>
                        </Link>
                        <Link
                            href={comptesHref}
                            className="flex items-center gap-3 rounded-xl border border-[#f5d6d6] bg-[#fff7f7] p-4 text-left text-xs font-semibold text-[#7A1C1C] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fdf2f2]"
                        >
                            <CreditCard className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Gestion des comptes
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Comptes bancaires clients
                                </span>
                            </div>
                        </Link>
                        <Link
                            href={transactionsHref}
                            className="flex items-center gap-3 rounded-xl border border-amber-200/50 bg-amber-50 p-4 text-left text-xs font-semibold text-amber-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100"
                        >
                            <TrendingUp className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Transactions
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Dépôts, retraits et virements
                                </span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/50 bg-slate-50 p-4 text-left text-xs text-slate-700 opacity-70 shadow-sm">
                            <Settings className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Configuration système
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Paramètres généraux
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </AdminLayout>
    );
}
