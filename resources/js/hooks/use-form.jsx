import { useCallback, useState } from 'react';

/**
 * Hook pour gérer les états de formulaire
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @returns {{
 *   values: Object,
 *   errors: Object,
 *   touched: Object,
 *   setFieldValue: Function,
 *   setFieldTouched: Function,
 *   handleChange: Function,
 *   handleBlur: Function,
 *   resetForm: Function,
 *   setErrors: Function
 * }}
 */
export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const setFieldValue = useCallback((field, value) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const setFieldTouched = useCallback((field) => {
        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));
    }, []);

    const handleChange = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;
            setFieldValue(name, type === 'checkbox' ? checked : value);
        },
        [setFieldValue],
    );

    const handleBlur = useCallback(
        (e) => {
            const { name } = e.target;
            setFieldTouched(name);
        },
        [setFieldTouched],
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        handleChange,
        handleBlur,
        resetForm,
        setErrors,
    };
};
