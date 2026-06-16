/**
 * Modèles de données du Client
 * @typedef {{
 *   id: number,
 *   user_id: number,
 *   name: string,
 *   email: string,
 *   phone: string,
 *   address: string,
 *   city: string,
 *   postal_code: string,
 *   country: string,
 *   tax_id: string,
 *   created_at: string,
 *   updated_at: string
 * }} Client
 */

/**
 * Modèle de données du Compte
 * @typedef {{
 *   id: number,
 *   client_id: number,
 *   account_number: string,
 *   account_type: 'checking' | 'savings' | 'investment',
 *   balance: number,
 *   currency: string,
 *   status: 'active' | 'inactive' | 'frozen',
 *   created_at: string,
 *   updated_at: string
 * }} Compte
 */

/**
 * Modèle de données de Transaction
 * @typedef {{
 *   id: number,
 *   account_id: number,
 *   transaction_type: 'debit' | 'credit',
 *   amount: number,
 *   description: string,
 *   date: string,
 *   status: 'pending' | 'completed' | 'failed',
 *   created_at: string,
 *   updated_at: string
 * }} Transaction
 */

export const DataModels = {};
