import type { JsonApiResource } from './jsonapi';

export interface SimpleReferenceDto {
    id: string;
    displayName?: string;
    type?: string;
}

export interface PolicyAddressDto {
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    state?: SimpleReferenceDto;
    postalCode?: string;
    county?: string;
    country?: string;
    displayName?: string;
}

export interface PolicyAttributesDto {
    policyNumber: string;
    product: SimpleReferenceDto;
    primaryInsured?: SimpleReferenceDto;
    periodStart: string;
    periodEnd: string;
}

export type PolicyResourceDto = JsonApiResource<PolicyAttributesDto, 'Policy'>;

export interface PolicyLocationAttributesDto {
    locationNumber?: string;
    displayName?: string;
    primaryLocation?: boolean;
    address?: PolicyAddressDto;
}

export type PolicyLocationDto = JsonApiResource<
    PolicyLocationAttributesDto,
    'PolicyLocation'
>;

export interface PolicyVehicleReferenceDto {
    year?: number;
    make?: string;
    model?: string;
    vin?: string;
    licensePlate?: string;
    displayName?: string;
}

export interface VehicleRiskUnitAttributesDto {
    RUNumber?: number;
    description?: string;
    vehicleId?: string;
    vehicle?: PolicyVehicleReferenceDto;
    vehicleLocation?: SimpleReferenceDto;
}

export type VehicleRiskUnitDto = JsonApiResource<
    VehicleRiskUnitAttributesDto,
    'VehicleRiskUnit'
>;

export interface PolicyContactAttributesDto {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    emailAddress1?: string;
    cellPhone?: string;
    homePhone?: string;
    licenseNumber?: string;
    licenseState?: SimpleReferenceDto;
    dateOfBirth?: string;
    contactRoles?: Array<{ role?: SimpleReferenceDto }>;
}

export type PolicyContactDto = JsonApiResource<
    PolicyContactAttributesDto,
    'PolicyContact'
>;
