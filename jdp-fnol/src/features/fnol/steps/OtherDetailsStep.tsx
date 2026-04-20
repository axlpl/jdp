import React, { useMemo } from 'react';

import {
    InputField,
    RadioField,
    TextAreaField,
} from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { WizardPage } from '@jutro/wizard-next';

import type { FnolDraft } from '../../../types/domain';
import { useFnol } from '../FnolContext';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import styles from '../Fnol.module.scss';

export const OtherDetailsStep = () => {
    const translator = useTranslator();
    const { draft } = useFnol();
    const flow = useFlow<FnolDraft>();

    const yesNoValues = useMemo(
        () => [
            { code: 'yes', name: translator(messages.reviewYes) },
            { code: 'no', name: translator(messages.reviewNo) },
        ],
        [translator]
    );

    const toCode = (value: boolean | null): string | undefined =>
        value == null ? undefined : value ? 'yes' : 'no';

    const handlePhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
        flow.setValue('photoCount', event.target.files?.length ?? 0);
    };

    return (
        <WizardPage
            id="otherDetailsStep"
            title={messages.stepOtherTitle}
            panelClassName={styles.panel}
        >
            <div className={styles.stepContent}>
                <p className={styles.prompt}>
                    {translator(messages.stepOtherHeading)}
                </p>

                <RadioField
                    id="injuriesInvolved"
                    label={messages.stepOtherInjuriesLabel}
                    availableValues={yesNoValues}
                    value={toCode(draft.injuriesInvolved)}
                    onValueChange={(value: string) => {
                        const flag = value === 'yes';

                        flow.setValue('injuriesInvolved', flag);
                        if (!flag) {
                            flow.setValue('injuryDescription', null);
                        }
                    }}
                />

                {draft.injuriesInvolved && (
                    <TextAreaField
                        id="injuryDescription"
                        label={messages.stepOtherInjuryDescriptionLabel}
                        value={draft.injuryDescription ?? ''}
                        onValueChange={(value: string) =>
                            flow.setValue('injuryDescription', value)
                        }
                    />
                )}

                <RadioField
                    id="policeCalled"
                    label={messages.stepOtherPoliceCalledLabel}
                    availableValues={yesNoValues}
                    value={toCode(draft.policeCalled)}
                    onValueChange={(value: string) =>
                        flow.setValue('policeCalled', value === 'yes')
                    }
                />

                {draft.policeCalled && (
                    <InputField
                        id="policeReportNumber"
                        label={messages.stepOtherPoliceReportLabel}
                        value={draft.policeReportNumber ?? ''}
                        onValueChange={(value: string) =>
                            flow.setValue('policeReportNumber', value)
                        }
                    />
                )}

                <section className={styles.otherPartySection}>
                    <h4 className={styles.subsectionTitle}>
                        {translator(messages.stepOtherOtherPartyHeading)}
                    </h4>

                    <InputField
                        id="otherPartyName"
                        label={messages.stepOtherOtherPartyName}
                        value={draft.otherPartyName ?? ''}
                        onValueChange={(value: string) =>
                            flow.setValue('otherPartyName', value)
                        }
                    />

                    <InputField
                        id="otherPartyPhone"
                        label={messages.stepOtherOtherPartyPhone}
                        inputType="tel"
                        value={draft.otherPartyPhone ?? ''}
                        onValueChange={(value: string) =>
                            flow.setValue('otherPartyPhone', value)
                        }
                    />

                    <InputField
                        id="otherPartyInsurer"
                        label={messages.stepOtherOtherPartyInsurer}
                        value={draft.otherPartyInsurer ?? ''}
                        onValueChange={(value: string) =>
                            flow.setValue('otherPartyInsurer', value)
                        }
                    />

                    <InputField
                        id="otherPartyPlate"
                        label={messages.stepOtherOtherPartyPlate}
                        value={draft.otherPartyPlate ?? ''}
                        onValueChange={(value: string) =>
                            flow.setValue('otherPartyPlate', value)
                        }
                    />
                </section>

                <TextAreaField
                    id="witnessDetails"
                    label={messages.stepOtherWitnessesLabel}
                    value={draft.witnessDetails ?? ''}
                    onValueChange={(value: string) =>
                        flow.setValue('witnessDetails', value)
                    }
                />

                <section className={styles.photoSection}>
                    <h4 className={styles.subsectionTitle}>
                        {translator(messages.stepOtherPhotosHeading)}
                    </h4>
                    <p className={styles.subsectionHint}>
                        {translator(messages.stepOtherPhotosHint)}
                    </p>
                    <input
                        id="photoUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotos}
                        className={styles.photoInput}
                    />
                    {draft.photoCount > 0 && (
                        <p className={styles.photoCount}>
                            {draft.photoCount}{' '}
                            {draft.photoCount === 1 ? 'photo' : 'photos'}{' '}
                            attached
                        </p>
                    )}
                </section>
            </div>
        </WizardPage>
    );
};
