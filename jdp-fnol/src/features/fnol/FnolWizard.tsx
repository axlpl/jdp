import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { log } from '@jutro/logger';
import { Wizard } from '@jutro/wizard-next';

import { saveDraft, submitFnol } from '../../services/claimCenterApi';
import { usePolicies } from '../policies/PoliciesContext';

import { useDrafts } from './DraftsContext';
import { useFnol } from './FnolContext';
import {
    PolicyResourcesProvider,
    usePolicyResources,
} from './PolicyResourcesContext';
import messages from './Fnol.messages';
import { DateOfLossStep } from './steps/DateOfLossStep';
import { LossCauseStep } from './steps/LossCauseStep';
import { LossDetailsStep } from './steps/LossDetailsStep';
import { OtherDetailsStep } from './steps/OtherDetailsStep';
import { ReviewStep } from './steps/ReviewStep';
import { SelectPolicyStep } from './steps/SelectPolicyStep';
import type { WizardStep } from './WizardStepProgress';
import { WizardStepProgress } from './WizardStepProgress';

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
    const { draft, reset, loadDraft, hasDraft } = useFnol();
    const { getByNumber } = usePolicies();
    const { reload: reloadDrafts } = useDrafts();
    const resources = usePolicyResources();

    const steps = useMemo<WizardStep[]>(
        () => [
            {
                id: 'policy',
                title: translator(messages.stepPolicyTitle),
                route: 'policy',
                component: SelectPolicyStep,
                icon: 'gw-assignment',
            },
            {
                id: 'date',
                title: translator(messages.stepDateTitle),
                route: 'date',
                component: DateOfLossStep,
                icon: 'gw-event',
            },
            {
                id: 'cause',
                title: translator(messages.stepCauseTitle),
                route: 'cause',
                component: LossCauseStep,
                icon: 'gw-warning',
            },
            {
                id: 'details',
                title: translator(messages.stepDetailsTitle),
                route: 'details',
                component: LossDetailsStep,
                icon: 'gw-description',
            },
            {
                id: 'other',
                title: translator(messages.stepOtherTitle),
                route: 'other',
                component: OtherDetailsStep,
                icon: 'gw-info-outline',
            },
            {
                id: 'review',
                title: translator(messages.stepReviewTitle),
                route: 'review',
                component: ReviewStep,
                icon: 'gw-done',
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

            const result = await submitFnol({
                draft,
                locations: resources.locations,
                vehicles: resources.vehicles,
                contacts: resources.contacts,
            });

            reset();
            void reloadDrafts();
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
    }, [draft, getByNumber, history, reloadDrafts, reset, resources, showAlert]);

    const handleCancel = useCallback((): boolean => {
        if (!hasDraft) {
            history.push('/dashboard');

            return false;
        }

        void (async () => {
            try {
                const saved = await saveDraft(draft);

                loadDraft(saved);
                await reloadDrafts();
            } catch (err) {
                log.error(
                    `Save draft failed: ${extractErrorMessage(err)}`
                );
                showAlert({
                    status: 'error',
                    title: messages.submitErrorTitle,
                    message: messages.submitError,
                });
            } finally {
                history.push('/dashboard');
            }
        })();

        return false;
    }, [draft, hasDraft, history, loadDraft, reloadDrafts, showAlert]);

    const wizardButtonProps = useMemo(
        () => ({
            cancel: {
                children: messages.saveAndExit,
            },
            finish: {
                children: messages.submitClaim,
            },
        }),
        []
    );

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
            cancelPath="/dashboard"
            finishPath="/dashboard"
            buttonProps={wizardButtonProps}
            layout={wizardLayout}
            renderProgressBar={renderProgressBar}
        />
    );
};

export const FnolWizard = () => (
    <PolicyResourcesProvider>
        <FnolWizardInner />
    </PolicyResourcesProvider>
);
