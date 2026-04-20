import type {
    ClaimCreateAttributesDto,
    ClaimResourceDto,
} from './dto/claim';
import type { PolicyResourceDto } from './dto/policy';
import type { TypecodeDto } from './dto/typelist';
import type {
    ClaimReceipt,
    FnolDraft,
    LossCause,
    LossCauseCode,
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
    code: dto.code as LossCauseCode,
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

const combineDateTime = (
    date: string,
    time: string | null
): string => {
    if (!time) {
        return date;
    }
    const datePart = date.length >= 10 ? date.slice(0, 10) : date;

    return `${datePart}T${time}`;
};

export type CompleteFnolDraft = FnolDraft & {
    policyNumber: string;
    dateOfLoss: string;
    lossCause: LossCauseCode;
};

export const isDraftSubmittable = (
    draft: FnolDraft
): draft is CompleteFnolDraft =>
    draft.policyNumber !== null &&
    draft.dateOfLoss !== null &&
    draft.lossCause !== null;

export const buildClaimCreateAttributes = (
    draft: CompleteFnolDraft,
    policy: Policy
): ClaimCreateAttributesDto => ({
    policyNumber: draft.policyNumber,
    lossDate: combineDateTime(draft.dateOfLoss, draft.timeOfLoss),
    lossCause: draft.lossCause,
    productCode: policy.productCode,
    accountHolderName: policy.accountHolderName,
    vehicleDescription: policy.vehicleDescription,
    licensePlate: policy.licensePlate,
    policyEffectiveDate: policy.effectiveDate,
    policyExpirationDate: policy.expirationDate,
    lossDescription: draft.lossDescription ?? undefined,
    lossLocation: draft.lossLocation ?? undefined,
    impactAreas:
        draft.impactAreas.length > 0 ? draft.impactAreas : undefined,
    vehicleDriveable: draft.vehicleDriveable ?? undefined,
    reporterPhone: draft.reporterPhone ?? undefined,
    injuriesInvolved: draft.injuriesInvolved ?? undefined,
    injuryDescription: draft.injuryDescription ?? undefined,
    policeCalled: draft.policeCalled ?? undefined,
    policeReportNumber: draft.policeReportNumber ?? undefined,
    otherPartyName: draft.otherPartyName ?? undefined,
    otherPartyPhone: draft.otherPartyPhone ?? undefined,
    otherPartyInsurer: draft.otherPartyInsurer ?? undefined,
    otherPartyPlate: draft.otherPartyPlate ?? undefined,
    witnessDetails: draft.witnessDetails ?? undefined,
    photoCount: draft.photoCount > 0 ? draft.photoCount : undefined,
});
