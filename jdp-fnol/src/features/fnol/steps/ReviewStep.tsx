import React, { ReactNode, useMemo } from 'react';

import { Icon } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type { FnolDraft, LossCause } from '../../../types/domain';
import { formatDate } from '../../../utils/date';
import { usePolicies } from '../../policies/PoliciesContext';
import { useFnol } from '../FnolContext';
import messages from '../Fnol.messages';
import { LOSS_CAUSES } from '../lossCauses';

import styles from '../Fnol.module.scss';

type ReviewField = {
    key: string;
    label: string;
    value: ReactNode;
};

type ReviewSection = {
    key: string;
    title: string;
    icon: string;
    fields: ReviewField[];
};

const lossCauseLabel = (code: FnolDraft['lossCause']): string => {
    if (!code) {
        return '';
    }
    const found: LossCause | undefined = LOSS_CAUSES.find(
        c => c.code === code
    );

    return found?.displayName ?? code;
};

export const ReviewStep = () => {
    const translator = useTranslator();
    const { draft } = useFnol();
    const { getByNumber } = usePolicies();

    const policy =
        draft.policyNumber != null ? getByNumber(draft.policyNumber) : undefined;

    const dash = translator(messages.reviewNotProvided);
    const renderValue = (value: string | null | undefined): ReactNode =>
        value && value.trim() !== '' ? value : dash;
    const renderBool = (value: boolean | null): ReactNode => {
        if (value === null) {
            return dash;
        }

        return value
            ? translator(messages.reviewYes)
            : translator(messages.reviewNo);
    };

    const sections: ReviewSection[] = useMemo(
        () => [
            {
                key: 'policy',
                title: translator(messages.reviewSectionPolicy),
                icon: 'gw-assignment',
                fields: [
                    {
                        key: 'policyNumber',
                        label: translator(messages.reviewFieldPolicyNumber),
                        value: renderValue(draft.policyNumber),
                    },
                    {
                        key: 'vehicle',
                        label: translator(messages.reviewFieldVehicle),
                        value: policy
                            ? `${policy.vehicleDescription} · ${policy.licensePlate}`
                            : dash,
                    },
                ],
            },
            {
                key: 'incident',
                title: translator(messages.reviewSectionIncident),
                icon: 'gw-calendar-today',
                fields: [
                    {
                        key: 'date',
                        label: translator(messages.reviewFieldDate),
                        value: formatDate(draft.dateOfLoss) || dash,
                    },
                    {
                        key: 'time',
                        label: translator(messages.reviewFieldTime),
                        value: renderValue(draft.timeOfLoss),
                    },
                    {
                        key: 'cause',
                        label: translator(messages.reviewFieldCause),
                        value: lossCauseLabel(draft.lossCause) || dash,
                    },
                    {
                        key: 'description',
                        label: translator(messages.reviewFieldDescription),
                        value: renderValue(draft.lossDescription),
                    },
                    {
                        key: 'location',
                        label: translator(messages.reviewFieldLocation),
                        value: renderValue(draft.lossLocation),
                    },
                    {
                        key: 'impact',
                        label: translator(messages.reviewFieldImpact),
                        value: renderValue(draft.pointOfImpact),
                    },
                    {
                        key: 'driveable',
                        label: translator(messages.reviewFieldDriveable),
                        value: renderBool(draft.vehicleDriveable),
                    },
                    {
                        key: 'phone',
                        label: translator(messages.reviewFieldReporterPhone),
                        value: renderValue(draft.reporterPhone),
                    },
                ],
            },
            {
                key: 'other',
                title: translator(messages.reviewSectionOther),
                icon: 'gw-info-outline',
                fields: [
                    {
                        key: 'injuries',
                        label: translator(messages.reviewFieldInjuries),
                        value: renderBool(draft.injuriesInvolved),
                    },
                    ...(draft.injuriesInvolved
                        ? [
                              {
                                  key: 'injuryDescription',
                                  label: translator(
                                      messages.reviewFieldInjuryDescription
                                  ),
                                  value: renderValue(draft.injuryDescription),
                              },
                          ]
                        : []),
                    {
                        key: 'policeCalled',
                        label: translator(messages.reviewFieldPoliceCalled),
                        value: renderBool(draft.policeCalled),
                    },
                    ...(draft.policeCalled
                        ? [
                              {
                                  key: 'policeReport',
                                  label: translator(
                                      messages.reviewFieldPoliceReport
                                  ),
                                  value: renderValue(draft.policeReportNumber),
                              },
                          ]
                        : []),
                    {
                        key: 'otherPartyName',
                        label: translator(messages.reviewFieldOtherPartyName),
                        value: renderValue(draft.otherPartyName),
                    },
                    {
                        key: 'otherPartyPhone',
                        label: translator(messages.reviewFieldOtherPartyPhone),
                        value: renderValue(draft.otherPartyPhone),
                    },
                    {
                        key: 'otherPartyInsurer',
                        label: translator(
                            messages.reviewFieldOtherPartyInsurer
                        ),
                        value: renderValue(draft.otherPartyInsurer),
                    },
                    {
                        key: 'otherPartyPlate',
                        label: translator(messages.reviewFieldOtherPartyPlate),
                        value: renderValue(draft.otherPartyPlate),
                    },
                    {
                        key: 'witnesses',
                        label: translator(messages.reviewFieldWitnesses),
                        value: renderValue(draft.witnessDetails),
                    },
                    {
                        key: 'photos',
                        label: translator(messages.reviewFieldPhotos),
                        value:
                            draft.photoCount > 0
                                ? String(draft.photoCount)
                                : dash,
                    },
                ],
            },
        ],
        [draft, policy, dash, translator]
    );

    return (
        <WizardPage
            id="reviewStep"
            title={messages.stepReviewTitle}
            panelClassName={styles.panel}
        >
            <div className={styles.stepContent}>
                <p className={styles.prompt}>
                    {translator(messages.stepReviewHeading)}
                </p>

                {sections.map(section => (
                    <section
                        key={section.key}
                        className={styles.reviewSection}
                    >
                        <h3 className={styles.reviewSectionTitle}>
                            <Icon icon={section.icon} />
                            {section.title}
                        </h3>
                        <dl className={styles.reviewList}>
                            {section.fields.map(field => (
                                <React.Fragment key={field.key}>
                                    <dt className={styles.reviewLabel}>
                                        {field.label}
                                    </dt>
                                    <dd className={styles.reviewValue}>
                                        {field.value}
                                    </dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </section>
                ))}
            </div>
        </WizardPage>
    );
};
