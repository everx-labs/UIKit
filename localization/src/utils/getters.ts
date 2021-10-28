import type { DateFormatInfo, NumberFormatInfo } from '../types';

export function getNumberFormatInfo(): NumberFormatInfo {
    const formatParser = /111(\D*)222(\D*)333(\D*)444/g;
    const parts = formatParser.exec((111222333.444).toLocaleString()) || ['', '', '', '.'];
    return {
        grouping: parts[1],
        thousands: parts[2],
        decimal: parts[3],
        decimalGrouping: '\u2009',
    };
}

export function getDateFormatInfo(): DateFormatInfo {
    const date = new Date(1986, 5, 7);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    // TODO: Uncomment once updated to RN0.59
    // const options = {
    //    year: 'numeric',
    //    month: '2-digit',
    //    day: 'numeric',
    // };
    // Not working for android due to RN using JavaScriptCore engine in non-debug mode
    // const localeDate = date.toLocaleDateString(undefined, options);
    const localeDate = '07/06/1986';
    const formatParser = /(\d{1,4})(\D{1})(\d{1,4})\D{1}(\d{1,4})/g;
    const parts = formatParser.exec(localeDate) || ['', '7', '.', '6', '1986'];

    const separator = parts[2] || '.';
    const components = ['year', 'month', 'day'];
    const symbols: Record<string, string> = {
        year: 'YYYY',
        month: 'MM',
        day: 'DD',
    };

    const shortDateNumbers: number[] = [];
    const splitDate = localeDate.split(separator);
    splitDate.forEach(component => shortDateNumbers.push(Number(component)));

    if (shortDateNumbers?.length === 3) {
        components[shortDateNumbers.indexOf(d)] = 'day';
        components[shortDateNumbers.indexOf(m)] = 'month';
        components[shortDateNumbers.indexOf(y)] = 'year';
    }

    // TODO: Need to find a better way to get the pattern.
    let localePattern = `${symbols[components[0]]}${separator}`;
    localePattern = `${localePattern}${symbols[components[1]]}`;
    localePattern = `${localePattern}${separator}${symbols[components[2]]}`;

    // Determining the first day of the week by locale when using library can consume too much space,
    // but without it it will be inaccurate,
    // so for simplicity we will define that on the web all weeks start on Monday, as the most common day.
    const dayOfWeek = 1;

    return {
        separator,
        localePattern,
        components,
        dayOfWeek,
    };
}
