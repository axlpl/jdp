import React from 'react';

import { Button, Card, InfoLabel } from '@jutro/components';
import { useTranslator } from '@jutro/locale';

import type { DraftSummary } from '../../types/domain';
import { formatDate } from '../../utils/date';

import messages from './Dashboard.messages';

import styles from './PolicyCard.module.scss';

type Props = {
    draft: DraftSummary;
    onResume: (draft: DraftSummary) => void;
    onDiscard: (draft: DraftSummary) => void;
};

export const DraftCard = ({ draft, onResume, onDiscard }: Props) => {
    const translator = useTranslator();

    return (
        <Card isPanel>
            <div className={styles.policyCard}>
                <div className={styles.topRow}>
                    <InfoLabel
                        type="warning"
                        message={translator(messages.draftCardBadge)}
                    />
                </div>

                <div className={styles.identity}>
                    <h3 className={styles.policyNumber}>
                        {draft.claimNumber ?? draft.claimId}
                    </h3>
                    <p className={styles.productName}>
                        {translator(messages.draftCardPolicy, {
                            policyNumber: draft.policyNumber,
                        })}
                    </p>
                </div>

                <div className={styles.metaGrid}>
                    <span className={styles.metaLabel}>
                        {translator(messages.draftCardLossLabel)}
                    </span>
                    <span className={styles.metaValue}>
                        {formatDate(draft.lossDate)}
                    </span>
                    <span className={styles.metaLabel}>
                        {translator(messages.draftCardUpdatedLabel)}
                    </span>
                    <span className={styles.metaValue}>
                        {formatDate(draft.updatedAt)}
                    </span>
                </div>

                <div className={styles.actions}>
                    <Button
                        id={`resumeDraft-${draft.claimId}`}
                        onClick={() => onResume(draft)}
                        label={translator(messages.draftBannerContinue)}
                    />
                    <Button
                        id={`discardDraft-${draft.claimId}`}
                        variant="tertiary"
                        onClick={() => onDiscard(draft)}
                        label={translator(messages.draftBannerDiscard)}
                    />
                </div>
            </div>
        </Card>
    );
};
