/**
 * Utilitaire pour effectuer des requêtes HTTP
 * Compatible avec Inertia.js et Axios
 */

/**
 * Effectuer une requête GET
 * @param {string} url
 * @returns {Promise}
 */
export const get = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    }).then((res) => res.json());
};

/**
 * Effectuer une requête POST
 * @param {string} url
 * @param {Object} data
 * @returns {Promise}
 */
export const post = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

/**
 * Effectuer une requête PUT
 * @param {string} url
 * @param {Object} data
 * @returns {Promise}
 */
export const put = (url, data) => {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

/**
 * Effectuer une requête DELETE
 * @param {string} url
 * @returns {Promise}
 */
export const delete_ = (url) => {
    return fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }).then((res) => res.json());
};

export const apiClient = {
    get,
    post,
    put,
    delete: delete_,
};
