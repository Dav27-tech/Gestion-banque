/**
 * Types d'interface utilisateur
 * @typedef {{
 *   children: import('react').ReactNode,
 *   breadcrumbs?: Array<{title: string, href: string}>
 * }} AppLayoutProps
 */

/**
 * @typedef {'header' | 'sidebar'} AppVariant
 */

/**
 * @typedef {{
 *   type: 'success' | 'info' | 'warning' | 'error',
 *   message: string
 * }} FlashToast
 */

/**
 * @typedef {{
 *   children?: import('react').ReactNode,
 *   name?: string,
 *   title?: string,
 *   description?: string
 * }} AuthLayoutProps
 */

export const UITypes = {};
