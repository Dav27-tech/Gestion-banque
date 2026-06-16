import { useCallback, useState } from 'react';

/**
 * Hook pour gérer les états de requête (loading, error, success)
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   isSuccess: boolean,
 *   setLoading: Function,
 *   setError: Function,
 *   setSuccess: Function,
 *   reset: Function
 * }}
 */
export const useRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setIsSuccess(false);
    }, []);

    return {
        isLoading,
        error,
        isSuccess,
        setLoading: setIsLoading,
        setError,
        setSuccess: setIsSuccess,
        reset,
    };
};
