import type { JsonApiResource } from './jsonapi';

export interface ProductRefDto {
    code: string;
    name: string;
}

export interface ContactRefDto {
    displayName: string;
}

export interface PeriodStatusDto {
    code: string;
    name: string;
}

export interface VehicleDto {
    description: string;
    licensePlate: string;
}

export interface PolicyAttributesDto {
    policyNumber: string;
    product: ProductRefDto;
    primaryInsured: ContactRefDto;
    vehicle: VehicleDto;
    periodStart: string;
    periodEnd: string;
    periodStatus: PeriodStatusDto;
}

export type PolicyResourceDto = JsonApiResource<PolicyAttributesDto, 'Policy'>;
