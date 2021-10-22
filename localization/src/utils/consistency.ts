/**
 *
 * @param original {Object}
 * @param target {Object}
 * @param keyPath {string}
 * @returns {Object} Errors array
 */
export function checkConsistent(
    original: Record<string, any>,
    target: Record<string, any>,
    keyPath = '',
): string[] {
    const errors: string[] = [];

    Object.keys(original).forEach(key => {
        const originalValue = original[key];
        const targetValue = target[key];

        if (!(key in target)) {
            console.log(`Key "${key}" missed in "${keyPath}"`);
            errors.push(`Error in ${keyPath.concat('.', key)}`);
        } else if (typeof originalValue !== typeof targetValue) {
            console.log(`Key "${key}" has other type of data in "${keyPath}"`);
            errors.push(`Error in ${keyPath.concat('.', key)}`);
        } else if (Array.isArray(targetValue)) {
            // Check array length
            if (originalValue.length !== targetValue.length) {
                console.log(
                    '\x1b[33m%s\x1b[0m',
                    `Data length in target on "${keyPath.concat('.', key)}" not equals!`,
                );
                errors.push(`Error in ${keyPath.concat('.', key)}`);
            }
            // originalValue.map(value => {
            //
            // });
        } else if (typeof originalValue === 'object') {
            // Check keys count in target/original
            if (Object.keys(originalValue).length !== Object.keys(targetValue).length) {
                console.log(
                    '\x1b[33m%s\x1b[0m',
                    `"${keyPath.concat('.', key)}" has additional keys!`,
                );
                errors.push(`Error in ${keyPath.concat('.', key)}`);
            }

            checkConsistent(originalValue, targetValue, keyPath.concat(keyPath ? '.' : '', key));
        }
    });

    return errors;
}
