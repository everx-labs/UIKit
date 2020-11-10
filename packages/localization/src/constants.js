// @flow
import type { LanguageConstants, LanguageInfo } from '../types';

export const predefinedConstants: LanguageConstants = {
    CURRENT_YEAR: (new Date()).getFullYear(),
};

export const languagesInfo: { [string]: LanguageInfo } = {
    en: {
        name: 'English',
        country: 'US',
        dayJS: 'en',
    },
    ru: {
        name: 'Русский',
        country: 'RU',
        dayJS: 'ru',
    },
    fr: {
        name: 'Français',
        country: 'FR',
        dayJS: 'fr',
    },
    it: {
        name: 'Italiano',
        country: 'IT',
        dayJS: 'it',
    },
    tr: {
        name: 'Türk',
        country: 'TR',
        dayJS: 'tr',
    },
    kr: {
        name: '한국어',
        country: 'KR',
        dayJS: 'ko',
    },
    pt_BR: {
        name: 'Português (Br)',
        country: 'BR',
        dayJS: 'pt-br',
    },
    de: {
        name: 'Deutsch',
        country: 'DE',
        dayJS: 'de',
    },
    es: {
        name: 'Español',
        country: 'ES',
        dayJS: 'es',
    },
    zh_CN: {
        name: '汉语',
        country: 'CN',
        dayJS: 'zh-cn',
    },
    ja: {
        name: '日本語',
        country: 'JP',
        dayJS: 'ja',
    },
};
