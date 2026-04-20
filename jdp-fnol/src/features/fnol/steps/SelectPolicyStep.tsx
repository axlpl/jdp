import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { RadioField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import { usePolicies } from '../../policies/PoliciesContext';
import { useFnol } from '../FnolContext';
import messages from '../Fnol.messages';

import styles from '../Fnol.module.scss';

export const SelectPolicyStep = () => {
    const translator = useTranslator();
    const location = useLocation();
    const { draft, setPolicy } = useFnol();
    const { policies, status } = usePolicies();
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const preselect = params.get('policyNumber');

        if (preselect && !draft.policyNumber) {
            setPolicy(preselect);
        }
    }, [location.search, draft.policyNumber, setPolicy]);

    const availableValues = useMemo(
        () =>
            policies.map(p => {
                const suffix = [p.productName, p.accountHolderName]
                    .filter(Boolean)
                    .join(' · ');

                return {
                    code: p.policyNumber,
                    name: suffix
                        ? `${p.policyNumber} - ${suffix}`
                        : p.policyNumber,
                };
            }),
        [policies]
    );

    const handleNext = (): boolean => {
        if (!draft.policyNumber) {
            setShowError(true);

            return false;
        }

        return true;
    };

    return (
        <WizardPage
            id="selectPolicyStep"
            title={messages.stepPolicyTitle}
            onNext={handleNext}
            panelClassName={styles.panel}
        >
            <div className={styles.stepContent}>
                <p className={styles.prompt}>
                    {translator(messages.stepPolicyHeading)}
                </p>

                <RadioField
                    id="policyNumber"
                    label={messages.stepPolicyRadioLabel}
                    availableValues={availableValues}
                    value={draft.policyNumber ?? undefined}
                    onValueChange={(value: string) => {
                        setPolicy(value);
                        setShowError(false);
                    }}
                    disabled={status !== 'success'}
                    required
                    showRequired
                />

                {showError && (
                    <p className={styles.errorText}>
                        {translator(messages.stepPolicyRequired)}
                    </p>
                )}
            </div>
        </WizardPage>
    );
};
