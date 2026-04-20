import type { PolicyResourceDto } from '../../types/dto/policy';

const in12Months = (() => {
    const d = new Date();

    d.setFullYear(d.getFullYear() + 1);

    return d.toISOString();
})();

const monthsAgo = (months: number): string => {
    const d = new Date();

    d.setMonth(d.getMonth() - months);

    return d.toISOString();
};

const holder = {
    id: 'pc:contact:1001',
    displayName: 'John Smith',
    type: 'Contact',
};

const personalAutoProduct = {
    id: 'PersonalAuto',
    displayName: 'Personal Auto',
    type: 'Product',
};

export const MOCK_POLICY_DTOS: PolicyResourceDto[] = [
    {
        type: 'Policy',
        id: 'pc:10001A01',
        attributes: {
            policyNumber: '10001A01',
            product: personalAutoProduct,
            primaryInsured: holder,
            periodStart: monthsAgo(8),
            periodEnd: in12Months,
        },
    },
    {
        type: 'Policy',
        id: 'pc:10001P01',
        attributes: {
            policyNumber: '10001P01',
            product: personalAutoProduct,
            primaryInsured: holder,
            periodStart: monthsAgo(4),
            periodEnd: in12Months,
        },
    },
    {
        type: 'Policy',
        id: 'pc:10001A02',
        attributes: {
            policyNumber: '10001A02',
            product: personalAutoProduct,
            primaryInsured: holder,
            periodStart: monthsAgo(11),
            periodEnd: in12Months,
        },
    },
];
