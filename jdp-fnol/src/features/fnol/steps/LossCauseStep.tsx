import React, { useState } from 'react';

import { DropdownSelectField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import { useFnol } from '../FnolContext';
import messages from '../Fnol.messages';
import { LOSS_CAUSES } from '../lossCauses';

import styles from '../Fnol.module.scss';

const availableValues = LOSS_CAUSES.map(c => ({
    code: c.code,
    name: c.displayName,
}));

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
                <h2 className={styles.heading}>
                    {translator(messages.stepCauseHeading)}
                </h2>

                <DropdownSelectField
                    id="lossCause"
                    label={messages.stepCauseLabel}
                    availableValues={availableValues}
                    value={draft.lossCause ?? undefined}
                    onValueChange={(value: string) => {
                        setLossCause(value);
                        setShowError(false);
                    }}
                    required
                    showRequired
                    alwaysShowPlaceholder
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
