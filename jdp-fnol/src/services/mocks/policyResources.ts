import type {
    PolicyContactDto,
    PolicyLocationDto,
    VehicleRiskUnitDto,
} from '../../types/dto/policy';

const locations = (
    entries: Array<{
        id: string;
        num: string;
        line1: string;
        city: string;
        state?: string;
        postal: string;
        country?: string;
    }>
): PolicyLocationDto[] =>
    entries.map((e, idx) => ({
        type: 'PolicyLocation',
        id: e.id,
        attributes: {
            locationNumber: e.num,
            primaryLocation: idx === 0,
            displayName: `${e.line1}, ${e.city}`,
            address: {
                addressLine1: e.line1,
                city: e.city,
                state: e.state
                    ? { id: e.state, displayName: e.state }
                    : undefined,
                postalCode: e.postal,
                country: e.country ?? 'US',
                displayName: `${e.line1}, ${e.city}`,
            },
        },
    }));

const vehicles = (
    entries: Array<{
        id: string;
        year: number;
        make: string;
        model: string;
        vin: string;
        plate: string;
    }>
): VehicleRiskUnitDto[] =>
    entries.map((e, idx) => ({
        type: 'VehicleRiskUnit',
        id: e.id,
        attributes: {
            RUNumber: idx + 1,
            description: `${e.year} ${e.make} ${e.model} · ${e.plate}`,
            vehicleId: e.id,
            vehicle: {
                year: e.year,
                make: e.make,
                model: e.model,
                vin: e.vin,
                licensePlate: e.plate,
                displayName: `${e.year} ${e.make} ${e.model}`,
            },
        },
    }));

const contacts = (
    entries: Array<{
        id: string;
        first: string;
        last: string;
        email: string;
        phone: string;
        license: string;
    }>
): PolicyContactDto[] =>
    entries.map(e => ({
        type: 'PolicyContact',
        id: e.id,
        attributes: {
            displayName: `${e.first} ${e.last}`,
            firstName: e.first,
            lastName: e.last,
            emailAddress1: e.email,
            cellPhone: e.phone,
            licenseNumber: e.license,
        },
    }));

export const MOCK_LOCATIONS_BY_POLICY: Record<string, PolicyLocationDto[]> = {
    '10001A01': locations([
        {
            id: 'pc:loc:A01:1',
            num: '1',
            line1: '221B Baker Street',
            city: 'London',
            postal: 'NW1 6XE',
            country: 'GB',
        },
        {
            id: 'pc:loc:A01:2',
            num: '2',
            line1: '1 Infinite Loop',
            city: 'Cupertino',
            state: 'CA',
            postal: '95014',
        },
    ]),
    '10001P01': locations([
        {
            id: 'pc:loc:P01:1',
            num: '1',
            line1: '350 Fifth Avenue',
            city: 'New York',
            state: 'NY',
            postal: '10118',
        },
    ]),
    '10001A02': locations([
        {
            id: 'pc:loc:A02:1',
            num: '1',
            line1: '1600 Amphitheatre Parkway',
            city: 'Mountain View',
            state: 'CA',
            postal: '94043',
        },
        {
            id: 'pc:loc:A02:2',
            num: '2',
            line1: '500 Oracle Parkway',
            city: 'Redwood City',
            state: 'CA',
            postal: '94065',
        },
    ]),
};

export const MOCK_VEHICLES_BY_POLICY: Record<string, VehicleRiskUnitDto[]> = {
    '10001A01': vehicles([
        {
            id: 'pc:veh:A01:1',
            year: 2022,
            make: 'Honda',
            model: 'Civic',
            vin: '1HGBH41JXMN109186',
            plate: 'ABC-1234',
        },
        {
            id: 'pc:veh:A01:2',
            year: 2020,
            make: 'Tesla',
            model: 'Model 3',
            vin: '5YJ3E1EA7LF612345',
            plate: 'EV-777',
        },
    ]),
    '10001P01': vehicles([
        {
            id: 'pc:veh:P01:1',
            year: 2019,
            make: 'Toyota',
            model: 'RAV4',
            vin: 'JTMBFREV1KD123456',
            plate: 'XYZ-9876',
        },
    ]),
    '10001A02': vehicles([
        {
            id: 'pc:veh:A02:1',
            year: 2015,
            make: 'Ford',
            model: 'F-150',
            vin: '1FTFW1ET5FFB12345',
            plate: 'JDP-0420',
        },
    ]),
};

export const MOCK_CONTACTS_BY_POLICY: Record<string, PolicyContactDto[]> = {
    '10001A01': contacts([
        {
            id: 'pc:con:A01:1',
            first: 'John',
            last: 'Smith',
            email: 'john.smith@example.com',
            phone: '+44 20 7946 0958',
            license: 'SMITH-JN-8461',
        },
        {
            id: 'pc:con:A01:2',
            first: 'Jane',
            last: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+44 20 7946 0102',
            license: 'SMITH-JE-3354',
        },
    ]),
    '10001P01': contacts([
        {
            id: 'pc:con:P01:1',
            first: 'Maria',
            last: 'Garcia',
            email: 'maria.garcia@example.com',
            phone: '+1 212 555 0144',
            license: 'GARCIA-M-7781',
        },
    ]),
    '10001A02': contacts([
        {
            id: 'pc:con:A02:1',
            first: 'Chen',
            last: 'Wei',
            email: 'chen.wei@example.com',
            phone: '+1 650 555 0177',
            license: 'WEI-C-2214',
        },
        {
            id: 'pc:con:A02:2',
            first: 'Sarah',
            last: 'Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1 650 555 0188',
            license: 'JOHNSON-S-9930',
        },
    ]),
};
