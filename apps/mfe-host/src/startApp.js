import '@jutro/theme';

import { start } from '@jutro/app';
import { loadConfiguration } from '@jutro/config';
import { createG11nLocalStorageStore } from '@jutro/locale';
import { warning } from '@jutro/logger';

import { Jutro } from './app/App';
import appConfig from './config/config.json';
import themes from './.themesConfig.json';

import messages from './app/App.messages';
import { loadAppMessages, loadCoreMessages } from './messagesLoaders';

import './styles/index.scss';

loadConfiguration(appConfig);

const g11nStore = createG11nLocalStorageStore({
    name: 'jutro-app-template-g11n-store',
});

export const startApp = () => {
    if (process.env.NODE_ENV !== 'production') {
        warning(
            `Jutro App is running with NODE_ENV=${process.env.NODE_ENV} which may have a performance impact.`
        );
    }

    start(Jutro, {
        rootId: 'root',
        messageLoader: loadAppMessages,
        coreMessageLoader: loadCoreMessages,
        appName: messages.appName,
        appDescription: messages.appDescription,
        themeConfig: themes.sampleTheme,
        g11nStore,
    });
};
