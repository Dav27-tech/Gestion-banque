import { Head, router } from '@inertiajs/react';

/**
 * Page de transactions pour les Cashiers
 * @param {{
 *   transactions: Array<Transaction>,
 *   accounts: Array<Compte>,
 *   total: number,
 *   per_page: number,
 *   current_page: number
 * }} props
 */
export default function Transactions({
    transactions,
    accounts,
    total,
    per_page,
    current_page,
}) {
    return (
        <>
            <Head title="Transactions" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Transactions</h1>
                    <a href="/transactions/create" className="btn btn-primary">
                        Nouvelle transaction
                    </a>
                </div>

                {/* Contenu à implémenter */}
                <div className="rounded-lg border p-6">
                    <p className="text-center text-gray-500">
                        Liste des transactions à implémenter
                    </p>
                </div>
            </div>
        </>
    );
}
