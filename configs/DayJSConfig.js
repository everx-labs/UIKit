// @flow
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

// Plugins
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(relativeTime);
