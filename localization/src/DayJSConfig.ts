import { Platform } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Localizations
import 'dayjs/locale/ru';
import 'dayjs/locale/fr';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/de';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/es';
import 'dayjs/locale/tr';
import 'dayjs/locale/it';

if (Platform.OS === 'web') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const weekday = require('dayjs/plugin/weekday');
    dayjs.extend(weekday);
}

// Plugins
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(relativeTime);
