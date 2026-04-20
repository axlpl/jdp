import React, { ReactNode } from 'react';

import { Icon } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type {
    DamageType,
    FnolDraft,
    ImpactArea,
    LossCause,
    VehicleArea,
} from '../../../types/domain';
import { formatDate } from '../../../utils/date';
import { resolvePicked } from '../../../types/mappers';
import { useFnol } from '../FnolContext';
import messages from '../Fnol.messages';
import { LOSS_CAUSES } from '../lossCauses';
import { usePolicyResources } from '../PolicyResourcesContext';

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

const AREA_LABEL: Record<VehicleArea, string> = {
    frontLeft: 'Front left',
    frontCenter: 'Front center',
    frontRight: 'Front right',
    leftSide: 'Left side',
    rightSide: 'Right side',
    rearLeft: 'Rear left',
    rearCenter: 'Rear center',
    rearRight: 'Rear right',
    roof: 'Roof',
};

const DAMAGE_LABEL: Record<DamageType, string> = {
    scratch: 'Scratch',
    dent: 'Dent',
    crack: 'Crack',
    brokenLight: 'Broken light',
    brokenMirror: 'Broken mirror',
    shattered: 'Shattered glass',
    bentFrame: 'Bent frame',
    other: 'Other',
};

type Named = { id: string; displayName: string };

const pickedOrNewLabel = <Item extends Named, Value>(
    pickedId: string | null,
    items: Item[],
    newValue: Value | null,
    formatNew: (v: Value) => string
): string =>
    resolvePicked<Item, Value, string>(
        pickedId,
        items,
        newValue,
        item => item.displayName,
        formatNew
    ) ?? '';

const formatImpactAreas = (areas: ImpactArea[], dash: string): string => {
    if (areas.length === 0) {
        return dash;
    }

    return areas
        .map(a =>
            a.damageType
                ? `${AREA_LABEL[a.area]} - ${DAMAGE_LABEL[a.damageType]}`
                : AREA_LABEL[a.area]
        )
        .join('; ');
};

export const ReviewStep = () => {
    const translator = useTranslator();
    const { draft } = useFnol();
    const { locations, vehicles, contacts } = usePolicyResources();

    const dash = translator(messages.reviewNotProvided);

    const locationLabel = pickedOrNewLabel(
        draft.lossLocationId,
        locations,
        draft.newLossAddress,
        a =>
            [a.addressLine1, a.city, a.state, a.postalCode]
                .filter(Boolean)
                .join(', ')
    );

    const vehicleLabel = pickedOrNewLabel(
        draft.vehicleId,
        vehicles,
        draft.newVehicle,
        v => {
            const parts = [v.year, v.make, v.model]
                .filter(Boolean)
                .join(' ');
            const plate = v.licensePlate ? ` · ${v.licensePlate}` : '';

            return parts ? `${parts}${plate}` : '';
        }
    );

    const driverLabel = pickedOrNewLabel(
        draft.driverId,
        contacts,
        draft.newDriver,
        d => [d.firstName, d.lastName].filter(Boolean).join(' ')
    );

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

    const sections: ReviewSection[] = [
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
                        value: renderValue(locationLabel),
                    },
                    {
                        key: 'vehicle',
                        label: translator(messages.reviewFieldVehicle),
                        value: renderValue(vehicleLabel),
                    },
                    {
                        key: 'impact',
                        label: translator(messages.reviewFieldImpact),
                        value: formatImpactAreas(draft.impactAreas, dash),
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
                        key: 'driver',
                        label: translator(messages.reviewFieldDriver),
                        value: renderValue(driverLabel),
                    },
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
    ];

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
