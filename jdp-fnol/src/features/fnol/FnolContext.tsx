import React, { ReactNode, useCallback, useMemo } from 'react';

import type { FnolDraft } from '../../types/domain';

import { FlowProvider, useFlow } from './flow/FlowContext';

const STORAGE_KEY = 'jdp-fnol-draft';

const EMPTY_DRAFT: FnolDraft = {
    policyNumber: null,
    dateOfLoss: null,
    lossCause: null,
};

const isFnolDraft = (value: unknown): value is Partial<FnolDraft> => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const draft = value as Record<string, unknown>;
    const isNullableString = (v: unknown) =>
        v === null || v === undefined || typeof v === 'string';

    return (
        isNullableString(draft.policyNumber) &&
        isNullableString(draft.dateOfLoss) &&
        isNullableString(draft.lossCause)
    );
};

export type FnolContextValue = {
    draft: FnolDraft;
    setPolicy: (policyNumber: string) => void;
    setDate: (dateOfLoss: string) => void;
    setLossCause: (lossCause: string) => void;
    reset: () => void;
};

export const FnolProvider = ({ children }: { children: ReactNode }) => (
    <FlowProvider<FnolDraft>
        initialValue={EMPTY_DRAFT}
        storageKey={STORAGE_KEY}
        validate={isFnolDraft}
    >
        {children}
    </FlowProvider>
);

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
        (lossCause: string) => flow.setValue('lossCause', lossCause),
        [flow]
    );

    return useMemo<FnolContextValue>(
        () => ({
            draft: flow.value,
            setPolicy,
            setDate,
            setLossCause,
            reset: flow.reset,
        }),
        [flow.value, flow.reset, setPolicy, setDate, setLossCause]
    );
};
