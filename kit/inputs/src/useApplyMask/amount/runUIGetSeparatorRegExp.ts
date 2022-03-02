export function runUIGetSeparatorRegExp(
    integerSeparator: string,
    fractionalSeparator: string,
    inputSeparators: string[],
): RegExp {
    'worklet';

    const filteredSeparators = inputSeparators.reduce((result: string[], separator: string) => {
        if (separator === integerSeparator || separator === fractionalSeparator) {
            /** The currently used separators should not be used as delimeter */
            return result;
        }
        // TODO Add more specific chars
        if (separator === '.' || separator === '/') {
            const separatorWithEscapeCharacter = `\\${separator}`;
            result.push(separatorWithEscapeCharacter);
            return result;
        }
        const upperCaseSeparator = separator.toUpperCase();
        if (separator !== upperCaseSeparator) {
            result.push(upperCaseSeparator);
        }
        result.push(separator);
        return result;
    }, []);
    return new RegExp(`(${filteredSeparators.join('|')})`);
}
