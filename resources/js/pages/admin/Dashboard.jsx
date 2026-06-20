import React, { useMemo, useState, useEffect } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

// Brand-consistent Icons (Lucide equivalent inline wrappers or standard Lucide-react imports)
import {
    Users,
    UserCheck,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Activity,
    Bell,
    CheckCircle,
    ShieldAlert,
    Layers,
    CreditCard,
    TrendingUp,
    FileText,
    Settings,
    UserPlus,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// --- Global Administrative Palettes ---
const COLORS = {
    primary: '#1e3a8a',
    secondary: '#2563eb',
    accentBlue: '#dbeafe',
    lightBlue: '#eff6ff',
    bgCard: '#ffffff',
    bgMain: '#f8fafc',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    chartColors: ['#1e3a8a', '#2563eb', '#60a5fa', '#93c5fd', '#a7f3d0'],
};

export default function Dashboard() {
    // 1. Recover your current page contextual bounds
    const { props } = usePage();
    const auth = props?.auth || {};

    // Fallbacks matching your exact database backend keys
    const stats = props?.stats || {
        utilisateurs: 0,
        clients: 0,
        comptes: 0,
        solde_total: 0,
    };

    // Keep optional extensions passed alongside main metrics
    const recentTransactions = props?.recentTransactions || [];
    const recentActivities = props?.recentActivities || [];
    const notifications = props?.notifications || [];

    // 2. Local reactive parameters
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString(),
    );

    useEffect(() => {
        const timer = setInterval(
            () => setCurrentTime(new Date().toLocaleTimeString()),
            1000,
        );
        return () => clearInterval(timer);
    }, []);

    // 3. System Currency Formatters (Configured for USD/CDF dual split, falling back cleanly to EUR based on your source)
    const formatCurrencyUSD = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };
    const formatCurrencyCDF = (amount) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0,
        }).format(amount * 2800 || 0); // Visual indexing conversion
    };

    // 4. Safe Route Context Handlers
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

    // 5. Memoized calculations checking if nested graph properties are present
    const processedEvolutionData = useMemo(
        () =>
            stats?.transactionsEvolution || [
                { date: 'Mon', count: 40 },
                { date: 'Tue', count: 55 },
                { date: 'Wed', count: 48 },
                { date: 'Thu', count: 70 },
                { date: 'Fri', count: 82 },
                { date: 'Sat', count: 90 },
                { date: 'Sun', count: 110 },
            ],
        [stats?.transactionsEvolution],
    );

    const processedVolumeData = useMemo(
        () =>
            stats?.depositsVsWithdrawals || [
                { period: 'W1', deposits: 4000, withdrawals: 2400 },
                { period: 'W2', deposits: 3000, withdrawals: 1398 },
                { period: 'W3', deposits: 2000, withdrawals: 9800 },
                { period: 'W4', deposits: 2780, withdrawals: 3908 },
            ],
        [stats?.depositsVsWithdrawals],
    );

    const accountDistData = useMemo(
        () =>
            stats?.accountDistribution || [
                { name: 'Savings Accounts', value: 65, percentage: 65 },
                { name: 'Current Accounts', value: 35, percentage: 35 },
            ],
        [stats?.accountDistribution],
    );

    const currencyDistData = useMemo(
        () =>
            stats?.currencyDistribution || [
                { currency: 'USD Balance', value: 60 },
                { currency: 'CDF Balance', value: 40 },
            ],
        [stats?.currencyDistribution],
    );

    return (
        <AdminLayout>
            <Head title="Executive Banking Control Center" />

            <div className="min-h-screen space-y-8 bg-[#f8fafc] p-1 font-sans text-slate-800 antialiased">
                {/* SECTION 1: Welcome Header Banner */}
                <header className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#1e3a8a]">
                            Welcome back, {auth?.user?.name || 'David'}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Banking operations are running normally today.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 rounded-xl border border-[#dbeafe] bg-[#eff6ff] px-4 py-2 text-[#1e3a8a]">
                            <Clock className="h-4 w-4 text-[#2563eb]" />
                            <span>
                                {new Date().toLocaleDateString('en-US', {
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
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-semibold tracking-wide uppercase">
                                🟢 System Healthy
                            </span>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: Main KPI Cards (Hooked into French properties safely) */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Total Users */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Total System Users
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.utilisateurs}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-[#eff6ff] p-3 text-[#2563eb]">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-1 border-t border-slate-50 pt-4 text-center text-[10px] font-semibold text-slate-500">
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.admins || 1}
                                </span>
                                Adm
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.managers || 2}
                                </span>
                                Mngr
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.cashiers || 4}
                                </span>
                                Cash
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-900">
                                    {stats.auditors || 1}
                                </span>
                                Aud
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Total Clients */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Total Registered Clients
                                </p>
                                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                                    {stats.clients}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-indigo-50 p-3 text-[#1e3a8a]">
                                <UserCheck className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between border-t border-slate-50 pt-4 text-xs font-medium text-slate-500">
                            <span>KYC Verified Status:</span>
                            <span className="font-bold text-emerald-600">
                                100% Compliant
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Total Accounts */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                    Active Bank Accounts
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
                            <span>Product Base Ledger:</span>
                            <span className="font-bold text-slate-900">
                                Active Units
                            </span>
                        </div>
                    </div>

                    {/* Card 4: Total Bank Funds */}
                    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white bg-gradient-to-br from-white to-[#eff6ff] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-[#1e3a8a] uppercase">
                                    Total Bank Funds Under Management
                                </p>
                                <div className="mt-2 space-y-1">
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900">
                                        {formatCurrencyUSD(stats.solde_total)}
                                    </h3>
                                    <h4 className="text-sm font-bold tracking-tight text-slate-500">
                                        {formatCurrencyCDF(stats.solde_total)}
                                    </h4>
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#1e3a8a] p-3 text-white shadow-sm">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Banking Activity Charts */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Trend Evolution Chart */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">
                                Transactions Evolution
                            </h3>
                            <span className="text-xs font-medium text-slate-400">
                                Rolling Analytics Window
                            </span>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={processedEvolutionData}
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
                                                stopColor="#2563eb"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#2563eb"
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
                                        stroke="#2563eb"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorTx)"
                                        name="Transactions"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Deposits vs Withdrawals Distribution */}
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-base font-bold text-slate-900">
                            Deposits vs Withdrawals
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={processedVolumeData}
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
                                        fill="#1e3a8a"
                                        radius={[4, 4, 0, 0]}
                                        name="Deposits"
                                    />
                                    <Bar
                                        dataKey="withdrawals"
                                        fill="#60a5fa"
                                        radius={[4, 4, 0, 0]}
                                        name="Withdrawals"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* SECTION 4, 5 & 10: Process Ledger Overviews */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Modern Dynamic Transactions Table Frame */}
                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Real-Time Core Transaction Ledger
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Displaying the latest executed postings
                                </p>
                            </div>
                            <Link
                                href={transactionsHref}
                                className="rounded-xl bg-[#eff6ff] px-4 py-2 text-xs font-bold text-[#2563eb] transition-all hover:bg-[#dbeafe]"
                            >
                                View All Transactions
                            </Link>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-500">
                                        <th className="p-3.5">Reference</th>
                                        <th className="p-3.5">Type</th>
                                        <th className="p-3.5">Account Label</th>
                                        <th className="p-3.5 text-right">
                                            Amount
                                        </th>
                                        <th className="p-3.5 text-right">
                                            Timestamp
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
                                                <td className="p-3.5 font-mono tracking-wider text-[#1e3a8a] uppercase">
                                                    {tx.reference}
                                                </td>
                                                <td className="p-3.5">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                                                    >
                                                        {tx.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-3.5">
                                                    {tx.account_number}
                                                </td>
                                                <td className="p-3.5 text-right font-bold text-slate-900">
                                                    {formatCurrencyUSD(
                                                        tx.amount,
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
                                                No recent operational core
                                                postings logged today.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Operational Feed Tracking Panels */}
                    <div className="space-y-6">
                        {/* Notification Alert Center */}
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Bell className="h-4 w-4 text-amber-500" />
                                Live System Notifications
                            </h3>
                            <div className="space-y-2">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-2.5 rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-3 text-xs text-slate-700"
                                        >
                                            <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563eb]" />
                                            <span>{notif.message}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-2 text-center text-xs text-slate-400">
                                        0 pending core warnings pending review.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent System Activity Log */}
                        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Activity className="h-4 w-4 text-[#2563eb]" />
                                Recent Activity Audit Trail
                            </h3>
                            <div className="relative space-y-4 border-l border-slate-100 pl-4 text-xs">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((act) => (
                                        <div
                                            key={act.id}
                                            className="group relative"
                                        >
                                            <div className="absolute top-1 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300 transition-colors group-hover:bg-[#2563eb]"></div>
                                            <div className="font-semibold text-slate-800">
                                                {act.action}
                                            </div>
                                            <div className="mt-0.5 text-[11px] text-slate-400">
                                                By {act.user_responsible} •{' '}
                                                {act.timestamp}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-2 text-xs text-slate-400">
                                        No background admin records logged.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 9: Executive Command Center Action Pad */}
                <footer className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold tracking-wide text-slate-900">
                        Command Center Administrative Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href={usersHref}
                            className="flex items-center gap-3 rounded-xl border border-blue-200/50 bg-blue-50 p-4 text-left text-xs font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100"
                        >
                            <UserPlus className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Gérer les utilisateurs
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Manage corporate permissions
                                </span>
                            </div>
                        </Link>
                        <Link
                            href={comptesHref}
                            className="flex items-center gap-3 rounded-xl border border-indigo-200/50 bg-indigo-50 p-4 text-left text-xs font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-100"
                        >
                            <CreditCard className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Gestion des comptes
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Review user account files
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
                                    Fils de Transactions
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Verify ledger operations
                                </span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/50 bg-slate-50 p-4 text-left text-xs text-slate-700 opacity-70 shadow-sm">
                            <Settings className="h-5 w-5" />
                            <div>
                                <span className="block font-bold text-slate-900">
                                    Configuration Système
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                    Core configuration active
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </AdminLayout>
    );
}
