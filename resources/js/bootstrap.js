import axios from 'axios';

// On vérifie si on est bien sur un navigateur avant d'utiliser 'window'
if (typeof window !== 'undefined') {
    window.axios = axios;
    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}

export default axios;
