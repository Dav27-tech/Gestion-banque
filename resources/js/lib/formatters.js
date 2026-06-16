/**
 * Utilitaires pour le formatage
 */

/**
 * Formater un nombre en devise
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Formater une date
 * @param {Date | string} date
 * @param {string} format
 * @returns {string}
 */
export const formatDate = (date, format = 'dd/MM/yyyy') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format.replace('yyyy', year).replace('MM', month).replace('dd', day);
};

/**
 * Formater une heure
 * @param {Date | string} date
 * @returns {string}
 */
export const formatTime = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * Formater un numéro de compte
 * @param {string} accountNumber
 * @returns {string}
 */
export const formatAccountNumber = (accountNumber) => {
    return accountNumber.slice(0, 4) + ' **** **** ' + accountNumber.slice(-4);
};
