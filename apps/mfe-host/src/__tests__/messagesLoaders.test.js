import { log } from '@jutro/logger';

import {
    loadAppMessages,
    loadCoreMessages,
    loadMessages,
} from '../messagesLoaders';

jest.mock(
    '../../i18n/biz-comp-translations/meta.json',
    () => ({ translationsAvailable: true }),
    { virtual: true }
);

describe('loadMessages', () => {
    const logSpy = jest.spyOn(log, 'warning');

    afterEach(() => {
        logSpy.mockClear();
    });

    it('load messages', async () => {
        const messages = await loadMessages({
            lang: 'en',
            loader: lang =>
                new Promise(resolve => {
                    resolve({
                        default: {
                            key: `Message in lang: ${lang}.`,
                        },
                    });
                }),
            source: 'core',
        });

        expect(messages).toEqual({ key: 'Message in lang: en.' });
    });

    it('tries to load fallback messages', async () => {
        const messages = await loadMessages({
            lang: 'xx-ZZ',
            loader: () =>
                new Promise((resolve, reject) => {
                    reject();
                }),
            source: 'core',
        });

        expect(messages).toEqual({});
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load core translations for lang: xx-ZZ. Falling back to: xx.',
            undefined
        );
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load core translations for lang: xx.',
            undefined
        );
    });

    it('loads fallback messages', async () => {
        const messages = await loadMessages({
            lang: 'xx-ZZ',
            loader: lang =>
                new Promise((resolve, reject) => {
                    if (lang === 'xx-ZZ') {
                        reject();
                    }

                    if (lang === 'xx') {
                        resolve({
                            default: {
                                key: `Message in lang: ${lang}.`,
                            },
                        });
                    }
                }),
            source: 'core',
        });

        expect(messages).toEqual({ key: 'Message in lang: xx.' });
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load core translations for lang: xx-ZZ. Falling back to: xx.',
            undefined
        );
    });
});

describe('loadAppMessages', () => {
    const logSpy = jest.spyOn(log, 'warning');

    afterEach(() => {
        logSpy.mockClear();
    });

    it('tries to load fallback messages', async () => {
        const messages = await loadAppMessages('xx-ZZ');

        expect(messages).toEqual({});
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load application translations for lang: xx-ZZ. Falling back to: xx.',
            undefined
        );
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load application translations for lang: xx.',
            undefined
        );
    });

    it('does not try to load fallback messages when language does not match the pattern', async () => {
        const messages = await loadAppMessages('xx');

        expect(messages).toEqual({});
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load application translations for lang: xx.',
            undefined
        );
    });
});

describe('loadCoreMessages', () => {
    const logSpy = jest.spyOn(log, 'warning');

    afterEach(() => {
        logSpy.mockClear();
    });

    it('tries to load fallback messages', async () => {
        const messages = await loadCoreMessages('xx-ZZ');

        expect(messages).toEqual({});
        expect(logSpy).toHaveBeenCalledTimes(4);
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load jutro components translations for lang: xx-ZZ. Falling back to: xx.',
            undefined
        );
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load jutro components translations for lang: xx.',
            undefined
        );
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load business components translations for lang: xx-ZZ. Falling back to: xx.',
            undefined
        );
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load business components translations for lang: xx.',
            undefined
        );
    });

    it('does not try to load fallback messages when language does not match the pattern', async () => {
        const messages = await loadCoreMessages('xx');

        expect(messages).toEqual({});
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load jutro components translations for lang: xx.',
            undefined
        );
        expect(logSpy).toHaveBeenCalledWith(
            'Unable to load business components translations for lang: xx.',
            undefined
        );
    });
});
