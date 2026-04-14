import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { log } from '@jutro/logger';
import { Wizard } from '@jutro/wizard-next';

import { submitFnol } from '../../services/claimCenterApi';
import { usePolicies } from '../policies/PoliciesContext';

import { FnolProvider, useFnol } from './FnolContext';
import messages from './Fnol.messages';
import { DateOfLossStep } from './steps/DateOfLossStep';
import { LossCauseStep } from './steps/LossCauseStep';
import { SelectPolicyStep } from './steps/SelectPolicyStep';
import { WizardStep, WizardStepProgress } from './WizardStepProgress';

const wizardLayout = {
    desktop: { gap: 'small' as const },
    tablet: { gap: 'small' as const },
    phoneWide: { gap: 'small' as const },
    phone: { gap: 'small' as const },
};

const extractErrorMessage = (err: unknown): string =>
    err instanceof Error ? err.message : String(err);

const FnolWizardInner = () => {
    const translator = useTranslator();
    const history = useHistory();
    const { showAlert } = useModal();
    const { draft, reset } = useFnol();
    const { getByNumber } = usePolicies();

    const steps = useMemo<WizardStep[]>(
        () => [
            {
                id: 'policy',
                title: translator(messages.stepPolicyTitle),
                route: 'policy',
                component: SelectPolicyStep,
            },
            {
                id: 'date',
                title: translator(messages.stepDateTitle),
                route: 'date',
                component: DateOfLossStep,
            },
            {
                id: 'cause',
                title: translator(messages.stepCauseTitle),
                route: 'cause',
                component: LossCauseStep,
            },
        ],
        [translator]
    );

    const handleFinish = useCallback(async (): Promise<boolean> => {
        try {
            const policy = draft.policyNumber
                ? getByNumber(draft.policyNumber)
                : undefined;

            if (!policy) {
                throw new Error('Selected policy is no longer available');
            }

            const result = await submitFnol({ draft, policy });

            reset();
            history.push(
                `/fnol/confirmation/${encodeURIComponent(result.claimNumber)}`
            );
        } catch (err) {
            log.error(`FNOL submit failed: ${extractErrorMessage(err)}`);
            showAlert({
                status: 'error',
                title: messages.submitErrorTitle,
                message: messages.submitError,
            });
        }

        return false;
    }, [draft, getByNumber, history, reset, showAlert]);

    const handleCancel = useCallback((): boolean => {
        reset();
        history.push('/dashboard');

        return false;
    }, [history, reset]);

    const renderProgressBar = useCallback(
        ({
            steps: wizardSteps,
            basePath,
        }: {
            steps: WizardStep[];
            basePath: string;
        }) => (
            <WizardStepProgress
                steps={wizardSteps}
                basePath={basePath}
            />
        ),
        []
    );

    return (
        <Wizard
            basePath="/fnol/new"
            baseRoute="/fnol/new"
            steps={steps}
            initialStepPath="policy"
            onFinish={handleFinish}
            onCancel={handleCancel}
            layout={wizardLayout}
            renderProgressBar={renderProgressBar}
        />
    );
};

export const FnolWizard = () => (
    <FnolProvider>
        <FnolWizardInner />
    </FnolProvider>
);
