import type { LanguageConstants, LanguageInfo } from './types';
import { Language } from './language';

export const predefinedConstants: LanguageConstants = {
    CURRENT_YEAR: new Date().getFullYear(),
};

export const languagesInfo: Record<Language, LanguageInfo> = {
    [Language.En]: {
        name: 'English',
        country: 'US',
        dayJS: 'en',
    },
    [Language.Ru]: {
        name: 'Русский',
        country: 'RU',
        dayJS: 'ru',
    },
    [Language.Fr]: {
        name: 'Français',
        country: 'FR',
        dayJS: 'fr',
    },
    [Language.PtBR]: {
        name: 'Português (Br)',
        country: 'BR',
        dayJS: 'pt-br',
    },
    [Language.De]: {
        name: 'Deutsch',
        country: 'DE',
        dayJS: 'de',
    },
    [Language.ZhCN]: {
        name: '汉语',
        country: 'CN',
        dayJS: 'zh-cn',
    },
    [Language.Es]: {
        name: 'Español',
        country: 'ES',
        dayJS: 'es',
    },
    [Language.Ja]: {
        name: '日本語',
        country: 'JP',
        dayJS: 'ja',
    },
    [Language.Tr]: {
        name: 'Türkçe',
        country: 'TR',
        dayJS: 'tr',
    },
    [Language.It]: {
        name: 'Italiano',
        country: 'IT',
        dayJS: 'it',
    },
    [Language.Ko]: {
        name: '한국어',
        country: 'KR',
        dayJS: 'ko',
    },
};

export const UIConstant = {
    maxDecimalDigits: 9,
};
