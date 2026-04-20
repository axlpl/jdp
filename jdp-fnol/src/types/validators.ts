export const MAX_LEN = {
    addressLine: 60,
    city: 60,
    postalCode: 60,
    vehicleMake: 40,
    vehicleModel: 60,
    vehicleVin: 40,
    vehiclePlate: 40,
    contactFirstName: 100,
    contactLastName: 155,
    contactEmail: 60,
    contactLicense: 20,
} as const;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const YEAR_RE = /^\d{4}$/;

export const isNonEmpty = (s: string | null | undefined): boolean =>
    Boolean(s && s.trim().length > 0);

export const isEmailOrEmpty = (s: string | null | undefined): boolean =>
    !s || EMAIL_RE.test(s.trim());

export const isYearOrEmpty = (s: string | null | undefined): boolean => {
    if (!s) {
        return true;
    }
    if (!YEAR_RE.test(s.trim())) {
        return false;
    }
    const n = Number.parseInt(s, 10);

    return n >= 1900 && n <= new Date().getFullYear() + 1;
};

export const withinLength = (
    s: string | null | undefined,
    max: number
): boolean => !s || s.length <= max;
