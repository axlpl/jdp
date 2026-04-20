import React, { ReactNode } from 'react';

import {
    Button,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalNext,
} from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import type { IntlMessageShape } from '@jutro/prop-types';

import messages from '../Fnol.messages';

import styles from '../Fnol.module.scss';

type Props = {
    isOpen: boolean;
    title: IntlMessageShape;
    onCancel: () => void;
    onSave: () => void;
    canSave: boolean;
    children: ReactNode;
};

export const FormModalShell = ({
    isOpen,
    title,
    onCancel,
    onSave,
    canSave,
    children,
}: Props) => {
    const translator = useTranslator();

    return (
        <ModalNext isOpen={isOpen} onRequestClose={onCancel}>
            <ModalHeader title={translator(title)} onClose={onCancel} />
            <ModalBody>
                <div className={styles.modalForm}>{children}</div>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="tertiary"
                    onClick={onCancel}
                    label={translator(messages.modalCancel)}
                />
                <Button
                    onClick={onSave}
                    disabled={!canSave}
                    label={translator(messages.modalSave)}
                />
            </ModalFooter>
        </ModalNext>
    );
};
