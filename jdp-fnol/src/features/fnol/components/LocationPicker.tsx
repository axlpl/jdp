import React from 'react';

import type {
    AddressInput,
    FnolDraft,
    PolicyLocation,
} from '../../../types/domain';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import { NewAddressModal } from './NewAddressModal';
import { ResourcePicker } from './ResourcePicker';

const formatAddress = (a: AddressInput): string =>
    [a.addressLine1, a.city, a.state, a.postalCode]
        .filter(Boolean)
        .join(', ');

type Props = {
    locations: PolicyLocation[];
    draft: FnolDraft;
    errorMessage?: import('@jutro/prop-types').IntlMessageShape;
};

export const LocationPicker = ({
    locations,
    draft,
    errorMessage,
}: Props) => {
    const flow = useFlow<FnolDraft>();

    return (
        <ResourcePicker
            errorMessage={errorMessage}
            idPrefix="lossLocation"
            items={locations}
            pickedId={draft.lossLocationId}
            newValue={draft.newLossAddress}
            onPick={id => flow.setValue('lossLocationId', id)}
            onSetNew={value => flow.setValue('newLossAddress', value)}
            onClearNew={() => flow.setValue('newLossAddress', null)}
            renderModal={initial => (
                <NewAddressModal initialValue={initial} />
            )}
            formatNewSummary={formatAddress}
            labels={{
                sectionTitle: messages.locationSectionTitle,
                pickLabel: messages.locationPickLabel,
                addButton: messages.locationAddButton,
                editButton: messages.locationEditButton,
                customOption: messages.locationCustomOption,
            }}
        />
    );
};
