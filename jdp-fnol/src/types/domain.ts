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

export type LossCause = {
    code: string;
    displayName: string;
};

export type FnolDraft = {
    policyNumber: string | null;
    dateOfLoss: string | null;
    lossCause: string | null;
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
