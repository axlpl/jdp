import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, InfoLabel } from '@jutro/components';
import { DataTable, DisplayColumn } from '@jutro/legacy/datatable';
import { useTranslator } from '@jutro/locale';

import { PageLayout } from '../../components/PageLayout';
import type { Policy, PolicyStatus } from '../../types/domain';
import { formatDate } from '../../utils/date';
import { usePolicies } from '../policies/PoliciesContext';

import messages from './Dashboard.messages';

import styles from './Dashboard.module.scss';

type InfoLabelVariant = 'success' | 'warning' | 'error';

const STATUS_VARIANT: Record<PolicyStatus, InfoLabelVariant> = {
    'In Force': 'success',
    Scheduled: 'warning',
    Expired: 'error',
    Cancelled: 'error',
};

const renderPeriod = (row: Policy): string =>
    `${formatDate(row.effectiveDate)} – ${formatDate(row.expirationDate)}`;

const renderStatus = (row: Policy): JSX.Element => (
    <InfoLabel type={STATUS_VARIANT[row.status]} message={row.status} />
);

export const Dashboard = () => {
    const translator = useTranslator();
    const history = useHistory();
    const { policies, status, reload } = usePolicies();

    const handleGlobalFileClaim = useCallback(() => {
        history.push('/fnol/new');
    }, [history]);

    const handleFileClaimForPolicy = useCallback(
        (row: Policy) => {
            history.push(
                `/fnol/new?policyNumber=${encodeURIComponent(row.policyNumber)}`
            );
        },
        [history]
    );

    const renderActions = useCallback(
        (row: Policy) => (
            <Button
                id={`fileClaim-${row.policyNumber}`}
                variant="secondary"
                onClick={() => handleFileClaimForPolicy(row)}
                label={translator(messages.fileAClaim)}
            />
        ),
        [handleFileClaimForPolicy, translator]
    );

    const renderBody = () => {
        if (status === 'loading' || status === 'idle') {
            return (
                <div className={styles.status}>
                    {translator(messages.loading)}
                </div>
            );
        }

        if (status === 'error') {
            return (
                <div className={`${styles.status} ${styles.error}`}>
                    <p>{translator(messages.loadError)}</p>
                    <Button
                        id="retryPolicies"
                        variant="tertiary"
                        onClick={() => reload()}
                        label={translator(messages.retry)}
                    />
                </div>
            );
        }

        return (
            <DataTable
                id="policiesTable"
                data={policies}
                showSearch
                showPagination
                pageSizeOptions={[10, 25, 50]}
                tableLabel={translator(messages.pageTitle)}
                noDataText={translator(messages.emptyState)}
            >
                <DisplayColumn
                    id="policyNumber"
                    header={translator(messages.colPolicyNumber)}
                    path="policyNumber"
                    sortable
                />
                <DisplayColumn
                    id="productName"
                    header={translator(messages.colProduct)}
                    path="productName"
                    sortable
                />
                <DisplayColumn
                    id="vehicleDescription"
                    header={translator(messages.colVehicle)}
                    path="vehicleDescription"
                    sortable
                />
                <DisplayColumn
                    id="licensePlate"
                    header={translator(messages.colPlate)}
                    path="licensePlate"
                />
                <DisplayColumn
                    id="period"
                    header={translator(messages.colPeriod)}
                    renderCell={renderPeriod}
                />
                <DisplayColumn
                    id="status"
                    header={translator(messages.colStatus)}
                    renderCell={renderStatus}
                />
                <DisplayColumn
                    id="actions"
                    header={translator(messages.colActions)}
                    renderCell={renderActions}
                    textAlign="right"
                />
            </DataTable>
        );
    };

    return (
        <PageLayout>
            <div className={styles.dashboard}>
                <header className={styles.header}>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>
                            {translator(messages.pageTitle)}
                        </h1>
                        <p className={styles.subtitle}>
                            {translator(messages.pageSubtitle)}
                        </p>
                    </div>

                    <Button
                        id="fileClaimGlobal"
                        onClick={handleGlobalFileClaim}
                        label={translator(messages.fileAClaim)}
                    />
                </header>

                {renderBody()}
            </div>
        </PageLayout>
    );
};
