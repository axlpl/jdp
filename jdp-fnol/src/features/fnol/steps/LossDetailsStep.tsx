import React, { useCallback, useMemo, useState } from 'react';

import {
    DropdownSelectField,
    InputField,
    RadioField,
    TextAreaField,
} from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type {
    DamageType,
    FnolDraft,
    ImpactArea,
    VehicleArea,
} from '../../../types/domain';
import { VehicleImpactPicker } from '../components/VehicleImpactPicker';
import { useFnol } from '../FnolContext';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import styles from '../Fnol.module.scss';

const AREA_MESSAGE: Record<VehicleArea, typeof messages.areaFrontLeft> = {
    frontLeft: messages.areaFrontLeft,
    frontCenter: messages.areaFrontCenter,
    frontRight: messages.areaFrontRight,
    leftSide: messages.areaLeftSide,
    rightSide: messages.areaRightSide,
    rearLeft: messages.areaRearLeft,
    rearCenter: messages.areaRearCenter,
    rearRight: messages.areaRearRight,
    roof: messages.areaRoof,
};

const DAMAGE_TYPES: DamageType[] = [
    'scratch',
    'dent',
    'crack',
    'brokenLight',
    'brokenMirror',
    'shattered',
    'bentFrame',
    'other',
];

const DAMAGE_MESSAGE: Record<DamageType, typeof messages.damageScratch> = {
    scratch: messages.damageScratch,
    dent: messages.damageDent,
    crack: messages.damageCrack,
    brokenLight: messages.damageBrokenLight,
    brokenMirror: messages.damageBrokenMirror,
    shattered: messages.damageShattered,
    bentFrame: messages.damageBentFrame,
    other: messages.damageOther,
};

export const LossDetailsStep = () => {
    const translator = useTranslator();
    const { draft } = useFnol();
    const flow = useFlow<FnolDraft>();
    const [showError, setShowError] = useState(false);

    const selectedAreaSet = useMemo(
        () => new Set(draft.impactAreas.map(a => a.area)),
        [draft.impactAreas]
    );

    const areaLabel = useCallback(
        (area: VehicleArea) => translator(AREA_MESSAGE[area]),
        [translator]
    );

    const damageOptions = useMemo(
        () =>
            DAMAGE_TYPES.map(type => ({
                code: type,
                name: translator(DAMAGE_MESSAGE[type]),
            })),
        [translator]
    );

    const yesNoValues = useMemo(
        () => [
            { code: 'yes', name: translator(messages.reviewYes) },
            { code: 'no', name: translator(messages.reviewNo) },
        ],
        [translator]
    );

    const handleToggleArea = useCallback(
        (area: VehicleArea) => {
            const exists = draft.impactAreas.some(a => a.area === area);
            const next: ImpactArea[] = exists
                ? draft.impactAreas.filter(a => a.area !== area)
                : [...draft.impactAreas, { area, damageType: null }];

            flow.setValue('impactAreas', next);
        },
        [draft.impactAreas, flow]
    );

    const handleDamageTypeChange = useCallback(
        (area: VehicleArea, damageType: DamageType) => {
            const next = draft.impactAreas.map(entry =>
                entry.area === area ? { ...entry, damageType } : entry
            );

            flow.setValue('impactAreas', next);
        },
        [draft.impactAreas, flow]
    );

    const handleNext = (): boolean => {
        const ready =
            draft.lossDescription?.trim() && draft.lossLocation?.trim();

        if (!ready) {
            setShowError(true);

            return false;
        }

        return true;
    };

    const driveableValue =
        draft.vehicleDriveable == null
            ? undefined
            : draft.vehicleDriveable
            ? 'yes'
            : 'no';

    return (
        <WizardPage
            id="lossDetailsStep"
            title={messages.stepDetailsTitle}
            onNext={handleNext}
            panelClassName={styles.panel}
        >
            <div className={styles.stepContent}>
                <p className={styles.prompt}>
                    {translator(messages.stepDetailsHeading)}
                </p>

                <TextAreaField
                    id="lossDescription"
                    label={messages.stepDetailsDescriptionLabel}
                    placeholder={messages.stepDetailsDescriptionPlaceholder}
                    value={draft.lossDescription ?? ''}
                    onValueChange={(value: string) => {
                        flow.setValue('lossDescription', value);
                        setShowError(false);
                    }}
                    required
                    showRequired
                />

                <InputField
                    id="lossLocation"
                    label={messages.stepDetailsLocationLabel}
                    placeholder={messages.stepDetailsLocationPlaceholder}
                    value={draft.lossLocation ?? ''}
                    onValueChange={(value: string) => {
                        flow.setValue('lossLocation', value);
                        setShowError(false);
                    }}
                    required
                    showRequired
                />

                <section className={styles.impactSection}>
                    <h4 className={styles.subsectionTitle}>
                        {translator(messages.stepDetailsImpactTitle)}
                    </h4>
                    <VehicleImpactPicker
                        selectedAreas={selectedAreaSet}
                        onToggle={handleToggleArea}
                        areaLabel={areaLabel}
                        instruction={translator(
                            messages.stepDetailsImpactInstruction
                        )}
                    />

                    {draft.impactAreas.length > 0 && (
                        <div className={styles.damageList}>
                            {draft.impactAreas.map(entry => (
                                <div
                                    key={entry.area}
                                    className={styles.damageRow}
                                >
                                    <DropdownSelectField
                                        id={`damageType-${entry.area}`}
                                        label={areaLabel(entry.area)}
                                        placeholder={
                                            messages.stepDetailsDamageTypeLabel
                                        }
                                        availableValues={damageOptions}
                                        value={entry.damageType ?? undefined}
                                        onValueChange={(value: string) =>
                                            handleDamageTypeChange(
                                                entry.area,
                                                value as DamageType
                                            )
                                        }
                                        alwaysShowPlaceholder
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <RadioField
                    id="vehicleDriveable"
                    label={messages.stepDetailsDriveableLabel}
                    availableValues={yesNoValues}
                    value={driveableValue}
                    onValueChange={(value: string) =>
                        flow.setValue('vehicleDriveable', value === 'yes')
                    }
                />

                <InputField
                    id="reporterPhone"
                    label={messages.stepDetailsPhoneLabel}
                    placeholder={messages.stepDetailsPhonePlaceholder}
                    inputType="tel"
                    value={draft.reporterPhone ?? ''}
                    onValueChange={(value: string) =>
                        flow.setValue('reporterPhone', value)
                    }
                />

                {showError && (
                    <p className={styles.errorText}>
                        {translator(messages.stepDetailsRequired)}
                    </p>
                )}
            </div>
        </WizardPage>
    );
};
