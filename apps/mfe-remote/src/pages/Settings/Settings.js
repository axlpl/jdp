import React from 'react';

import { Flex } from '@jutro/layout';
import { useTranslator } from '@jutro/locale';

import { AboutSettingsCard } from './AboutSettingsCard';
import { GlobalizationSettingsCard } from './GlobalizationSettingsCard';
import { NavigationPlacementSettingsCard } from './NavigationPlacementSettingsCard';
import { ThemeSettingsCard } from './ThemeSettingsCard';

import { messages } from './Settings.messages';

export const Settings = () => {
    const translator = useTranslator();

    return (
        <Flex direction="column">
            <h3>{translator(messages.settings)}</h3>

            <GlobalizationSettingsCard id="globalizationSettingsCard" />

            <ThemeSettingsCard
                id="theme-settings-card"
                title={translator(messages.theme)}
                label={translator(messages.currentTheme)}
            />

            <NavigationPlacementSettingsCard
                id="navigation-placement-settings-card"
                title={translator(messages.navigation)}
            />

            <AboutSettingsCard
                id="about-settings-card"
                title={translator(messages.about)}
            />
        </Flex>
    );
};
