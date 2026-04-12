import React, { useRef, useState } from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';

import { ThemeChooser } from '@jutro/components';
import { useTranslator } from '@jutro/locale';
import { useEvent } from '@jutro/platform';
import { useTheme } from '@jutro/theme';
import { defaultThemeConfig, themeList } from '@jutro/theme-styles';

import { SettingsCard } from './components/SettingsCard';

import { messages } from './ThemeSettingsCard.messages';

const omittedThemeChooserProps = [
    'storybookComponent',
    'skipPropagation',
    'availableThemes',
];

export const ThemeSettingsCard = ({
    id,
    title,
    availableThemes = themeList,
    theme: initialTheme = defaultThemeConfig,
    onThemeChange,
    onSave,
}) => {
    const translator = useTranslator();
    const themeContext = useTheme();
    const isInputThemeUsed = initialTheme !== defaultThemeConfig;

    const currentTheme = isInputThemeUsed ? initialTheme : themeContext;

    const [theme, setTheme] = useState(currentTheme);

    const ref = useRef(theme);

    const onSaveClickCallback = useEvent(() => {
        themeContext.switchTheme(theme);
        onSave?.(theme);
        ref.current = { ...theme };
    });

    const onCancelClickCallback = useEvent(() => setTheme(ref.current));

    const onThemeChangeCallback = useEvent(selectedTheme => {
        setTheme(selectedTheme);
        onThemeChange?.(selectedTheme);
    });

    return (
        <SettingsCard
            id={id}
            title={title}
            renderContent={isEditMode => (
                <ThemeChooser
                    id="MetadataThemeChooser"
                    label={translator(messages.themeSettingsLabel)}
                    readOnly={!isEditMode}
                    theme={theme}
                    availableThemes={availableThemes}
                    onThemeChange={onThemeChangeCallback}
                    skipPropagation
                />
            )}
            onSaveClick={onSaveClickCallback}
            onCancelClick={onCancelClickCallback}
        />
    );
};

export const themeSettingsCardPropTypes = {
    ...omit(ThemeChooser.propTypes, omittedThemeChooserProps),
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    onSave: PropTypes.func,
};

ThemeSettingsCard.propTypes = themeSettingsCardPropTypes;

ThemeSettingsCard.displayName = 'ThemeSettingsCard';
