import React from 'react';
import type {
    NativeSyntheticEvent,
    TextInputChangeEventData,
    TextInputFocusEventData,
    TextInputSelectionChangeEventData,
} from 'react-native';

export function useTextViewHandler<Context extends Record<string, unknown>>(
    handlers:
        | {
              onFocus?: (evt: TextInputFocusEventData, ctx: Context) => void;
              onBlur?: (evt: TextInputFocusEventData, ctx: Context) => void;
              onChange?: (evt: TextInputChangeEventData, ctx: Context) => void;
              onSelectionChange?: (evt: TextInputSelectionChangeEventData, ctx: Context) => void;
          }
        | ((evt: TextInputChangeEventData) => void),
    _dependencies?: Array<unknown>,
) {
    return React.useMemo(() => {
        if (typeof handlers === 'function') {
            return {
                onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) =>
                    handlers(e.nativeEvent),
            };
        }

        return Object.keys(handlers).reduce((acc, key) => {
            acc[key] = (e: NativeSyntheticEvent<any>) => {
                // @ts-ignore
                handlers[key](e.nativeEvent);
            };
            return acc;
        }, {} as any);
    }, [handlers]);
}
