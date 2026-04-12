import { useCallback, useState } from 'react';
import { set } from 'lodash';

export const useFormData = data => {
    const [formData, setFormData] = useState(data);

    const onValueChange = useCallback((value, path) => {
        setFormData(previousState => set({ ...previousState }, path, value));
    }, []);

    return {
        formData,
        onValueChange,
    };
};
