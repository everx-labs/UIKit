export function runUIGetDelimiterRegExp(
    integerSeparator: string,
    fractionalSeparator: string,
    delimeterAlternative: string[],
): RegExp {
    'worklet';

    const specialCharacters = '[]\\^$.|?*+()';

    const filteredSeparators = delimeterAlternative.reduce(
        (result: string[], separator: string) => {
            if (separator === integerSeparator || separator === fractionalSeparator) {
                /** The currently used separators should not be used as delimeter */
                return result;
            }
            if (specialCharacters.includes(separator)) {
                /** We have to escape special characters */
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
        },
        [],
    );
    return new RegExp(`(${filteredSeparators.join('|')})`);
}
