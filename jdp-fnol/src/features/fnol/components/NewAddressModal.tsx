import React, { useState } from 'react';

import { InputField } from '@jutro/legacy/components';

import type { AddressInput } from '../../../types/domain';
import { EMPTY_ADDRESS } from '../../../types/inputs';
import { MAX_LEN, isNonEmpty } from '../../../types/validators';
import messages from '../Fnol.messages';

import { FormModalShell } from './FormModalShell';

type Props = {
    isOpen?: boolean;
    onResolve?: (value: AddressInput) => void;
    onReject?: () => void;
    initialValue?: AddressInput | null;
};

export const NewAddressModal = ({
    isOpen = true,
    onResolve,
    onReject,
    initialValue,
}: Props) => {
    const [value, setValue] = useState<AddressInput>(
        initialValue ?? EMPTY_ADDRESS
    );

    const patch = (p: Partial<AddressInput>) =>
        setValue(v => ({ ...v, ...p }));

    const canSave =
        isNonEmpty(value.addressLine1) &&
        isNonEmpty(value.city) &&
        isNonEmpty(value.postalCode);

    return (
        <FormModalShell
            isOpen={isOpen}
            title={messages.modalNewAddressTitle}
            onCancel={() => onReject?.()}
            onSave={() => onResolve?.(value)}
            canSave={canSave}
        >
            <InputField
                id="modalAddrLine1"
                label={messages.addressLine1Label}
                value={value.addressLine1}
                maxLength={MAX_LEN.addressLine}
                onValueChange={(v: string) => patch({ addressLine1: v })}
                required
                showRequired
            />
            <InputField
                id="modalAddrLine2"
                label={messages.addressLine2Label}
                value={value.addressLine2 ?? ''}
                maxLength={MAX_LEN.addressLine}
                onValueChange={(v: string) =>
                    patch({ addressLine2: v || null })
                }
            />
            <InputField
                id="modalAddrCity"
                label={messages.addressCityLabel}
                value={value.city}
                maxLength={MAX_LEN.city}
                onValueChange={(v: string) => patch({ city: v })}
                required
                showRequired
            />
            <InputField
                id="modalAddrState"
                label={messages.addressStateLabel}
                value={value.state ?? ''}
                maxLength={MAX_LEN.addressLine}
                onValueChange={(v: string) =>
                    patch({ state: v || null })
                }
            />
            <InputField
                id="modalAddrPostal"
                label={messages.addressPostalLabel}
                value={value.postalCode}
                maxLength={MAX_LEN.postalCode}
                onValueChange={(v: string) => patch({ postalCode: v })}
                required
                showRequired
            />
            <InputField
                id="modalAddrCountry"
                label={messages.addressCountryLabel}
                value={value.country ?? ''}
                onValueChange={(v: string) =>
                    patch({ country: v || null })
                }
            />
        </FormModalShell>
    );
};
