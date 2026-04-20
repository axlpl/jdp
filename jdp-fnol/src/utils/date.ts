export type IsoDate = string;

export const parseIso = (iso: IsoDate): Date => new Date(iso);

export const nowIso = (): IsoDate => new Date().toISOString();

export const currentYear = (): number => new Date().getFullYear();

export const startOfDayTs = (iso: IsoDate): number => {
    const d = parseIso(iso);

    d.setHours(0, 0, 0, 0);

    return d.getTime();
};

export const todayStartTs = (): number => startOfDayTs(nowIso());

export const isExpired = (iso: IsoDate | null | undefined): boolean => {
    if (!iso) {
        return false;
    }
    const end = parseIso(iso).getTime();

    return !Number.isNaN(end) && end < Date.now();
};

export const addYears = (iso: IsoDate, years: number): IsoDate => {
    const d = parseIso(iso);

    d.setFullYear(d.getFullYear() + years);

    return d.toISOString();
};

export const addMonths = (iso: IsoDate, months: number): IsoDate => {
    const d = parseIso(iso);

    d.setMonth(d.getMonth() + months);

    return d.toISOString();
};

export const formatDate = (iso: IsoDate | null | undefined): string => {
    if (!iso) {
        return '';
    }

    return parseIso(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/** @deprecated use startOfDayTs */
export const startOfDay = startOfDayTs;
