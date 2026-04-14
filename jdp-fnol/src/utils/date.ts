export const formatDate = (iso: string | null | undefined): string => {
    if (!iso) {
        return '';
    }

    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const startOfDay = (iso: string): number => {
    const d = new Date(iso);

    d.setHours(0, 0, 0, 0);

    return d.getTime();
};
