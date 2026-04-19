import React, { useState } from 'react';

import { RadioButtonCardField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import { useFnol } from '../FnolContext';
import messages from '../Fnol.messages';
import { LOSS_CAUSES, LossCauseCode } from '../lossCauses';

import styles from '../Fnol.module.scss';

type CauseVisual = {
    code: LossCauseCode;
    iconName: string;
    secondaryLabel: string;
};

const CAUSE_VISUALS: CauseVisual[] = [
    {
        code: 'collision',
        iconName: 'gw-directions-car',
        secondaryLabel: 'Crash with another vehicle',
    },
    {
        code: 'theft',
        iconName: 'gw-lock-open',
        secondaryLabel: 'Vehicle or property stolen',
    },
    {
        code: 'vandalism',
        iconName: 'gw-warning',
        secondaryLabel: 'Intentional damage',
    },
    {
        code: 'glassDamage',
        iconName: 'gw-photo-camera',
        secondaryLabel: 'Broken or cracked glass',
    },
    {
        code: 'animalCollision',
        iconName: 'gw-flag',
        secondaryLabel: 'Collision with an animal',
    },
    {
        code: 'fire',
        iconName: 'gw-error',
        secondaryLabel: 'Fire-related damage',
    },
    {
        code: 'flood',
        iconName: 'gw-bathtub',
        secondaryLabel: 'Water or flood damage',
    },
    {
        code: 'weather',
        iconName: 'gw-cloud-queue',
        secondaryLabel: 'Storm, hail, wind',
    },
    {
        code: 'other',
        iconName: 'gw-more-horizontal',
        secondaryLabel: 'Something else',
    },
];

const availableValues = LOSS_CAUSES.map(cause => {
    const visual = CAUSE_VISUALS.find(v => v.code === cause.code);

    return {
        id: cause.code,
        code: cause.code,
        displayName: cause.displayName,
        iconName: visual?.iconName ?? 'gw-help-outline',
        secondaryLabel: visual?.secondaryLabel ?? '',
    };
});

export const LossCauseStep = () => {
    const translator = useTranslator();
    const { draft, setLossCause } = useFnol();
    const [showError, setShowError] = useState(false);

    const handleNext = (): boolean => {
        if (!draft.lossCause) {
            setShowError(true);

            return false;
        }

        return true;
    };

    return (
        <WizardPage
            id="lossCauseStep"
            title={messages.stepCauseTitle}
            onNext={handleNext}
            panelClassName={styles.panel}
        >
            <div className={styles.stepContent}>
                <p className={styles.prompt}>
                    {translator(messages.stepCauseHeading)}
                </p>

                <RadioButtonCardField
                    id="lossCause"
                    label={messages.stepCauseLabel}
                    availableValues={availableValues}
                    value={draft.lossCause ?? undefined}
                    onValueChange={(value: string) => {
                        setLossCause(value as LossCauseCode);
                        setShowError(false);
                    }}
                    required
                    showRequired
                />

                {showError && (
                    <p className={styles.errorText}>
                        {translator(messages.stepCauseRequired)}
                    </p>
                )}
            </div>
        </WizardPage>
    );
};
