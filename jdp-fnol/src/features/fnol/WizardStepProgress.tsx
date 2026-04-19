import React from 'react';
import { useLocation } from 'react-router-dom';

import { StepProgressBar } from '@jutro/components';

import styles from './WizardStepProgress.module.scss';

export type WizardStep = {
    id: string;
    route: string;
    title: string;
    component: React.ComponentType;
    icon?: string;
};

type Props = {
    steps: WizardStep[];
    basePath: string;
};

export const WizardStepProgress = ({ steps, basePath }: Props) => {
    const { pathname } = useLocation();

    const currentIndex = steps.findIndex(
        step =>
            pathname === `${basePath}/${step.route}` ||
            pathname === basePath
    );

    const progressSteps = steps.map((step, index) => ({
        title: step.title,
        active: index === currentIndex,
        visited: currentIndex > -1 && index < currentIndex,
    }));

    return (
        <div className={styles.progressBand}>
            <StepProgressBar steps={progressSteps} />
        </div>
    );
};
