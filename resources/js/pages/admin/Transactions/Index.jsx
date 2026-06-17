import React from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';

export default function Index() {
    // 1. Récupération des données fournies par le TransactionController
    const { transactions, comptes } = usePage().props;

    // 2. Initialisation du formulaire Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        compte_id: '',
        type: 'depot',
        montant: '',
        compte_destination_id: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/transactions', {
            onSuccess: () => reset('montant', 'compte_destination_id', 'description'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Guichet des Opérations" />

            <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Guichet des Opérations</h2>
                <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Effectuez des dépôts, des retraits ou des virements inter-comptes en temps réel.</p>
            </div>

            {errors.error && (
                <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '20px', fontWeight: '500' }}>
                    {errors.error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* FORM */}
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>Nouvelle Opération</h3>
                    <form onSubmit={handleSubmit}>{/* form unchanged */}</form>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>Journal des Transactions ({transactions?.length || 0})</h3>
                    <div style={{ overflowX: 'auto' }}>{/* table unchanged */}</div>
                </div>
            </div>
        </AdminLayout>
    );
}