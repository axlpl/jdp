import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, useModal } from '@jutro/components';
import { InputField } from '@jutro/legacy/components';
import { Grid, GridItem } from '@jutro/layout';
import { useTranslator } from '@jutro/locale';

import { PageLayout } from '../../components/PageLayout';
import type { Policy } from '../../types/domain';
import { useFnol } from '../fnol/FnolContext';
import { usePolicies } from '../policies/PoliciesContext';

import messages from './Dashboard.messages';
import { PolicyCard } from './PolicyCard';

import styles from './Dashboard.module.scss';

const matchesQuery = (policy: Policy, query: string): boolean => {
    if (!query) {
        return true;
    }
    const q = query.toLowerCase();
    const haystack = [
        policy.policyNumber,
        policy.productName,
        policy.vehicleDescription,
        policy.licensePlate,
        policy.accountHolderName,
        policy.status,
    ]
        .join(' ')
        .toLowerCase();

    return haystack.includes(q);
};

export const Dashboard = () => {
    const translator = useTranslator();
    const history = useHistory();
    const { showConfirm } = useModal();
    const { policies, status, reload } = usePolicies();
    const { hasDraft, reset: resetDraft } = useFnol();
    const [query, setQuery] = useState('');

    const goToNewFnol = useCallback(() => {
        history.push('/fnol/new');
    }, [history]);

    const handleDiscardDraft = useCallback(async () => {
        const result = await showConfirm({
            status: 'warning',
            title: messages.draftDiscardTitle,
            message: messages.draftDiscardBody,
            confirmButtonText: messages.draftDiscardConfirm,
            cancelButtonText: messages.draftDiscardCancel,
        });

        if (result === 'CONFIRM') {
            resetDraft();
        }
    }, [showConfirm, resetDraft]);

    const filteredPolicies = useMemo(
        () => policies.filter(p => matchesQuery(p, query.trim())),
        [policies, query]
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

        if (policies.length === 0) {
            return (
                <div className={styles.status}>
                    {translator(messages.emptyState)}
                </div>
            );
        }

        if (filteredPolicies.length === 0) {
            return (
                <div className={styles.status}>
                    {translator(messages.searchEmpty)}
                </div>
            );
        }

        return (
            <Grid
                gap="large"
                columns={['1fr', '1fr', '1fr']}
                tablet={{ columns: ['1fr', '1fr'] }}
                phoneWide={{ columns: ['1fr'] }}
                phone={{ columns: ['1fr'] }}
            >
                {filteredPolicies.map(policy => (
                    <GridItem key={policy.policyNumber}>
                        <PolicyCard policy={policy} />
                    </GridItem>
                ))}
            </Grid>
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
                        onClick={goToNewFnol}
                        label={translator(messages.fileAClaim)}
                    />
                </header>

                {hasDraft && (
                    <div className={styles.draftBanner}>
                        <div className={styles.draftBannerText}>
                            <h3 className={styles.draftBannerTitle}>
                                {translator(messages.draftBannerTitle)}
                            </h3>
                            <p className={styles.draftBannerBody}>
                                {translator(messages.draftBannerBody)}
                            </p>
                        </div>
                        <div className={styles.draftBannerActions}>
                            <Button
                                id="continueDraft"
                                onClick={goToNewFnol}
                                label={translator(
                                    messages.draftBannerContinue
                                )}
                            />
                            <Button
                                id="discardDraft"
                                variant="tertiary"
                                onClick={handleDiscardDraft}
                                label={translator(messages.draftBannerDiscard)}
                            />
                        </div>
                    </div>
                )}

                {status === 'success' && policies.length > 0 && (
                    <div className={styles.toolbar}>
                        <div className={styles.searchWrapper}>
                            <InputField
                                id="policiesSearch"
                                hideLabel
                                label={messages.searchPlaceholder}
                                placeholder={messages.searchPlaceholder}
                                value={query}
                                onValueChange={(value: string) =>
                                    setQuery(value ?? '')
                                }
                            />
                        </div>
                        <span className={styles.resultsCount}>
                            {translator(messages.resultsCount, {
                                count: filteredPolicies.length,
                            })}
                        </span>
                    </div>
                )}

                {renderBody()}
            </div>
        </PageLayout>
    );
};
