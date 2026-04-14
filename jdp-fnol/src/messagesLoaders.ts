import { getLanguageSubtag } from '@jutro/locale';
import { warning } from '@jutro/logger';

import bizCompTranslationsMetadata from '../i18n/biz-comp-translations/meta.json';

export type MessagesMap = Record<string, string>;

type MessagesLoader = (lang: string) => Promise<{ default: MessagesMap }>;

type LoadMessagesOptions = {
    lang: string;
    loader: MessagesLoader;
    source: string;
};

const loadMessages = async ({
    lang,
    loader,
    source,
}: LoadMessagesOptions): Promise<MessagesMap> => {
    try {
        const { default: result } = await loader(lang);

        return result;
    } catch {
        const extractedLang = getLanguageSubtag(lang);

        if (extractedLang && extractedLang !== lang) {
            warning(
                `Unable to load ${source} translations for lang: ${lang}. Falling back to: ${extractedLang}.`
            );

            try {
                const { default: result } = await loader(extractedLang);

                return result;
            } catch {
                warning(
                    `Unable to load ${source} translations for lang: ${extractedLang}.`
                );

                return {};
            }
        }

        warning(`Unable to load ${source} translations for lang: ${lang}.`);

        return {};
    }
};

export const loadAppMessages = async (lang: string): Promise<MessagesMap> =>
    loadMessages({
        lang,
        loader: fileName =>
            import(
                /* webpackChunkName: "i18n/app-[request]" */ `./i18n/${fileName}.json`
            ),
        source: 'application',
    });

export const loadCoreMessages = async (lang: string): Promise<MessagesMap> => {
    const jutroMessages = await loadMessages({
        lang,
        loader: fileName =>
            import(
                /* webpackChunkName: "i18n/core-[request]" */ `@jutro/translations/lang-data/${fileName}`
            ),
        source: 'jutro components',
    });
    const bizCompMessages = (
        bizCompTranslationsMetadata as { translationsAvailable?: boolean }
    ).translationsAvailable
        ? await loadMessages({
              lang,
              loader: fileName =>
                  import(
                      /* webpackChunkName: "i18n/biz-comp-[request]" */ `../i18n/biz-comp-translations/${fileName}`
                  ),
              source: 'business components',
          })
        : {};

    return { ...jutroMessages, ...bizCompMessages };
};
