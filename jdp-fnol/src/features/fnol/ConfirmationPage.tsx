import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button } from '@jutro/components';
import { useTranslator } from '@jutro/locale';

import messages from './Fnol.messages';

import styles from './Fnol.module.scss';

type Params = {
    claimId: string;
};

export const ConfirmationPage = () => {
    const translator = useTranslator();
    const history = useHistory();
    const { claimId } = useParams<Params>();

    return (
        <div className={styles.confirmation}>
            <div className={styles.successBadge} aria-hidden="true">
                ✓
            </div>

            <h1 className={styles.confirmationTitle}>
                {translator(messages.confirmationTitle)}
            </h1>

            <p className={styles.confirmationMessage}>
                {translator(messages.confirmationMessage, {
                    claimNumber: (
                        <span className={styles.claimNumber}>{claimId}</span>
                    ),
                })}
            </p>

            <Button
                id="backToDashboard"
                onClick={() => history.push('/dashboard')}
                label={translator(messages.confirmationBackToDashboard)}
            />
        </div>
    );
};
