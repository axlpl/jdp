import type { JsonApiResource } from './jsonapi';

export interface SimpleReferenceDto {
    id: string;
    displayName?: string;
    type?: string;
}

export interface PolicyAttributesDto {
    policyNumber: string;
    product: SimpleReferenceDto;
    primaryInsured?: SimpleReferenceDto;
    periodStart: string;
    periodEnd: string;
}

export type PolicyResourceDto = JsonApiResource<PolicyAttributesDto, 'Policy'>;
