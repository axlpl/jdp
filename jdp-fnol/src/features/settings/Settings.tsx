import React from 'react';

import {
    Card,
    GlobalizationChooser,
    ThemeChooser,
} from '@jutro/components';
import { useLanguage, useLocale, useTranslator } from '@jutro/locale';
import type { ThemeConfig } from '@jutro/theme';
import { useTheme } from '@jutro/theme';
import {
    consumerThemeConfig,
    defaultThemeConfig,
    generalThemeConfig,
} from '@jutro/theme-styles';

import { PageLayout } from '../../components/PageLayout';
import { runtimeConfig } from '../../config/runtime';
import themesConfig from '../../.themesConfig.json';

import messages from './Settings.messages';

import styles from './Settings.module.scss';

const customThemes = Object.values(
    themesConfig as Record<string, ThemeConfig>
);

const availableThemes: ThemeConfig[] = [
    defaultThemeConfig,
    consumerThemeConfig,
    generalThemeConfig,
    ...customThemes,
];

type AboutEntry = {
    label: string;
    value: string;
};

export const Settings = () => {
    const translator = useTranslator();
    const {
        availableLocales,
        locale,
        localeOnChangeCallback,
    } = useLocale();
    const {
        availableLanguages,
        language,
        languageOnChangeCallback,
    } = useLanguage();
    const { config: currentTheme, switchTheme } = useTheme();

    const about: AboutEntry[] = [
        {
            label: translator(messages.aboutAppVersion),
            value: '1.0.0',
        },
        {
            label: translator(messages.aboutJutroVersion),
            value: '10.13.1',
        },
        {
            label: translator(messages.aboutApiMode),
            value: translator(
                runtimeConfig.useMocks
                    ? messages.aboutApiModeMocked
                    : messages.aboutApiModeLive
            ),
        },
    ];

    return (
        <PageLayout>
            <div className={styles.settings}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {translator(messages.pageTitle)}
                    </h1>
                    <p className={styles.subtitle}>
                        {translator(messages.pageSubtitle)}
                    </p>
                </header>

                <Card
                    isPanel
                    title={translator(messages.sectionGlobalization)}
                >
                    <div className={styles.section}>
                        <p className={styles.sectionDescription}>
                            {translator(messages.sectionGlobalizationDescription)}
                        </p>
                        <GlobalizationChooser
                            localeId="settingsLocale"
                            languageId="settingsLanguage"
                            localeValue={locale}
                            languageValue={language}
                            availableLocaleValues={availableLocales}
                            availableLanguageValues={availableLanguages}
                            languageLabelText={translator(messages.languageLabel)}
                            localeLabelText={translator(messages.localeLabel)}
                            onLocaleValueChange={localeOnChangeCallback}
                            onLanguageValueChange={languageOnChangeCallback}
                            showLocaleLabel
                            showLanguageLabel
                            showLocaleSelect
                            showLanguageSelect
                        />
                    </div>
                </Card>

                <Card isPanel title={translator(messages.sectionTheme)}>
                    <div className={styles.section}>
                        <p className={styles.sectionDescription}>
                            {translator(messages.sectionThemeDescription)}
                        </p>
                        <ThemeChooser
                            availableThemes={availableThemes}
                            theme={currentTheme}
                            onThemeChange={switchTheme}
                        />
                    </div>
                </Card>

                <Card isPanel title={translator(messages.sectionAbout)}>
                    <dl className={styles.aboutList}>
                        {about.map(entry => (
                            <React.Fragment key={entry.label}>
                                <dt className={styles.aboutLabel}>
                                    {entry.label}
                                </dt>
                                <dd className={styles.aboutValue}>
                                    {entry.value}
                                </dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </Card>
            </div>
        </PageLayout>
    );
};
