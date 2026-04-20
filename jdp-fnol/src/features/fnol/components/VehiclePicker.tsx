import React from 'react';

import type {
    FnolDraft,
    PolicyVehicle,
    VehicleInput,
} from '../../../types/domain';
import { useFlow } from '../flow/FlowContext';
import messages from '../Fnol.messages';

import { NewVehicleModal } from './NewVehicleModal';
import { ResourcePicker } from './ResourcePicker';

const formatVehicle = (v: VehicleInput): string => {
    const parts = [v.year, v.make, v.model].filter(Boolean).join(' ');
    const plate = v.licensePlate ? ` · ${v.licensePlate}` : '';

    return parts ? `${parts}${plate}` : v.vin || '';
};

type Props = {
    vehicles: PolicyVehicle[];
    draft: FnolDraft;
    errorMessage?: import('@jutro/prop-types').IntlMessageShape;
};

export const VehiclePicker = ({
    vehicles,
    draft,
    errorMessage,
}: Props) => {
    const flow = useFlow<FnolDraft>();

    return (
        <ResourcePicker
            errorMessage={errorMessage}
            idPrefix="vehicle"
            items={vehicles}
            pickedId={draft.vehicleId}
            newValue={draft.newVehicle}
            onPick={id => flow.setValue('vehicleId', id)}
            onSetNew={value => flow.setValue('newVehicle', value)}
            onClearNew={() => flow.setValue('newVehicle', null)}
            renderModal={initial => (
                <NewVehicleModal initialValue={initial} />
            )}
            formatNewSummary={formatVehicle}
            labels={{
                sectionTitle: messages.vehicleSectionTitle,
                pickLabel: messages.vehiclePickLabel,
                addButton: messages.vehicleAddButton,
                editButton: messages.vehicleEditButton,
                customOption: messages.vehicleCustomOption,
            }}
        />
    );
};
