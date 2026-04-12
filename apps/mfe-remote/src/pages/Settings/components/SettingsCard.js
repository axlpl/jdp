import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Card } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { useEvent } from '@jutro/platform';

import { EditCancelSaveTitleBar } from './EditCancelSaveTitleBar';

import { messages } from './SettingsCard.messages';

import styles from './SettingsCard.module.scss';

export const SettingsCard = ({
    id,
    title,
    renderContent,
    onSaveClick,
    onCancelClick,
    readOnly,
}) => {
    const translator = useTranslator();
    const [isEditMode, setEditMode] = useState(false);

    const labels = {
        edit: translator(messages.editButtonLabel),
        save: translator(messages.saveButtonLabel),
        cancel: translator(messages.cancelButtonLabel),
    };

    const onEditClickCallback = useEvent(() => setEditMode(true));

    const onSaveClickCallback = useEvent(() => {
        setEditMode(false);
        onSaveClick?.();
    });

    const onCancelClickCallback = useEvent(() => {
        setEditMode(false);
        onCancelClick?.();
    });

    return (
        <Card
            id={id}
            className={cx(styles.settingsCard, styles.settingsCardContainer)}
        >
            <EditCancelSaveTitleBar
                title={title}
                labels={labels}
                readOnly={readOnly}
                isEditMode={isEditMode}
                onEditClick={onEditClickCallback}
                onCancelClick={onCancelClickCallback}
                onSaveClick={onSaveClickCallback}
            />
            <div className={styles.settingsCardContent}>
                {renderContent && renderContent(isEditMode)}
            </div>
        </Card>
    );
};

SettingsCard.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    onSaveClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    readOnly: PropTypes.bool,
    renderContent: PropTypes.func.isRequired,
};
