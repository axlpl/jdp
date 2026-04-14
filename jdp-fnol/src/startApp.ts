import '@jutro/theme';

import { start } from '@jutro/app';
import { loadConfiguration } from '@jutro/config';
import { createG11nLocalStorageStore } from '@jutro/locale';
import { warning } from '@jutro/logger';
import type { ThemeConfig } from '@jutro/theme';
import { consumerThemeConfig } from '@jutro/theme-styles';

import { Jutro } from './app/App';
import messages from './app/App.messages';
import appConfig from './config/config.json';
import { loadAppMessages, loadCoreMessages } from './messagesLoaders';

import './styles/index.scss';

loadConfiguration(appConfig);

const g11nStore = createG11nLocalStorageStore({
    name: 'jdp-fnol-g11n-store',
});

export const startApp = (): void => {
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
        themeConfig: consumerThemeConfig as ThemeConfig,
        g11nStore,
    });
};
