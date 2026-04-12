import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Flex, FlexItem, useBreakpoint } from '@jutro/layout';
import { Button } from '@jutro/components';
import { useTranslator } from '@jutro/locale';

import styles from './EditCancelSaveTitleBar.module.scss';

const ActionTitleBar = props => {
    const { breakpointProps } = useBreakpoint(props);

    const childrenArray = React.Children.toArray(breakpointProps.children);

    const isTitleElement = child => child.type === TitleElement;

    const titleElements = childrenArray.filter(isTitleElement);
    const actions = childrenArray.filter(child => !isTitleElement(child));

    return (
        <div
            role="group"
            className={cx(
                styles.actionTitleBar,
                styles.actionTitleBarContainer
            )}
        >
            <div
                data-testid="title-container"
                className={cx(styles.titleContainer)}
            >
                {titleElements}
            </div>

            <div role="toolbar" className={cx(styles.toolbar)}>
                {actions}
            </div>
        </div>
    );
};

const TitleElement = ({ children }) => (
    <Flex className={cx(styles.titleElement)} alignItems="stretch">
        {children}
    </Flex>
);

const ViewModeAction = ({ onEditClick, label }) => (
    <Button onClick={onEditClick} label={label} />
);

const EditModeAction = ({
    isSaveEnabled,
    labels,
    onSaveClick,
    onCancelClick,
}) => (
    <Flex gap="small">
        <FlexItem grow="1">
            <Button
                variant="secondary"
                onClick={onCancelClick}
                label={labels.cancel}
            />
        </FlexItem>
        <FlexItem grow="1">
            <Button
                onClick={onSaveClick}
                disabled={!isSaveEnabled}
                label={labels.save}
            />
        </FlexItem>
    </Flex>
);

const EditCancelSaveActions = ({
    labels,
    onEditClick,
    onSaveClick,
    onCancelClick,
    isEditMode,
    isSaveEnabled,
}) => {
    if (isEditMode) {
        return (
            <EditModeAction
                labels={labels}
                onSaveClick={onSaveClick}
                onCancelClick={onCancelClick}
                isSaveEnabled={isSaveEnabled}
            />
        );
    }

    return <ViewModeAction label={labels.edit} onEditClick={onEditClick} />;
};

export const EditCancelSaveTitleBar = props => {
    const { breakpointProps } = useBreakpoint(props);
    const {
        title,
        labels,
        onEditClick,
        onSaveClick,
        onCancelClick,
        isEditMode = false,
        isSaveEnabled = true,
        readOnly = false,
    } = breakpointProps;
    const translator = useTranslator();

    const actions = () => {
        if (readOnly) {
            return null;
        }

        return (
            <EditCancelSaveActions
                labels={labels}
                onEditClick={onEditClick}
                onSaveClick={onSaveClick}
                onCancelClick={onCancelClick}
                isEditMode={isEditMode}
                isSaveEnabled={isSaveEnabled}
            />
        );
    };

    return (
        <ActionTitleBar>
            <TitleElement>
                <h4 className={cx(styles.title)}>{translator(title)}</h4>
            </TitleElement>
            {actions()}
        </ActionTitleBar>
    );
};

const editCancelSaveTitleBarBasePropTypes = {
    /**
     * Title to render inside title bar
     */
    title: PropTypes.string,
    /**
     * If true action buttons are not rendered
     */
    readOnly: PropTypes.bool,
    /**
     * Callback invoked on edit button click, () => void
     */
    onEditClick: PropTypes.func.isRequired,
    /**
     * Callback invoked on save button click, () => void
     */
    onSaveClick: PropTypes.func.isRequired,
    /**
     * Callback invoked on cancel button click, () => void
     */
    onCancelClick: PropTypes.func.isRequired,
    /**
     * Labels for rendered buttons
     */
    labels: PropTypes.shape({
        edit: PropTypes.string.isRequired,
        save: PropTypes.string.isRequired,
        cancel: PropTypes.string.isRequired,
    }).isRequired,
    /**
     * If true save and cancel buttons will be rendered
     */
    isEditMode: PropTypes.bool,
    /**
     * Enables the save button
     */
    isSaveEnabled: PropTypes.bool,
};

EditCancelSaveTitleBar.propTypes = {
    ...editCancelSaveTitleBarBasePropTypes,
    phone: PropTypes.shape(editCancelSaveTitleBarBasePropTypes),
    phoneWide: PropTypes.shape(editCancelSaveTitleBarBasePropTypes),
    tablet: PropTypes.shape(editCancelSaveTitleBarBasePropTypes),
};

EditCancelSaveTitleBar.displayName = 'EditCancelSaveTitleBar';
