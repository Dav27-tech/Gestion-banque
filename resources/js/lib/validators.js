/**
 * Utilitaires de validation
 */

/**
 * Valider un email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valider un numéro de téléphone
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone);
};

/**
 * Valider un IBAN
 * @param {string} iban
 * @returns {boolean}
 */
export const isValidIBAN = (iban) => {
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
    return regex.test(iban.replace(/\s/g, ''));
};

/**
 * Valider un montant
 * @param {number} amount
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export const isValidAmount = (amount, min = 0, max = Infinity) => {
    return amount >= min && amount <= max && amount > 0;
};
