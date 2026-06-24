import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Page de liste des clients (Manager)
 * @param {{
 *   clients: Array<Client & { accounts: Array<Compte> }>,
 *   total: number,
 *   per_page: number,
 *   current_page: number
 * }} props
 */
export default function ClientsList({
    clients,
    total,
    per_page,
    current_page,
}) {
    const [search, setSearch] = useState('');

    const handleDelete = (clientId) => {
        if (confirm('Êtes-vous sûr?')) {
            router.delete(`/clients/${clientId}`);
        }
    };

    return (
        <>
            <Head title="Clients" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Clients</h1>
                    <a
                        href="/clients/create"
                        className="rounded-xl bg-[#7A1C1C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#410f0f]"
                    >
                        Ajouter un client
                    </a>
                </div>

                {/* Contenu à implémenter */}
                <div className="rounded-lg border p-6">
                    <p className="text-center text-gray-500">
                        Liste des clients à implémenter
                    </p>
                </div>
            </div>
        </>
    );
}
