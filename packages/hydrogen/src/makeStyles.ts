import * as React from 'react';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type NamedStyles<T> = {
    [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type FunctionStyles<T> = (...args: any[]) => NamedStyles<T>;

type MakeStyles = <T extends Record<string, unknown>>(
    styles: NamedStyles<T> | FunctionStyles<T>,
) => (...args: unknown[]) => NamedStyles<T>;

export const makeStyles: MakeStyles = (styles) => (...args) => {
    return React.useMemo(() => {
        if (typeof styles === 'function') {
            return styles(...args);
        }
        return styles;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...args]);
};
