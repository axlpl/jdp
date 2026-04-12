import { getLanguageSubtag } from '@jutro/locale';
import { warning } from '@jutro/logger';

import bizCompTranslationsMetadata from '../i18n/biz-comp-translations/meta.json';

/**
 * Load messages
 * @param {object} params
 * @param {string} params.lang
 * @param {function} params.loader
 * @param {string} params.source
 *
 * @returns {Promise<import("@jutro/app").MessagesType>} - Loaded messages
 */
export const loadMessages = async ({ lang, loader, source }) => {
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

/**
 * Load application specific messages
 * @param {string} lang
 *
 * @returns {Promise<import("@jutro/app").MessagesType>} - Loaded messages
 */
export const loadAppMessages = async lang =>
    loadMessages({
        lang,
        loader: fileName =>
            import(
                /* webpackChunkName: "i18n/app-[request]" */ `./i18n/${fileName}.json`
            ),
        source: 'application',
    });

/**
 * Load core application messages
 * @param {string} lang
 *
 * @returns {Promise<import("@jutro/app").MessagesType>} - Loaded messages
 */
export const loadCoreMessages = async lang => {
    const jutroMessages = await loadMessages({
        lang,
        loader: fileName =>
            import(
                /* webpackChunkName: "i18n/core-[request]" */ `@jutro/translations/lang-data/${fileName}`
            ),
        source: 'jutro components',
    });
    const bizCompMessages = bizCompTranslationsMetadata.translationsAvailable
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
