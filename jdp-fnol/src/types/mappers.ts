import type {
    ClaimCreateAttributesDto,
    ClaimResourceDto,
} from './dto/claim';
import type { PolicyResourceDto } from './dto/policy';
import type { TypecodeDto } from './dto/typelist';
import type {
    ClaimReceipt,
    LossCause,
    Policy,
    PolicyStatus,
} from './domain';

const normaliseStatus = (statusName: string): PolicyStatus => {
    switch (statusName) {
        case 'In Force':
        case 'Expired':
        case 'Cancelled':
        case 'Scheduled':
            return statusName;
        default:
            return 'In Force';
    }
};

export const toPolicy = (dto: PolicyResourceDto): Policy => {
    const a = dto.attributes;

    return {
        policyNumber: a.policyNumber,
        productCode: a.product.code,
        productName: a.product.name,
        accountHolderName: a.primaryInsured.displayName,
        vehicleDescription: a.vehicle.description,
        licensePlate: a.vehicle.licensePlate,
        effectiveDate: a.periodStart,
        expirationDate: a.periodEnd,
        status: normaliseStatus(a.periodStatus.name),
    };
};

export const toLossCause = (dto: TypecodeDto): LossCause => ({
    code: dto.code,
    displayName: dto.name,
});

export const toClaimReceipt = (
    dto: ClaimResourceDto,
    request: ClaimCreateAttributesDto
): ClaimReceipt => ({
    claimNumber: dto.attributes.claimNumber,
    policyNumber: request.policyNumber,
    lossDate: dto.attributes.lossDate,
    lossCause: dto.attributes.lossCause,
    status: dto.attributes.claimStatus?.name ?? 'Draft',
});

export const buildClaimCreateAttributes = (
    draft: {
        policyNumber: string;
        dateOfLoss: string;
        lossCause: string;
    },
    policy: Policy
): ClaimCreateAttributesDto => ({
    policyNumber: draft.policyNumber,
    lossDate: draft.dateOfLoss,
    lossCause: draft.lossCause,
    productCode: policy.productCode,
    accountHolderName: policy.accountHolderName,
    vehicleDescription: policy.vehicleDescription,
    licensePlate: policy.licensePlate,
    policyEffectiveDate: policy.effectiveDate,
    policyExpirationDate: policy.expirationDate,
});
