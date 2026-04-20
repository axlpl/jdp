import React, { ReactNode, useCallback, useMemo } from 'react';

import type {
    DamageType,
    FnolDraft,
    ImpactArea,
    LossCauseCode,
    VehicleArea,
} from '../../types/domain';

import { FlowProvider, useFlow } from './flow/FlowContext';

const STORAGE_KEY = 'jdp-fnol-draft';

const EMPTY_DRAFT: FnolDraft = {
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
};

const LOSS_CAUSE_CODES = new Set<LossCauseCode>([
    'collision',
    'theft',
    'vandalism',
    'glassDamage',
    'animalCollision',
    'fire',
    'flood',
    'weather',
    'other',
]);

const VEHICLE_AREAS = new Set<VehicleArea>([
    'frontLeft',
    'frontCenter',
    'frontRight',
    'leftSide',
    'rightSide',
    'rearLeft',
    'rearCenter',
    'rearRight',
    'roof',
]);

const DAMAGE_TYPES = new Set<DamageType>([
    'scratch',
    'dent',
    'crack',
    'brokenLight',
    'brokenMirror',
    'shattered',
    'bentFrame',
    'other',
]);

const isNullableString = (v: unknown): boolean =>
    v === null || v === undefined || typeof v === 'string';
const isNullableBoolean = (v: unknown): boolean =>
    v === null || v === undefined || typeof v === 'boolean';
const isLossCauseCode = (v: unknown): v is LossCauseCode =>
    typeof v === 'string' && LOSS_CAUSE_CODES.has(v as LossCauseCode);
const isVehicleArea = (v: unknown): v is VehicleArea =>
    typeof v === 'string' && VEHICLE_AREAS.has(v as VehicleArea);
const isDamageType = (v: unknown): v is DamageType =>
    typeof v === 'string' && DAMAGE_TYPES.has(v as DamageType);
const isImpactArea = (v: unknown): v is ImpactArea => {
    if (typeof v !== 'object' || v === null) {
        return false;
    }
    const o = v as Record<string, unknown>;

    return (
        isVehicleArea(o.area) &&
        (o.damageType === null || isDamageType(o.damageType))
    );
};

const isFnolDraft = (value: unknown): value is Partial<FnolDraft> => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const d = value as Record<string, unknown>;

    return (
        isNullableString(d.policyNumber) &&
        isNullableString(d.dateOfLoss) &&
        isNullableString(d.timeOfLoss) &&
        (d.lossCause === null ||
            d.lossCause === undefined ||
            isLossCauseCode(d.lossCause)) &&
        isNullableString(d.lossDescription) &&
        isNullableString(d.lossLocation) &&
        (d.impactAreas === undefined ||
            (Array.isArray(d.impactAreas) &&
                d.impactAreas.every(isImpactArea))) &&
        isNullableBoolean(d.vehicleDriveable) &&
        isNullableString(d.reporterPhone) &&
        isNullableBoolean(d.injuriesInvolved) &&
        isNullableString(d.injuryDescription) &&
        isNullableBoolean(d.policeCalled) &&
        isNullableString(d.policeReportNumber) &&
        isNullableString(d.otherPartyName) &&
        isNullableString(d.otherPartyPhone) &&
        isNullableString(d.otherPartyInsurer) &&
        isNullableString(d.otherPartyPlate) &&
        isNullableString(d.witnessDetails) &&
        (typeof d.photoCount === 'number' || d.photoCount === undefined)
    );
};

export type FnolContextValue = {
    draft: FnolDraft;
    hasDraft: boolean;
    setPolicy: (policyNumber: string) => void;
    setDate: (dateOfLoss: string) => void;
    setLossCause: (lossCause: LossCauseCode) => void;
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

    return useMemo<FnolContextValue>(
        () => ({
            draft: flow.value,
            hasDraft: isNonEmpty(flow.value),
            setPolicy,
            setDate,
            setLossCause,
            reset: flow.reset,
        }),
        [flow.value, flow.reset, setPolicy, setDate, setLossCause]
    );
};
