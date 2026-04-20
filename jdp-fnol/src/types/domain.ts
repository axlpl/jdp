export type PolicyStatus = 'In Force' | 'Expired' | 'Cancelled' | 'Scheduled';

export type Policy = {
    policyNumber: string;
    productCode: string;
    productName: string;
    accountHolderName: string;
    vehicleDescription: string;
    licensePlate: string;
    effectiveDate: string;
    expirationDate: string;
    status: PolicyStatus;
};

export type LossCauseCode =
    | 'collision'
    | 'theft'
    | 'vandalism'
    | 'glassDamage'
    | 'animalCollision'
    | 'fire'
    | 'flood'
    | 'weather'
    | 'other';

export type LossCause = {
    code: LossCauseCode;
    displayName: string;
};

export type VehicleArea =
    | 'frontLeft'
    | 'frontCenter'
    | 'frontRight'
    | 'leftSide'
    | 'rightSide'
    | 'rearLeft'
    | 'rearCenter'
    | 'rearRight'
    | 'roof';

export type DamageType =
    | 'scratch'
    | 'dent'
    | 'crack'
    | 'brokenLight'
    | 'brokenMirror'
    | 'shattered'
    | 'bentFrame'
    | 'other';

export type ImpactArea = {
    area: VehicleArea;
    damageType: DamageType | null;
};

export type DraftSummary = {
    claimId: string;
    claimNumber: string | null;
    policyNumber: string;
    lossDate: string;
    updatedAt: string;
};

export type FnolDraft = {
    claimId: string | null;
    policyNumber: string | null;
    dateOfLoss: string | null;
    timeOfLoss: string | null;
    lossCause: LossCauseCode | null;
    lossDescription: string | null;
    lossLocation: string | null;
    impactAreas: ImpactArea[];
    vehicleDriveable: boolean | null;
    reporterPhone: string | null;
    injuriesInvolved: boolean | null;
    injuryDescription: string | null;
    policeCalled: boolean | null;
    policeReportNumber: string | null;
    otherPartyName: string | null;
    otherPartyPhone: string | null;
    otherPartyInsurer: string | null;
    otherPartyPlate: string | null;
    witnessDetails: string | null;
    photoCount: number;
};

export type FnolSubmissionPayload = {
    draft: FnolDraft;
    policy: Policy;
};

export type ClaimReceipt = {
    claimNumber: string;
    policyNumber: string;
    lossDate: string;
    lossCause: string;
    status: string;
};

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
