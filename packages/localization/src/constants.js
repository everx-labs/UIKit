// @flow
import type { LanguageInfo } from '../types';

export const predefinedConstants = {
    CURRENT_YEAR: (new Date()).getFullYear(),
};

export const languagesInfo: { [string]: LanguageInfo } = {
    en: {
        name: 'English',
        country: 'US',
    },
    ru: {
        name: 'Русский',
        country: 'RU',
    },
    fr: {
        name: 'Français',
        country: 'FR',
    },
    it: {
        name: 'Italiano',
        country: 'IT',
    },
    tr: {
        name: 'Türk',
        country: 'TR',
    },
    kr: {
        name: '한국어',
        country: 'KR',
    },
    pt_BR: {
        name: 'Português (Br)',
        country: 'BR',
    },
    de: {
        name: 'Deutsch',
        country: 'DE',
    },
    es: {
        name: 'Español',
        country: 'ES',
    },
    zh_CN: {
        name: '汉语',
        country: 'CN',
    },
    ja: {
        name: '日本語',
        country: 'JP',
    },
};
