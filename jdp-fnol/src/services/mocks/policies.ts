import type { PolicyResourceDto } from '../../types/dto/policy';
import { addMonths, addYears, nowIso } from '../../utils/date';

const in12Months = addYears(nowIso(), 1);
const monthsAgo = (months: number): string => addMonths(nowIso(), -months);

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
