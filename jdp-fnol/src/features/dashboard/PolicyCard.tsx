import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Card, InfoLabel } from '@jutro/components';
import { useTranslator } from '@jutro/locale';

import type { Policy, PolicyStatus } from '../../types/domain';
import { formatDate } from '../../utils/date';

import messages from './Dashboard.messages';

import styles from './PolicyCard.module.scss';

type InfoLabelVariant = 'success' | 'warning' | 'error';

type Props = {
    policy: Policy;
};

const STATUS_VARIANT: Record<PolicyStatus, InfoLabelVariant> = {
    'In Force': 'success',
    Scheduled: 'warning',
    Expired: 'error',
    Cancelled: 'error',
};

export const PolicyCard = ({ policy }: Props) => {
    const translator = useTranslator();
    const history = useHistory();

    const handleFileClaim = useCallback(() => {
        history.push(
            `/fnol/new?policyNumber=${encodeURIComponent(policy.policyNumber)}`
        );
    }, [history, policy.policyNumber]);

    return (
        <Card isPanel>
            <div className={styles.policyCard}>
                <div className={styles.topRow}>
                    <InfoLabel
                        type={STATUS_VARIANT[policy.status]}
                        message={policy.status}
                    />
                </div>

                <div className={styles.identity}>
                    <h3 className={styles.policyNumber}>
                        {policy.policyNumber}
                    </h3>
                    <p className={styles.productName}>{policy.productName}</p>
                </div>

                <p className={styles.vehicleDescription}>
                    {policy.vehicleDescription}
                </p>

                <div className={styles.metaGrid}>
                    <span className={styles.metaLabel}>
                        {translator(messages.colPlate)}
                    </span>
                    <span className={styles.metaValue}>
                        {policy.licensePlate}
                    </span>
                    <span className={styles.metaLabel}>
                        {translator(messages.colPeriod)}
                    </span>
                    <span className={styles.metaValue}>
                        {formatDate(policy.effectiveDate)} –{' '}
                        {formatDate(policy.expirationDate)}
                    </span>
                    <span className={styles.metaLabel}>Holder</span>
                    <span className={styles.metaValue}>
                        {policy.accountHolderName}
                    </span>
                </div>

                <div className={styles.actions}>
                    <Button
                        id={`fileClaim-${policy.policyNumber}`}
                        onClick={handleFileClaim}
                        label={translator(messages.fileAClaim)}
                    />
                </div>
            </div>
        </Card>
    );
};
