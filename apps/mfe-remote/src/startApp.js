import '@jutro/theme';

import { start as standaloneStart } from '@jutro/app';
import { start as mfeStart } from '@jutro/micro-frontends';
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
    name: 'mfe-remote-g11n-store',
});

const isRunningInsideIframe = () => {
    try {
        return window.top !== window.self;
    } catch (e) {
        return true;
    }
};

export const startApp = () => {
    if (process.env.NODE_ENV !== 'production') {
        warning(
            `Jutro App is running with NODE_ENV=${process.env.NODE_ENV} which may have a performance impact.`
        );
    }

    const launchProps = {
        rootId: 'root',
        messageLoader: loadAppMessages,
        coreMessageLoader: loadCoreMessages,
        appName: messages.appName,
        appDescription: messages.appDescription,
        themeConfig: themes.sampleTheme,
        g11nStore,
    };

    if (isRunningInsideIframe()) {
        mfeStart(Jutro, launchProps);
    } else {
        standaloneStart(Jutro, launchProps);
    }
};
