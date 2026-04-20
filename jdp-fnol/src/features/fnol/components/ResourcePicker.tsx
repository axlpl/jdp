import React, { ReactElement, useMemo } from 'react';

import { Button, useModal } from '@jutro/components';
import { DropdownSelectField } from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import type { IntlMessageShape } from '@jutro/prop-types';

import styles from '../Fnol.module.scss';

const CUSTOM_CODE = '__custom__';

export type PickableItem = {
    id: string;
    displayName: string;
};

type Labels = {
    sectionTitle: IntlMessageShape;
    pickLabel: IntlMessageShape;
    customOption: IntlMessageShape;
    addButton: IntlMessageShape;
    editButton: IntlMessageShape;
};

type Props<Item extends PickableItem, NewValue> = {
    idPrefix: string;
    items: Item[];
    pickedId: string | null;
    newValue: NewValue | null;
    onPick: (id: string | null) => void;
    onSetNew: (value: NewValue) => void;
    onClearNew: () => void;
    renderModal: (initialValue: NewValue | null) => ReactElement;
    formatNewSummary: (value: NewValue) => string;
    labels: Labels;
    errorMessage?: IntlMessageShape;
};

export const ResourcePicker = <
    Item extends PickableItem,
    NewValue
>({
    idPrefix,
    items,
    pickedId,
    newValue,
    onPick,
    onSetNew,
    onClearNew,
    renderModal,
    formatNewSummary,
    labels,
    errorMessage,
}: Props<Item, NewValue>) => {
    const translator = useTranslator();
    const { showModal } = useModal();

    const options = useMemo(() => {
        const base = items.map(item => ({
            code: item.id,
            name: item.displayName,
        }));

        if (newValue) {
            base.push({
                code: CUSTOM_CODE,
                name: translator(labels.customOption, {
                    value: formatNewSummary(newValue),
                }),
            });
        }

        return base;
    }, [items, newValue, formatNewSummary, labels.customOption, translator]);

    const currentValue = newValue
        ? CUSTOM_CODE
        : pickedId ?? undefined;

    const openModal = async () => {
        try {
            const result = await showModal(renderModal(newValue));

            if (result) {
                onSetNew(result as NewValue);
                onPick(null);
            }
        } catch {
            /* cancelled */
        }
    };

    return (
        <section className={styles.pickerSection}>
            <h4 className={styles.subsectionTitle}>
                {translator(labels.sectionTitle)}
            </h4>

            <div data-invalid={errorMessage ? 'true' : undefined}>
                <DropdownSelectField
                    id={`${idPrefix}Pick`}
                    label={labels.pickLabel}
                    availableValues={options}
                    value={currentValue}
                    onValueChange={(value: string) => {
                        if (value === CUSTOM_CODE) {
                            return;
                        }
                        onPick(value);
                        onClearNew();
                    }}
                    validationMessages={
                        errorMessage ? [errorMessage] : undefined
                    }
                    showErrors={Boolean(errorMessage)}
                    alwaysShowPlaceholder
                />
            </div>

            <Button
                id={`${idPrefix}AddNew`}
                variant="tertiary"
                icon="gw-add"
                onClick={() => {
                    void openModal();
                }}
                label={translator(
                    newValue ? labels.editButton : labels.addButton
                )}
            />
        </section>
    );
};
