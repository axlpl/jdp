import type { AddressInput, DriverInput, VehicleInput } from './domain';

export const EMPTY_ADDRESS: AddressInput = {
    addressLine1: '',
    addressLine2: null,
    city: '',
    state: null,
    postalCode: '',
    country: null,
};

export const EMPTY_VEHICLE: VehicleInput = {
    year: '',
    make: '',
    model: '',
    vin: '',
    licensePlate: '',
};

export const EMPTY_DRIVER: DriverInput = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licenseNumber: '',
};

export const isAddressFilled = (a: AddressInput): boolean =>
    Boolean(a.addressLine1.trim() || a.city.trim());

export const isVehicleFilled = (v: VehicleInput): boolean =>
    Boolean(v.make.trim() || v.model.trim() || v.vin.trim());

export const isDriverFilled = (d: DriverInput): boolean =>
    Boolean(d.firstName.trim() || d.lastName.trim());
