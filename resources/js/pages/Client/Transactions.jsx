import React, { useState, useMemo } from 'react';
import ClientLayout from '@/layouts/ClientLayout';
import { router, Head, usePage } from '@inertiajs/react';
import {
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    Calendar,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Inbox,
    RefreshCw,
    AlertTriangle,
} from 'lucide-react';

export default function Transactions({ transactions = [], transferts = [] }) {
    const { props } = usePage();
    const auth = props.auth;

    const Layout = ClientLayout;

    // États locaux pour la recherche, les filtres et l'affichage étendu des lignes
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All'); // Par défaut filtré sur 'pending' pour la sécurité
    const [dateFilter, setDateFilter] = useState('All');
    const [expandedRows, setExpandedRows] = useState({});
    const [processingId, setProcessingId] = useState(null); // Gère l'état de chargement lors d'un traitement

    // Formatteur de devise dynamique
    const formatCurrency = (amount, transaction) => {
        // Récupère la devise via la relation (ex: 'USD', 'CDF', 'EUR')
        // S'adapte selon la structure exacte renvoyée par ton Laravel :
        // transaction.compte?.devise ou transaction.compte?.devise?.code etc.
        const currencyCode =
            transaction?.compte?.devise || transaction?.devise || 'CDF';

        try {
            return new Intl.NumberFormat('fr-CD', {
                // 'fr-CD' pour le format de la République Démocratique du Congo
                style: 'currency',
                currency: currencyCode.toUpperCase(),
            }).format(amount);
        } catch (e) {
            // En cas de code devise invalide ou non supporté par Intl, affiche le montant brut + le code
            return `${Number(amount).toFixed(2)} ${currencyCode}`;
        }
    };

    // Calcul dynamique des statistiques sur la base des transactions reçues
    const stats = useMemo(() => {
        const en_attente = transactions.filter(
            (t) => t.statut?.toLowerCase() === 'en_attente',
        );
        const transfers = en_attente.filter(
            (t) =>
                t.type?.toLowerCase() === 'transfer' ||
                t.type?.toLowerCase() === 'virement',
        );
        const withdrawals = en_attente.filter(
            (t) =>
                t.type?.toLowerCase() === 'withdrawal' ||
                t.type?.toLowerCase() === 'retrait',
        );

        const totalPendingAmount = en_attente.reduce(
            (sum, t) => sum + Number(t.montant || 0),
            0,
        );

        return {
            pendingCount: en_attente.length,
            pendingAmount: totalPendingAmount,
            transfersCount: transfers.length,
            withdrawalsCount: withdrawals.length,
        };
    }, [transactions]);

    // Logique de filtrage globale (Recherche par réf, compte + critères de filtres sélectifs)
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchesSearch =
                transaction.reference_unique
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                transaction.compte_source
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                transaction.compte_destination
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const currentType = transaction.type?.toLowerCase();
            const matchesType =
                typeFilter === 'All' ||
                (typeFilter === 'Transfers' &&
                    (currentType === 'transfer' ||
                        currentType === 'virement')) ||
                (typeFilter === 'Withdrawals' &&
                    (currentType === 'withdrawal' ||
                        currentType === 'retrait'));

            const matchesStatus =
                statusFilter === 'All' ||
                transaction.statut?.toLowerCase() ===
                    statusFilter.toLowerCase();

            // Filtrage par date de création
            if (dateFilter === 'All')
                return matchesSearch && matchesType && matchesStatus;

            const txDate = new Date(transaction.created_at || Date.now());
            const today = new Date();
            const diffTime = Math.abs(today - txDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const matchesDate =
                (dateFilter === 'Today' && diffDays <= 1) ||
                (dateFilter === '7Days' && diffDays <= 7) ||
                (dateFilter === '30Days' && diffDays <= 30);

            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });
    }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter]);

    // Logique de filtrage globale (Recherche par réf, compte + critères de filtres sélectifs)
    const filteredTransferts = useMemo(() => {
        return transferts.filter((transaction) => {
            const matchesSearch =
                transaction.reference_unique
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                transaction.compte_source
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                transaction.compte_destination
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const currentType = transaction.type?.toLowerCase();
            const matchesType =
                typeFilter === 'All' ||
                (typeFilter === 'Transfers' &&
                    (currentType === 'transfer' ||
                        currentType === 'virement')) ||
                (typeFilter === 'Withdrawals' &&
                    (currentType === 'withdrawal' ||
                        currentType === 'retrait')) ||
                (typeFilter === 'Depot' && currentType === 'depot');
            const matchesStatus =
                statusFilter === 'All' ||
                transaction.statut?.toLowerCase() ===
                    statusFilter.toLowerCase();

            // Filtrage par date de création
            if (dateFilter === 'All')
                return matchesSearch && matchesType && matchesStatus;

            const txDate = new Date(transaction.created_at || Date.now());
            const today = new Date();
            const diffTime = Math.abs(today - txDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const matchesDate =
                (dateFilter === 'Today' && diffDays <= 1) ||
                (dateFilter === '7Days' && diffDays <= 7) ||
                (dateFilter === '30Days' && diffDays <= 30);

            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });
    }, [transferts, searchTerm, typeFilter, statusFilter, dateFilter]);

    // Basculer l'affichage étendu d'une ligne
    const toggleRow = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Gestion des actions d'approbation et de rejet avec verrouillage UI
    const handleAction = (id, endpoint) => {
        if (processingId) return; // Empêche les requêtes simultanées
        setProcessingId(id);

        router.patch(
            `/transactions/${id}/${endpoint}`,
            {},
            {
                onFinish: () => setProcessingId(null),
            },
        );
    };

    return (
        <Layout pendingCount={stats.pendingCount}>
            <Head title="Transactions en attente de validation" />

            <div className="mx-auto max-w-7xl space-y-8">
                {/* EN-TÊTE DE LA PAGE */}
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-900">
                            <Clock className="text-[#7A1C1C]" size={28} />
                            Transactions en attente
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Examinez et validez les opérations bancaires
                            requérant votre confirmation de sécurité.
                        </p>
                    </div>
                </div>

                {/* ALERTE BANCAIRE DE NOTIFICATION IMPORTANTE */}
                {stats.pendingCount > 0 && (
                    <div className="animate-fade-in flex items-start gap-3 rounded-r-xl border-l-4 border-amber-600 bg-amber-50 p-4 shadow-sm">
                        <AlertTriangle
                            className="mt-0.5 shrink-0 text-amber-600"
                            size={20}
                        />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-amber-800">
                                Action requise
                            </h4>
                            <p className="mt-1 text-sm text-amber-700">
                                Vous avez actuellement{' '}
                                <span className="font-bold">
                                    {stats.pendingCount}
                                </span>{' '}
                                opération{stats.pendingCount > 1 ? 's' : ''} en
                                attente de validation pour un montant global de{' '}
                                <span className="font-bold">
                                    {formatCurrency(stats.pendingAmount)}
                                </span>
                                .
                            </p>
                        </div>
                    </div>
                )}

                {/* SECTION STATISTIQUES */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Demandes en Attente */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Demandes en attente
                            </span>
                            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                                <Clock size={18} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {stats.pendingCount}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                                opérations
                            </span>
                        </div>
                    </div>

                    {/* Volume Global */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Montant total bloqué
                            </span>
                            <div className="rounded-xl bg-red-50 p-2.5 text-[#7A1C1C]">
                                <AlertCircle size={18} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.pendingAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Virements en attente */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Virements en attente
                            </span>
                            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                <ArrowUpRight size={18} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {stats.transfersCount}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                                demandes
                            </span>
                        </div>
                    </div>

                    {/* Retraits en attente */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Retraits en attente
                            </span>
                            <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                                <ArrowDownLeft size={18} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                                {stats.withdrawalsCount}
                            </span>
                            <span className="text-xs font-medium text-gray-500">
                                demandes
                            </span>
                        </div>
                    </div>
                </div>

                {/* ZONE DE RECHERCHE ET FILTRES */}
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row">
                    <div className="relative w-full md:flex-1">
                        <Search
                            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            style={{
                                color: '#343434',
                            }}
                            type="text"
                            placeholder="Rechercher par référence, compte..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-11 text-sm transition-all duration-150 focus:border-[#7A1C1C] focus:bg-white focus:ring-2 focus:ring-[#7A1C1C]/10 focus:outline-none"
                        />
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
                        {/* Filtre Type */}
                        <div className="flex w-full items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm sm:w-auto">
                            <Filter size={14} className="text-gray-400" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full cursor-pointer border-none bg-transparent text-xs font-medium text-gray-600 outline-none focus:ring-0"
                            >
                                <option value="All">Tous les types</option>
                                <option value="Depot">Dépôt</option>
                                <option value="Transfers">Virements</option>
                                <option value="Withdrawals">Retraits</option>
                            </select>
                        </div>

                        {/* Filtre Statut */}
                        <div className="flex w-full items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm sm:w-auto">
                            <CheckCircle2 size={14} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full cursor-pointer border-none bg-transparent text-xs font-medium text-gray-600 outline-none focus:ring-0"
                            >
                                <option value="All">Historique global</option>
                                <option value="en_attente">En attente</option>
                                <option value="validee">Validées</option>
                                <option value="rejetee">Rejetées</option>
                            </select>
                        </div>

                        {/* Filtre Date */}
                        <div className="flex w-full items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm sm:w-auto">
                            <Calendar size={14} className="text-gray-400" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full cursor-pointer border-none bg-transparent text-xs font-medium text-gray-600 outline-none focus:ring-0"
                            >
                                <option value="All">Toutes les dates</option>
                                <option value="Today">Aujourd'hui</option>
                                <option value="7Days">7 derniers jours</option>
                                <option value="30Days">
                                    30 derniers jours
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* GRILLE / COMPOSANT DE SÉCURITÉ DES TRANSACTIONS */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* CODE COMPATIBLE VUE DE TABLEAU (DESKTOP) */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                    <th className="w-10 p-4"></th>
                                    <th className="p-4">Référence</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Provenance</th>
                                    <th className="p-4">Montant</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4 text-right">
                                        Actions de sécurité
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                                {filteredTransferts.length > 0 ? (
                                    filteredTransferts.map((transaction) => {
                                        const isExpanded =
                                            !!expandedRows[transaction.id];
                                        const isCurrentProcessing =
                                            processingId === transaction.id;

                                        // Badge Type Style Logic
                                        const isTransfer =
                                            transaction.type?.toLowerCase() ===
                                                'transfer' ||
                                            transaction.type?.toLowerCase() ===
                                                'virement';
                                        const isWithdrawal =
                                            transaction.type?.toLowerCase() ===
                                                'withdrawal' ||
                                            transaction.type?.toLowerCase() ===
                                                'retrait';

                                        return (
                                            <React.Fragment
                                                key={transaction.id}
                                            >
                                                <tr
                                                    className={`transition-colors duration-150 hover:bg-gray-50/50 ${isExpanded ? 'bg-gray-50/30' : ''}`}
                                                >
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() =>
                                                                toggleRow(
                                                                    transaction.id,
                                                                )
                                                            }
                                                            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200/60 hover:text-gray-600"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <ChevronDown
                                                                    size={16}
                                                                />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="p-4 font-mono text-xs font-medium text-gray-900">
                                                        {
                                                            transaction.reference_unique
                                                        }
                                                    </td>
                                                    <td className="p-4">
                                                        {isTransfer ? (
                                                            <span className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                                                <ArrowUpRight
                                                                    size={12}
                                                                />{' '}
                                                                Virement
                                                            </span>
                                                        ) : isWithdrawal ? (
                                                            <span className="inline-flex items-center gap-1 rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                                                                <ArrowDownLeft
                                                                    size={12}
                                                                />{' '}
                                                                Retrait
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-lg border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                                Dépôt
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs font-medium text-gray-700">
                                                        {transaction.compte_source ??
                                                            'Compte Principal'}
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-900">
                                                        {formatCurrency(
                                                            transaction.montant,
                                                            transaction,
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs text-gray-400">
                                                        {transaction.created_at
                                                            ? new Date(
                                                                  transaction.created_at,
                                                              ).toLocaleDateString(
                                                                  'fr-FR',
                                                                  {
                                                                      day: 'numeric',
                                                                      month: 'short',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : '—'}
                                                    </td>
                                                    <td className="p-4">
                                                        {transaction.statut?.toLowerCase() ===
                                                            'en_attente' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>{' '}
                                                                En attente
                                                            </span>
                                                        )}
                                                        {transaction.statut?.toLowerCase() ===
                                                            'validee' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>{' '}
                                                                Validée
                                                            </span>
                                                        )}
                                                        {transaction.statut?.toLowerCase() ===
                                                            'rejetee' && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>{' '}
                                                                Rejetée
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {transaction.statut?.toLowerCase() ===
                                                        'en_attente' ? (
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    disabled={
                                                                        !!processingId
                                                                    }
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            transaction.id,
                                                                            'valider',
                                                                        )
                                                                    }
                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-700 disabled:opacity-40"
                                                                >
                                                                    {isCurrentProcessing ? (
                                                                        <RefreshCw
                                                                            size={
                                                                                12
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <CheckCircle2
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    )}
                                                                    Valider
                                                                </button>
                                                                <button
                                                                    disabled={
                                                                        !!processingId
                                                                    }
                                                                    onClick={() =>
                                                                        handleAction(
                                                                            transaction.id,
                                                                            'rejeter',
                                                                        )
                                                                    }
                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-all duration-150 hover:bg-red-50 disabled:opacity-40"
                                                                >
                                                                    {isCurrentProcessing ? (
                                                                        <RefreshCw
                                                                            size={
                                                                                12
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <XCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    )}
                                                                    Rejeter
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">
                                                                Opération
                                                                archivée
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>

                                                {/* SOUS-PANNEAU DÉPLIABLE DE DÉTAILS AVANCÉS */}
                                                {isExpanded && (
                                                    <tr className="bg-gray-50/50">
                                                        <td
                                                            colSpan="8"
                                                            className="border-t border-b border-gray-100 p-5"
                                                        >
                                                            <div className="grid grid-cols-1 gap-6 rounded-xl border border-gray-200/60 bg-white p-4 shadow-inner md:grid-cols-3">
                                                                <div className="space-y-1.5">
                                                                    <span className="block text-xs font-medium text-gray-400">
                                                                        Détails
                                                                        de
                                                                        l'infrastructure
                                                                    </span>
                                                                    <p className="text-xs text-gray-800">
                                                                        <span className="font-semibold">
                                                                            Référence
                                                                            transaction:
                                                                        </span>{' '}
                                                                        {
                                                                            transaction.reference_unique
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-800">
                                                                        <span className="font-semibold">
                                                                            Description:
                                                                        </span>{' '}
                                                                        {transaction.description ||
                                                                            'Aucune description fournie'}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <span className="block text-xs font-medium text-gray-400">
                                                                        Flux des
                                                                        Comptes
                                                                    </span>
                                                                    <p className="text-xs text-gray-800">
                                                                        <span className="font-semibold">
                                                                            Débiteur
                                                                            (Source):
                                                                        </span>{' '}
                                                                        {transaction
                                                                            .compte
                                                                            ?.numero_compte ||
                                                                            '—'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-800">
                                                                        <span className="font-semibold">
                                                                            Créditeur
                                                                            (Destinataire):
                                                                        </span>{' '}
                                                                        {transaction.compteDestination ||
                                                                            '—'}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <span className="block text-xs font-medium text-gray-400">
                                                                        Audit
                                                                        Temporel
                                                                        &
                                                                        Traçabilité
                                                                    </span>
                                                                    <p className="text-xs text-gray-800">
                                                                        <span className="font-semibold">
                                                                            Date
                                                                            d'émission:
                                                                        </span>{' '}
                                                                        {transaction.created_at ||
                                                                            'Date inconnue'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-800">
                                                                        <span className="font-semibold">
                                                                            Niveau
                                                                            d'approbation:
                                                                        </span>{' '}
                                                                        {auth
                                                                            ?.user
                                                                            ?.name ??
                                                                            'Client Unique'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-0">
                                            <EmptyState />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* STRUCTURE RESPONSIVE CARDS (MOBILE & TABLETTES EN MODE PORTRAIT) */}
                    <div className="block divide-y divide-gray-100 lg:hidden">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => {
                                const isCurrentProcessing =
                                    processingId === transaction.id;
                                const isTransfer =
                                    transaction.type?.toLowerCase() ===
                                        'transfer' ||
                                    transaction.type?.toLowerCase() ===
                                        'virement';

                                return (
                                    <div
                                        key={transaction.id}
                                        className="space-y-4 bg-white p-4 transition-all hover:bg-gray-50/30"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-gray-900">
                                                {transaction.reference_unique}
                                            </span>
                                            {isTransfer ? (
                                                <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                    Virement
                                                </span>
                                            ) : (
                                                <span className="rounded-md border border-orange-100 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                                                    Retrait
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="block text-gray-400">
                                                    Compte Source
                                                </span>
                                                <span className="font-medium text-gray-700">
                                                    {transaction.compte_source ||
                                                        '—'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-gray-400">
                                                    Montant global
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(
                                                        transaction.montant,
                                                        transaction,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                                            <span className="text-xs text-gray-400">
                                                {transaction.created_at
                                                    ? new Date(
                                                          transaction.created_at,
                                                      ).toLocaleDateString(
                                                          'fr-FR',
                                                      )
                                                    : '—'}
                                            </span>

                                            {transaction.statut?.toLowerCase() ===
                                            'en_attente' ? (
                                                <div className="flex gap-1.5">
                                                    <button
                                                        disabled={
                                                            !!processingId
                                                        }
                                                        onClick={() =>
                                                            handleAction(
                                                                transaction.id,
                                                                'valider',
                                                            )
                                                        }
                                                        className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white"
                                                    >
                                                        {isCurrentProcessing ? (
                                                            <RefreshCw
                                                                size={10}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <CheckCircle2
                                                                size={10}
                                                            />
                                                        )}
                                                        Valider
                                                    </button>
                                                    <button
                                                        disabled={
                                                            !!processingId
                                                        }
                                                        onClick={() =>
                                                            handleAction(
                                                                transaction.id,
                                                                'rejeter',
                                                            )
                                                        }
                                                        className="flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600"
                                                    >
                                                        {isCurrentProcessing ? (
                                                            <RefreshCw
                                                                size={10}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <XCircle
                                                                size={10}
                                                            />
                                                        )}
                                                        Rejeter
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-400 capitalize">
                                                    {transaction.statut}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

{
    /* COMPOSANT INTERNE : ÉTAT VIDE (EMPTY STATE) */
}
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-4 rounded-full border border-gray-100 bg-gray-50 p-4 text-gray-400">
                <Inbox size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
                Flux de validation vierge
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-400">
                Aucune transaction ne requiert votre approbation réglementaire
                pour le moment.
            </p>
        </div>
    );
}
