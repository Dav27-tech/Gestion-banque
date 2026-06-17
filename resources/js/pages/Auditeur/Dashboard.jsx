import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    // Récupération des statistiques comptables et des écritures fournies par l'AuditeurController
    const { transactions, stats } = usePage().props;

    const déclencherImpression = () => {
        window.print();
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', color: '#111827', fontFamily: 'sans-serif' }}>
            <Head title="Contrôle Interne & Audit Financier" />

            {/* STYLE INJECTÉ POUR LA MISE EN PAGE DE L'IMPRESSION DIRECTE SANS FRAMEWORK */}
            <style>{`
                @media print {
                    body { background-color: #ffffff; color: #000000; padding: 0; margin: 0; }
                    .zone-boutons, .bouton-deconnexion { display: none !important; }
                    .carte-stat { border: 1px solid #000000 !important; box-shadow: none !important; }
                    .conteneur-audit { padding: 0 !important; }
                    table { width: 100% !important; page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                }
            `}</style>

            <div className="conteneur-audit">
                {/* ZONE D'ENTÊTE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Rapport d'Audit Comptable</h2>
                        <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Situation des liquidités de la banque et traçabilité des opérations.</p>
                    </div>
                    
                    <div className="zone-boutons" style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={déclencherImpression}
                            style={{ padding: '10px 18px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            🖨️ Imprimer le Rapport (PDF)
                        </button>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Déconnexion
                        </Link>
                    </div>
                </div>

                {/* BLOCS DE STATISTIQUES GLOBAL - MASSES MONÉTAIRES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
                    <div className="carte-stat" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Encaisse Totale (USD)</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af', margin: '8px 0 0 0' }}>{parseFloat(stats.masse_monetaire_usd).toFixed(2)} $</h3>
                    </div>

                    <div className="carte-stat" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Encaisse Totale (CDF)</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0d9488', margin: '8px 0 0 0' }}>{parseFloat(stats.masse_monetaire_cdf).toFixed(2)} FC</h3>
                    </div>

                    <div className="carte-stat" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Intérêts Distribués (USD)</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f46e5', margin: '8px 0 0 0' }}>{parseFloat(stats.interets_usd).toFixed(2)} $</h3>
                    </div>

                    <div className="carte-stat" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase' }}>Total Comptes Ouverts</span>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{stats.comptes_courant + stats.comptes_epargne} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>({stats.comptes_epargne} Épargnes)</span></h3>
                    </div>
                </div>

                {/* TABLEAU CENTRAL DE TRAÇABILITÉ DES ÉCRITURES */}
                <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>Journal Général des Mouvements Comptables ({stats.total_operations} écritures)</h3>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563', fontSize: '13px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '10px' }}>Date & Réf Unique</th>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th style={{ padding: '10px' }}>Compte Concerné</th>
                                <th style={{ padding: '10px' }}>Montant</th>
                                <th style={{ padding: '10px' }}>Opérateur (Caissier/Système)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '14px' }}>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{ fontWeight: 'bold', display: 'block' }}>{tx.reference_unique}</span>
                                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(tx.created_at).toLocaleString()}</span>
                                    </td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{ 
                                            fontSize: '11px', 
                                            fontWeight: 'bold', 
                                            textTransform: 'uppercase',
                                            color: tx.type === 'depot' ? '#166534' : tx.type === 'retrait' ? '#991b1b' : '#92400e'
                                        }}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <strong>{tx.compte?.numero_compte}</strong>
                                        <span style={{ display: 'block', fontSize: '12px', color: '#6b7280' }}>
                                            Client : {tx.compte?.client?.nom} {tx.compte?.client?.prenom}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px', fontWeight: 'bold', fontSize: '15px', color: tx.type === 'depot' ? '#16a34a' : '#dc2626' }}>
                                        {tx.type === 'depot' ? '+' : '-'} {parseFloat(tx.montant).toFixed(2)} {tx.compte?.devise}
                                    </td>
                                    <td style={{ padding: '12px 10px', color: '#4b5563' }}>
                                        {tx.caissier ? tx.caissier.name : 'SYSTÈME (Intérêts)'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}