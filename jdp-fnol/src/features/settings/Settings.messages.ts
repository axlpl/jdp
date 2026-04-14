import { defineMessages } from 'react-intl';

export default defineMessages({
    pageTitle: {
        id: 'jdp.settings.title',
        defaultMessage: 'Settings',
    },
    pageSubtitle: {
        id: 'jdp.settings.subtitle',
        defaultMessage:
            'Personalise how this application looks and speaks to you.',
    },
    sectionGlobalization: {
        id: 'jdp.settings.section.globalization',
        defaultMessage: 'Language & region',
    },
    sectionGlobalizationDescription: {
        id: 'jdp.settings.section.globalization.description',
        defaultMessage:
            'Select the language and locale used to format dates, numbers and currencies.',
    },
    languageLabel: {
        id: 'jdp.settings.language.label',
        defaultMessage: 'Language',
    },
    localeLabel: {
        id: 'jdp.settings.locale.label',
        defaultMessage: 'Locale',
    },
    sectionTheme: {
        id: 'jdp.settings.section.theme',
        defaultMessage: 'Theme',
    },
    sectionThemeDescription: {
        id: 'jdp.settings.section.theme.description',
        defaultMessage: 'Choose how the application looks.',
    },
    sectionAbout: {
        id: 'jdp.settings.section.about',
        defaultMessage: 'About',
    },
    aboutAppVersion: {
        id: 'jdp.settings.about.appVersion',
        defaultMessage: 'Application version',
    },
    aboutJutroVersion: {
        id: 'jdp.settings.about.jutroVersion',
        defaultMessage: 'Jutro version',
    },
    aboutApiMode: {
        id: 'jdp.settings.about.apiMode',
        defaultMessage: 'API mode',
    },
    aboutApiModeMocked: {
        id: 'jdp.settings.about.apiMode.mocked',
        defaultMessage: 'Mocked (local fixtures)',
    },
    aboutApiModeLive: {
        id: 'jdp.settings.about.apiMode.live',
        defaultMessage: 'Live (PolicyCenter + ClaimCenter)',
    },
});
