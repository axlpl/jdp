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

export type PointOfImpact =
    | 'front'
    | 'rear'
    | 'left'
    | 'right'
    | 'multiple';

export type FnolDraft = {
    policyNumber: string | null;
    dateOfLoss: string | null;
    timeOfLoss: string | null;
    lossCause: LossCauseCode | null;
    lossDescription: string | null;
    lossLocation: string | null;
    pointOfImpact: PointOfImpact | null;
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
