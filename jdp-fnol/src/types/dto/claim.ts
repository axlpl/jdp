import type { JsonApiResource } from './jsonapi';

export interface TypeKeyReferenceDto {
    code: string;
    name?: string;
}

export interface ClaimAddressDto {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    displayName?: string;
}

export interface ClaimCreateAttributesDto {
    policyNumber: string;
    lossDate: string;
    lossCause: TypeKeyReferenceDto;
    description?: string;
    lossLocation?: ClaimAddressDto;
}

export interface ClaimResourceAttributesDto {
    claimNumber: string;
    policyNumber?: string;
    lossDate: string;
    lossCause?: TypeKeyReferenceDto;
    claimStatus?: TypeKeyReferenceDto;
    description?: string;
    lossLocation?: ClaimAddressDto;
    updateTime?: string;
}

export type ClaimResourceDto = JsonApiResource<
    ClaimResourceAttributesDto,
    'Claim'
>;

export interface ClaimCreateRequestDto {
    data: { attributes: ClaimCreateAttributesDto };
}

export interface ClaimUpdateRequestDto {
    data: { attributes: Partial<ClaimCreateAttributesDto> };
}

export interface ClaimSubmitRequestDto {
    data: { attributes: Record<string, never> };
}
