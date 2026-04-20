import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, useModal } from '@jutro/components';
import { confirmationResult } from '@jutro/components/widgets/modal-next/ConfirmationModal/ConfirmationModal';
import { InputField } from '@jutro/legacy/components';
import { Grid, GridItem } from '@jutro/layout';
import { useTranslator } from '@jutro/locale';
import { log } from '@jutro/logger';

import { PageLayout } from '../../components/PageLayout';
import { getDraft } from '../../services/claimCenterApi';
import type { DraftSummary, Policy } from '../../types/domain';
import { useDrafts } from '../fnol/DraftsContext';
import { useFnol } from '../fnol/FnolContext';
import { usePolicies } from '../policies/PoliciesContext';

import { DraftCard } from './DraftCard';
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
    const { drafts, status: draftsStatus, discard } = useDrafts();
    const { loadDraft, reset: resetDraft } = useFnol();
    const [query, setQuery] = useState('');

    const goToNewFnol = useCallback(() => {
        resetDraft();
        history.push('/fnol/new');
    }, [history, resetDraft]);

    const resumeDraft = useCallback(
        async (summary: DraftSummary) => {
            try {
                const loaded = await getDraft(summary.claimId);

                loadDraft(loaded);
                const policyParam = loaded.policyNumber
                    ? `?policyNumber=${encodeURIComponent(loaded.policyNumber)}`
                    : '';

                history.push(`/fnol/new${policyParam}`);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[FNOL resume draft] failed:', err);
                log.error(
                    `Resume draft failed: ${err instanceof Error ? err.message : String(err)}`
                );
            }
        },
        [history, loadDraft]
    );

    const handleDiscardDraft = useCallback(
        async (summary: DraftSummary) => {
            const result = await showConfirm({
                status: 'warning',
                title: messages.draftDiscardTitle,
                message: messages.draftDiscardBody,
                confirmButtonText: messages.draftDiscardConfirm,
                cancelButtonText: messages.draftDiscardCancel,
            });

            if (result === confirmationResult.CONFIRM) {
                await discard(summary.claimId);
            }
        },
        [discard, showConfirm]
    );

    const filteredPolicies = useMemo(
        () => policies.filter(p => matchesQuery(p, query.trim())),
        [policies, query]
    );

    const renderDrafts = () => {
        if (draftsStatus === 'idle' || draftsStatus === 'loading') {
            return (
                <div className={styles.status}>
                    {translator(messages.draftsLoading)}
                </div>
            );
        }

        if (draftsStatus === 'error') {
            return (
                <div className={`${styles.status} ${styles.error}`}>
                    {translator(messages.draftsLoadError)}
                </div>
            );
        }

        if (drafts.length === 0) {
            return null;
        }

        return (
            <Grid
                gap="large"
                columns={['1fr', '1fr', '1fr']}
                tablet={{ columns: ['1fr', '1fr'] }}
                phoneWide={{ columns: ['1fr'] }}
                phone={{ columns: ['1fr'] }}
            >
                {drafts.map(draft => (
                    <GridItem key={draft.claimId}>
                        <DraftCard
                            draft={draft}
                            onResume={d => void resumeDraft(d)}
                            onDiscard={d => void handleDiscardDraft(d)}
                        />
                    </GridItem>
                ))}
            </Grid>
        );
    };

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

                {drafts.length > 0 && (
                    <section className={styles.draftsSection}>
                        <h2 className={styles.sectionTitle}>
                            {translator(messages.draftsSectionTitle)}
                        </h2>
                        {renderDrafts()}
                    </section>
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
