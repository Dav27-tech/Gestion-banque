import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combiner des classes Tailwind CSS avec merging
 * @param {...import('clsx').ClassValue[]} inputs
 * @returns {string}
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Convertir une URL Inertia en string
 * @param {string | Object} url
 * @returns {string}
 */
export function toUrl(url) {
    return typeof url === 'string' ? url : url.url;
}
