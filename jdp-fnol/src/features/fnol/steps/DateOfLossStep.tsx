import React, { useState } from 'react';

import { DateField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type { Policy } from '../../../types/domain';
import { formatDate, startOfDay } from '../../../utils/date';
import { usePolicies } from '../../policies/PoliciesContext';
import { useFnol } from '../FnolContext';
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

    const lossTs = startOfDay(dateOfLoss);
    const todayTs = startOfDay(new Date().toISOString());

    if (lossTs > todayTs) {
        return 'future';
    }

    if (!policy) {
        return null;
    }

    const effectiveTs = startOfDay(policy.effectiveDate);
    const expirationTs = startOfDay(policy.expirationDate);

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

                {renderError()}
            </div>
        </WizardPage>
    );
};
