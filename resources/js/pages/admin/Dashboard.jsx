import { Head } from '@inertiajs/react';

/**
 * Page Dashboard Admin
 * @param {{
 *   users_count: number,
 *   clients_count: number,
 *   accounts_count: number,
 *   total_balance: number,
 *   recent_transactions: Array<Transaction>,
 *   system_health: Object
 * }} props
 */
export default function Dashboard({
    users_count,
    clients_count,
    accounts_count,
    total_balance,
    recent_transactions,
    system_health,
}) {
    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                    <p className="text-gray-600">Vue d'ensemble du système</p>
                </div>

                {/* Statistiques à implémenter */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border p-6">
                        <p className="text-gray-600">Utilisateurs</p>
                        <p className="text-3xl font-bold">{users_count}</p>
                    </div>
                    <div className="rounded-lg border p-6">
                        <p className="text-gray-600">Clients</p>
                        <p className="text-3xl font-bold">{clients_count}</p>
                    </div>
                    <div className="rounded-lg border p-6">
                        <p className="text-gray-600">Comptes</p>
                        <p className="text-3xl font-bold">{accounts_count}</p>
                    </div>
                    <div className="rounded-lg border p-6">
                        <p className="text-gray-600">Solde total</p>
                        <p className="text-3xl font-bold">€{total_balance}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
