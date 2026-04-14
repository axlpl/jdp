import type { JsonApiResource } from './jsonapi';

export interface ClaimStatusDto {
    code: string;
    name: string;
}

export interface ClaimCreateAttributesDto {
    policyNumber: string;
    lossDate: string;
    lossCause: string;
    productCode: string;
    accountHolderName: string;
    vehicleDescription: string;
    licensePlate: string;
    policyEffectiveDate: string;
    policyExpirationDate: string;
}

export interface ClaimResourceAttributesDto {
    claimNumber: string;
    lossDate: string;
    lossCause: string;
    claimStatus?: ClaimStatusDto;
}

export type ClaimResourceDto = JsonApiResource<
    ClaimResourceAttributesDto,
    'Claim'
>;

export interface ClaimCreateRequestDto {
    data: { attributes: ClaimCreateAttributesDto };
}
