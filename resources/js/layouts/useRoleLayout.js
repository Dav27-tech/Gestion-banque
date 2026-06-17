import { usePage } from '@inertiajs/react';
import AdminLayout from './AdminLayout';
import ManagerLayout from './ManagerLayout';
import CashierLayout from './CashierLayout';

/**
 * Returns the appropriate layout component based on the authenticated user's role.
 */
export function useRoleLayout() {
    const role = usePage().props.auth?.user?.role;

    if (role === 'gestionnaire') {
        return ManagerLayout;
    }

    if (role === 'caissier') {
        return CashierLayout;
    }

    return AdminLayout;
}
