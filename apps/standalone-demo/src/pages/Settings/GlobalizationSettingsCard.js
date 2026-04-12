import React, { useRef, useState } from 'react';
import { omit, pick, set } from 'lodash/fp';
import PropTypes from 'prop-types';

import { GlobalizationChooser } from '@jutro/components';
import { useLanguage, useLocale, useTranslator } from '@jutro/locale';
import { useEvent } from '@jutro/platform';

import { SettingsCard } from './components/SettingsCard';

import { messages } from './GlobalizationSettingsCard.messages';

const omittedGlobalizationChooserProps = [
    'onLocaleValueChange',
    'onLanguageValueChange',
];

const pickedValuesProps = ['languageValue', 'localeValue'];

export const GlobalizationSettingsCard = ({
    id,
    onLanguageChange,
    onLocaleChange,
    languageValue: languageValueProp,
    localeValue: localeValueProp,
    ...gcProps
}) => {
    const translator = useTranslator();

    const localeContext = useLocale();
    const languageContext = useLanguage();
    const currentLanguage = languageContext.language;
    const currentLocale = localeContext.locale;
    const languageValue = languageValueProp || currentLanguage;
    const localeValue = localeValueProp || currentLocale;
    const [data, setData] = useState({
        languageValue,
        localeValue,
    });

    const ref = useRef({ ...data });

    const updateLocale = useEvent(newLocale => {
        localeContext?.localeOnChangeCallback?.(newLocale);
    });

    const updateLanguage = useEvent(newLanguage => {
        languageContext?.languageOnChangeCallback?.(newLanguage);
    });

    const onSaveCallback = useEvent(() => {
        if (currentLocale !== data.localeValue) {
            updateLocale(data.localeValue);
        }

        if (currentLanguage !== data.languageValue) {
            updateLanguage(data.languageValue);
        }

        ref.current = { ...data };
    });

    const onCancelCallback = useEvent(() => {
        setData({ ...data, ...ref.current });
    });

    const onLanguageValueChange = useEvent(lang => {
        setData(set('languageValue', lang, data));
        onLanguageChange?.(lang);
    });

    const onLocaleValueChange = useEvent(locale => {
        setData(set('localeValue', locale, data));
        onLocaleChange?.(locale);
    });

    return (
        <SettingsCard
            id={id}
            title={translator(messages.globSettingsTitle)}
            renderContent={isEditMode => (
                <GlobalizationChooser
                    {...gcProps}
                    readOnly={!isEditMode}
                    languageValue={data.languageValue}
                    localeValue={data.localeValue}
                    onLanguageValueChange={onLanguageValueChange}
                    onLocaleValueChange={onLocaleValueChange}
                    containerStyle="inlineWithIndent"
                    skipPropagation
                />
            )}
            onSaveClick={onSaveCallback}
            onCancelClick={onCancelCallback}
        />
    );
};

export const globalizationSettingsProps = {
    ...omit(omittedGlobalizationChooserProps, GlobalizationChooser.propTypes),
    ...pick(pickedValuesProps, GlobalizationChooser.propTypes),
    id: PropTypes.string,
    onLocaleChange: PropTypes.func,
    onLanguageChange: PropTypes.func,
};

GlobalizationSettingsCard.propTypes = globalizationSettingsProps;
GlobalizationSettingsCard.displayName = 'GlobalizationSettingsCard';
