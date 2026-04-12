import { useCallback, useState } from 'react';

export const useFormValidation = () => {
    const [invalidFields, setInvalidFields] = useState([]);

    const onValidationChange = useCallback((isValid, path) => {
        setInvalidFields(fields =>
            isValid ? fields.filter(field => field !== path) : [...fields, path]
        );
    }, []);

    const isFormValid = invalidFields.length === 0;

    return { isFormValid, onValidationChange };
};
