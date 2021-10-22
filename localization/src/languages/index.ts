/* eslint-disable camelcase */
import en from './en.json';
import ru from './ru.json';
import fr from './fr.json';
import pt_BR from './pt_BR.json';
import zh_CN from './zh_CN.json';
import es from './es.json';
import it from './it.json';
import ja from './ja.json';
import de from './de.json';
import ko from './ko.json';
import tr from './tr.json';
import type { Languages } from '../types';

export type UILocalizedData = typeof en;

const languages: Languages<UILocalizedData> = {
    en,
    ru,
    fr,
    zh_CN,
    pt_BR,
    es,
    it,
    ja,
    de,
    ko,
    tr,
};

export default languages;
