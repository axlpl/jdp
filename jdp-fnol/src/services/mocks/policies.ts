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

const productPA = { code: 'PersonalAuto', name: 'Personal Auto' };
const holder = { displayName: 'John Smith' };
const periodInForce = { code: 'Bound', name: 'In Force' };

export const MOCK_POLICY_DTOS: PolicyResourceDto[] = [
    {
        type: 'Policy',
        id: 'pc:10001A01',
        attributes: {
            policyNumber: '10001A01',
            product: productPA,
            primaryInsured: holder,
            vehicle: {
                description: '2022 Honda Civic',
                licensePlate: 'ABC-1234',
            },
            periodStart: monthsAgo(8),
            periodEnd: in12Months,
            periodStatus: periodInForce,
        },
    },
    {
        type: 'Policy',
        id: 'pc:10001P01',
        attributes: {
            policyNumber: '10001P01',
            product: productPA,
            primaryInsured: holder,
            vehicle: {
                description: '2019 Toyota RAV4',
                licensePlate: 'XYZ-9876',
            },
            periodStart: monthsAgo(4),
            periodEnd: in12Months,
            periodStatus: periodInForce,
        },
    },
    {
        type: 'Policy',
        id: 'pc:10001A02',
        attributes: {
            policyNumber: '10001A02',
            product: productPA,
            primaryInsured: holder,
            vehicle: {
                description: '2015 Ford F-150',
                licensePlate: 'JDP-0420',
            },
            periodStart: monthsAgo(11),
            periodEnd: in12Months,
            periodStatus: periodInForce,
        },
    },
];
