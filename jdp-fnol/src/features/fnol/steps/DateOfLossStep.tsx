import React, { useState } from 'react';

import { DateField, InputField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type { FnolDraft, Policy } from '../../../types/domain';
import { formatDate, startOfDayTs, todayStartTs } from '../../../utils/date';
import { usePolicies } from '../../policies/PoliciesContext';
import { useFnol } from '../FnolContext';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import styles from '../Fnol.module.scss';

type ValidationReason = 'required' | 'future' | 'beforePolicy' | 'afterPolicy';

const validate = (
    dateOfLoss: string | null,
    policy: Policy | undefined
): ValidationReason | null => {
    if (!dateOfLoss) {
        return 'required';
    }

    const lossTs = startOfDayTs(dateOfLoss);

    if (lossTs > todayStartTs()) {
        return 'future';
    }

    if (!policy) {
        return null;
    }

    const effectiveTs = startOfDayTs(policy.effectiveDate);
    const expirationTs = startOfDayTs(policy.expirationDate);

    if (lossTs < effectiveTs) {
        return 'beforePolicy';
    }

    if (lossTs > expirationTs) {
        return 'afterPolicy';
    }

    return null;
};

export const DateOfLossStep = () => {
    const translator = useTranslator();
    const { draft, setDate } = useFnol();
    const flow = useFlow<FnolDraft>();
    const { getByNumber } = usePolicies();
    const [error, setError] = useState<ValidationReason | null>(null);

    const selectedPolicy =
        draft.policyNumber != null ? getByNumber(draft.policyNumber) : undefined;

    const handleNext = (): boolean => {
        const reason = validate(draft.dateOfLoss, selectedPolicy);

        if (reason !== null) {
            setError(reason);

            return false;
        }
        setError(null);

        return true;
    };

    const renderError = () => {
        if (!error) {
            return null;
        }

        const map: Record<ValidationReason, string> = {
            required: translator(messages.stepDateRequired),
            future: translator(messages.stepDateErrorFuture),
            beforePolicy: translator(messages.stepDateErrorBeforePolicy, {
                effectiveDate: formatDate(selectedPolicy?.effectiveDate),
            }),
            afterPolicy: translator(messages.stepDateErrorAfterPolicy, {
                expirationDate: formatDate(selectedPolicy?.expirationDate),
            }),
        };

        return <p className={styles.errorText}>{map[error]}</p>;
    };

    return (
        <WizardPage
            id="dateOfLossStep"
            title={messages.stepDateTitle}
            onNext={handleNext}
            panelClassName={styles.panel}
        >
            <div className={styles.stepContent}>
                <p className={styles.prompt}>
                    {translator(messages.stepDateHeading)}
                </p>

                <DateField
                    id="dateOfLoss"
                    label={messages.stepDateLabel}
                    value={draft.dateOfLoss ?? undefined}
                    onValueChange={(value: string) => {
                        setDate(value);
                        setError(null);
                    }}
                    required
                    showRequired
                />

                <InputField
                    id="timeOfLoss"
                    label={messages.stepTimeLabel}
                    inputType="time"
                    value={draft.timeOfLoss ?? ''}
                    onValueChange={(value: string) =>
                        flow.setValue('timeOfLoss', value ?? null)
                    }
                />

                {renderError()}
            </div>
        </WizardPage>
    );
};
