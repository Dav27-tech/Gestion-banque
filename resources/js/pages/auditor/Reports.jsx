import { Head } from '@inertiajs/react';

/**
 * Page de rapports pour les auditeurs
 * @param {{
 *   report_data: Object,
 *   date_range: { start: string, end: string },
 *   summary: Object
 * }} props
 */
export default function Reports({ report_data, date_range, summary }) {
    return (
        <>
            <Head title="Rapports" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Rapports Financiers</h1>
                    <p className="text-gray-600">
                        Rapports et analyses pour l'audit
                    </p>
                </div>

                {/* Contenu à implémenter */}
                <div className="rounded-lg border p-6">
                    <p className="text-center text-gray-500">
                        Rapports à implémenter
                    </p>
                </div>
            </div>
        </>
    );
}
