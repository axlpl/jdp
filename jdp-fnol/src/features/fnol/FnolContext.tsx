import React, { ReactNode, useCallback, useMemo } from 'react';

import type {
    FnolDraft,
    LossCauseCode,
} from '../../types/domain';

import { FlowProvider, useFlow } from './flow/FlowContext';

const EMPTY_DRAFT: FnolDraft = {
    claimId: null,
    policyNumber: null,
    dateOfLoss: null,
    timeOfLoss: null,
    lossCause: null,
    lossDescription: null,
    lossLocation: null,
    impactAreas: [],
    vehicleDriveable: null,
    reporterPhone: null,
    injuriesInvolved: null,
    injuryDescription: null,
    policeCalled: null,
    policeReportNumber: null,
    otherPartyName: null,
    otherPartyPhone: null,
    otherPartyInsurer: null,
    otherPartyPlate: null,
    witnessDetails: null,
    photoCount: 0,
    lossLocationId: null,
    newLossAddress: null,
    vehicleId: null,
    newVehicle: null,
    driverId: null,
    newDriver: null,
};

export type FnolContextValue = {
    draft: FnolDraft;
    hasDraft: boolean;
    setPolicy: (policyNumber: string) => void;
    setDate: (dateOfLoss: string) => void;
    setLossCause: (lossCause: LossCauseCode) => void;
    loadDraft: (draft: FnolDraft) => void;
    reset: () => void;
};

export const FnolProvider = ({ children }: { children: ReactNode }) => (
    <FlowProvider<FnolDraft> initialValue={EMPTY_DRAFT}>
        {children}
    </FlowProvider>
);

const DRAFT_KEYS = Object.keys(EMPTY_DRAFT) as Array<keyof FnolDraft>;

const isNonEmpty = (draft: FnolDraft): boolean =>
    DRAFT_KEYS.some(key => {
        const value = draft[key];

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        return value !== null && value !== EMPTY_DRAFT[key];
    });

export const useFnol = (): FnolContextValue => {
    const flow = useFlow<FnolDraft>();

    const setPolicy = useCallback(
        (policyNumber: string) => flow.setValue('policyNumber', policyNumber),
        [flow]
    );
    const setDate = useCallback(
        (dateOfLoss: string) => flow.setValue('dateOfLoss', dateOfLoss),
        [flow]
    );
    const setLossCause = useCallback(
        (lossCause: LossCauseCode) => flow.setValue('lossCause', lossCause),
        [flow]
    );
    const loadDraft = useCallback(
        (draft: FnolDraft) => flow.patch(draft),
        [flow]
    );

    return useMemo<FnolContextValue>(
        () => ({
            draft: flow.value,
            hasDraft: isNonEmpty(flow.value),
            setPolicy,
            setDate,
            setLossCause,
            loadDraft,
            reset: flow.reset,
        }),
        [flow.value, flow.reset, setPolicy, setDate, setLossCause, loadDraft]
    );
};
