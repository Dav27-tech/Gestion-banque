import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Page de liste des comptes bancaires
 * @param {{
 *   accounts: Array<Compte & { client: Client }>,
 *   total: number,
 *   per_page: number,
 *   current_page: number
 * }} props
 */
export default function AccountsList({
    accounts,
    total,
    per_page,
    current_page,
}) {
    const [filter, setFilter] = useState('');

    return (
        <>
            <Head title="Comptes Bancaires" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Comptes Bancaires</h1>
                    <a href="/accounts/create" className="btn btn-primary">
                        Nouveau compte
                    </a>
                </div>

                {/* Contenu à implémenter */}
                <div className="rounded-lg border p-6">
                    <p className="text-center text-gray-500">
                        Liste des comptes à implémenter
                    </p>
                </div>
            </div>
        </>
    );
}
