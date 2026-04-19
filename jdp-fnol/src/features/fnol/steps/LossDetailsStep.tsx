import React, { useState } from 'react';

import {
    InputField,
    RadioButtonCardField,
    RadioField,
    TextAreaField,
} from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type { FnolDraft, PointOfImpact } from '../../../types/domain';
import { useFnol } from '../FnolContext';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import styles from '../Fnol.module.scss';

const impactOptions = [
    { id: 'front', code: 'front', iconName: 'gw-arrow-forward', secondaryLabel: 'Front' },
    { id: 'rear', code: 'rear', iconName: 'gw-keyboard-backspace', secondaryLabel: 'Rear' },
    { id: 'left', code: 'left', iconName: 'gw-chevron-left', secondaryLabel: 'Left' },
    { id: 'right', code: 'right', iconName: 'gw-chevron-right', secondaryLabel: 'Right' },
    { id: 'multiple', code: 'multiple', iconName: 'gw-more-horizontal', secondaryLabel: 'Multiple' },
];

const yesNoValues = [
    { code: 'yes', name: 'Yes' },
    { code: 'no', name: 'No' },
];

export const LossDetailsStep = () => {
    const translator = useTranslator();
    const { draft } = useFnol();
    const flow = useFlow<FnolDraft>();
    const [showError, setShowError] = useState(false);

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

    const displayedImpactOptions = impactOptions.map(option => ({
        ...option,
        displayName: translator({
            id: `jdp.fnol.step.details.impact${option.code
                .charAt(0)
                .toUpperCase()}${option.code.slice(1)}`,
            defaultMessage: option.secondaryLabel,
        }),
    }));

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

                <RadioButtonCardField
                    id="pointOfImpact"
                    label={messages.stepDetailsImpactLabel}
                    availableValues={displayedImpactOptions}
                    value={draft.pointOfImpact ?? undefined}
                    onValueChange={(value: string) =>
                        flow.setValue(
                            'pointOfImpact',
                            value as PointOfImpact
                        )
                    }
                />

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
