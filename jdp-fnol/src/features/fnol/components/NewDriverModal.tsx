import React, { useState } from 'react';

import { InputField } from '@jutro/legacy/components';

import type { DriverInput } from '../../../types/domain';
import { EMPTY_DRIVER } from '../../../types/inputs';
import {
    MAX_LEN,
    isEmailOrEmpty,
    isNonEmpty,
} from '../../../types/validators';
import messages from '../Fnol.messages';

import { FormModalShell } from './FormModalShell';

type Props = {
    isOpen?: boolean;
    onResolve?: (value: DriverInput) => void;
    onReject?: () => void;
    initialValue?: DriverInput | null;
};

export const NewDriverModal = ({
    isOpen = true,
    onResolve,
    onReject,
    initialValue,
}: Props) => {
    const [value, setValue] = useState<DriverInput>(
        initialValue ?? EMPTY_DRIVER
    );

    const patch = (p: Partial<DriverInput>) =>
        setValue(v => ({ ...v, ...p }));

    const emailInvalid = !isEmailOrEmpty(value.email);
    const canSave =
        isNonEmpty(value.firstName) &&
        isNonEmpty(value.lastName) &&
        !emailInvalid;

    return (
        <FormModalShell
            isOpen={isOpen}
            title={messages.modalNewDriverTitle}
            onCancel={() => onReject?.()}
            onSave={() => onResolve?.(value)}
            canSave={canSave}
        >
            <InputField
                id="modalDrvFirstName"
                label={messages.driverFirstNameLabel}
                value={value.firstName}
                maxLength={MAX_LEN.contactFirstName}
                onValueChange={(v: string) => patch({ firstName: v })}
                required
                showRequired
            />
            <InputField
                id="modalDrvLastName"
                label={messages.driverLastNameLabel}
                value={value.lastName}
                maxLength={MAX_LEN.contactLastName}
                onValueChange={(v: string) => patch({ lastName: v })}
                required
                showRequired
            />
            <InputField
                id="modalDrvPhone"
                label={messages.driverPhoneLabel}
                inputType="tel"
                value={value.phone}
                onValueChange={(v: string) => patch({ phone: v })}
            />
            <InputField
                id="modalDrvEmail"
                label={messages.driverEmailLabel}
                inputType="email"
                value={value.email}
                maxLength={MAX_LEN.contactEmail}
                onValueChange={(v: string) => patch({ email: v })}
                validationMessages={
                    emailInvalid ? [messages.driverEmailInvalid] : undefined
                }
                showErrors={emailInvalid}
            />
            <InputField
                id="modalDrvLicense"
                label={messages.driverLicenseLabel}
                value={value.licenseNumber}
                maxLength={MAX_LEN.contactLicense}
                onValueChange={(v: string) => patch({ licenseNumber: v })}
            />
        </FormModalShell>
    );
};
