import React, { useState } from 'react';

import { InputField } from '@jutro/legacy/components';

import type { VehicleInput } from '../../../types/domain';
import { EMPTY_VEHICLE } from '../../../types/inputs';
import {
    MAX_LEN,
    isNonEmpty,
    isYearOrEmpty,
} from '../../../types/validators';
import messages from '../Fnol.messages';

import { FormModalShell } from './FormModalShell';

type Props = {
    isOpen?: boolean;
    onResolve?: (value: VehicleInput) => void;
    onReject?: () => void;
    initialValue?: VehicleInput | null;
};

export const NewVehicleModal = ({
    isOpen = true,
    onResolve,
    onReject,
    initialValue,
}: Props) => {
    const [value, setValue] = useState<VehicleInput>(
        initialValue ?? EMPTY_VEHICLE
    );

    const patch = (p: Partial<VehicleInput>) =>
        setValue(v => ({ ...v, ...p }));

    const yearInvalid = !isYearOrEmpty(value.year);
    const canSave =
        isNonEmpty(value.make) &&
        isNonEmpty(value.model) &&
        !yearInvalid;

    return (
        <FormModalShell
            isOpen={isOpen}
            title={messages.modalNewVehicleTitle}
            onCancel={() => onReject?.()}
            onSave={() => onResolve?.(value)}
            canSave={canSave}
        >
            <InputField
                id="modalVehYear"
                label={messages.vehicleYearLabel}
                value={value.year}
                onValueChange={(v: string) => patch({ year: v })}
                validationMessages={
                    yearInvalid ? [messages.vehicleYearInvalid] : undefined
                }
                showErrors={yearInvalid}
            />
            <InputField
                id="modalVehMake"
                label={messages.vehicleMakeLabel}
                value={value.make}
                maxLength={MAX_LEN.vehicleMake}
                onValueChange={(v: string) => patch({ make: v })}
                required
                showRequired
            />
            <InputField
                id="modalVehModel"
                label={messages.vehicleModelLabel}
                value={value.model}
                maxLength={MAX_LEN.vehicleModel}
                onValueChange={(v: string) => patch({ model: v })}
                required
                showRequired
            />
            <InputField
                id="modalVehVin"
                label={messages.vehicleVinLabel}
                value={value.vin}
                maxLength={MAX_LEN.vehicleVin}
                onValueChange={(v: string) => patch({ vin: v })}
            />
            <InputField
                id="modalVehPlate"
                label={messages.vehiclePlateLabel}
                value={value.licensePlate}
                maxLength={MAX_LEN.vehiclePlate}
                onValueChange={(v: string) => patch({ licensePlate: v })}
            />
        </FormModalShell>
    );
};
