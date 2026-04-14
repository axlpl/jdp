import { useCallback, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { WizardContext } from '@jutro/wizard-next/wizard/WizardContext';

export type WizardStepDescriptor = {
    id: string;
    route: string;
};

type WizardContextShape = {
    basePath: string;
    steps: WizardStepDescriptor[];
};

export type FlowActions = {
    currentStepId: string | null;
    currentStepIndex: number;
    isFirst: boolean;
    isLast: boolean;
    goNext: () => void;
    goPrevious: () => void;
    goTo: (stepId: string) => void;
    goToBasePath: () => void;
};

export const useFlowActions = (): FlowActions => {
    const history = useHistory();
    const { pathname } = useLocation();
    const ctx = useContext(WizardContext) as WizardContextShape | null;

    if (!ctx) {
        throw new Error(
            'useFlowActions must be used inside a <Wizard> from @jutro/wizard-next'
        );
    }

    const { basePath, steps } = ctx;

    const currentStepIndex = steps.findIndex(
        step =>
            pathname === `${basePath}/${step.route}` ||
            (pathname === basePath && step === steps[0])
    );

    const currentStepId =
        currentStepIndex >= 0 ? steps[currentStepIndex].id : null;

    const goNext = useCallback(() => {
        const next = steps[currentStepIndex + 1];

        if (next) {
            history.push(`${basePath}/${next.route}`);
        }
    }, [basePath, currentStepIndex, history, steps]);

    const goPrevious = useCallback(() => {
        const prev = steps[currentStepIndex - 1];

        if (prev) {
            history.push(`${basePath}/${prev.route}`);
        }
    }, [basePath, currentStepIndex, history, steps]);

    const goTo = useCallback(
        (stepId: string) => {
            const target = steps.find(step => step.id === stepId);

            if (target) {
                history.push(`${basePath}/${target.route}`);
            }
        },
        [basePath, history, steps]
    );

    const goToBasePath = useCallback(() => {
        history.push(basePath);
    }, [basePath, history]);

    return {
        currentStepId,
        currentStepIndex,
        isFirst: currentStepIndex <= 0,
        isLast:
            currentStepIndex >= 0 && currentStepIndex === steps.length - 1,
        goNext,
        goPrevious,
        goTo,
        goToBasePath,
    };
};
