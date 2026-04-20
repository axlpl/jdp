import React from 'react';

import type {
    DriverInput,
    FnolDraft,
    PolicyContact,
} from '../../../types/domain';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import { NewDriverModal } from './NewDriverModal';
import { ResourcePicker } from './ResourcePicker';

const formatDriver = (d: DriverInput): string =>
    [d.firstName, d.lastName].filter(Boolean).join(' ');

type Props = {
    contacts: PolicyContact[];
    draft: FnolDraft;
    errorMessage?: import('@jutro/prop-types').IntlMessageShape;
};

export const DriverPicker = ({
    contacts,
    draft,
    errorMessage,
}: Props) => {
    const flow = useFlow<FnolDraft>();

    return (
        <ResourcePicker
            errorMessage={errorMessage}
            idPrefix="driver"
            items={contacts}
            pickedId={draft.driverId}
            newValue={draft.newDriver}
            onPick={id => flow.setValue('driverId', id)}
            onSetNew={value => flow.setValue('newDriver', value)}
            onClearNew={() => flow.setValue('newDriver', null)}
            renderModal={initial => (
                <NewDriverModal initialValue={initial} />
            )}
            formatNewSummary={formatDriver}
            labels={{
                sectionTitle: messages.driverSectionTitle,
                pickLabel: messages.driverPickLabel,
                addButton: messages.driverAddButton,
                editButton: messages.driverEditButton,
                customOption: messages.driverCustomOption,
            }}
        />
    );
};
