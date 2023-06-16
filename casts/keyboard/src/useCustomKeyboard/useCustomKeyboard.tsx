import * as React from 'react';
import { Keyboard, KeyboardEvent, Platform, AppRegistry } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import type { UITextViewRef } from '@tonlabs/uikit.inputs';
import type { OnEvent, UICustomKeyboardView } from './types';

export type OnCustomKeyboardVisible = (visible: boolean) => void | Promise<void>;

const callbacks: { [id: string]: OnEvent | undefined } = {};
const dismisses: { [id: string]: (() => void) | undefined } = {};

export function registerKeyboardComponent<KeyboardProps extends Record<string, unknown>>(
    moduleName: string,
    keyboardComponent: React.ComponentType<KeyboardProps>,
) {
    function UIKeyboard({ keyboardID, ...props }: KeyboardProps & { keyboardID: number }) {
        return (
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                {React.createElement(keyboardComponent, {
                    ...props,
                    onEvent: (...args: any[]) => {
                        const cb = callbacks[`${moduleName}:${keyboardID}`];
                        if (cb != null) {
                            cb(...args);
                        }
                    },
                } as any)}
            </SafeAreaProvider>
        );
    }

    UIKeyboard.displayName = `UIKeyboard(${moduleName})`;

    AppRegistry.registerComponent(moduleName, () => UIKeyboard);

    return UIKeyboard;
}

let globalID = 0;

export function useCustomKeyboard(
    inputRef: React.Ref<UITextViewRef>,
    cKeyboard?: UICustomKeyboardView,
) {
    const keyboardID = React.useRef<number>(null);

    if (keyboardID.current == null) {
        globalID += 1;
        // @ts-expect-error
        keyboardID.current = globalID;
    }

    const cKeyboardPrepared = React.useMemo(() => {
        if (cKeyboard == null) {
            return undefined;
        }

        return {
            ...cKeyboard,
            initialProps: {
                ...cKeyboard?.initialProps,
                keyboardID: keyboardID.current,
            },
        };
    }, [cKeyboard]);

    const [customKeyboard, setCustomKeyboard] = React.useState<typeof cKeyboardPrepared>(undefined);
    const customKeyboardRef = React.useRef<typeof cKeyboardPrepared>(undefined);

    React.useEffect(() => {
        const callback = ({ duration }: KeyboardEvent) => {
            if (customKeyboardRef.current == null) {
                return;
            }

            setTimeout(() => {
                setCustomKeyboard(undefined);
            }, duration);
        };
        const keyboardSubscription = Keyboard.addListener('keyboardWillHide', callback);

        return () => {
            keyboardSubscription.remove();
        };
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const dismiss = React.useCallback(() => {
        setCustomKeyboard(undefined);
        customKeyboardRef.current = undefined;
    }, []);

    const toggle = React.useCallback(() => {
        if (Platform.OS === 'android' && inputRef && 'current' in inputRef) {
            // Unfortunatelly when you tap a button on Android
            // TextInput doesn't lose focus, that lead to a case
            // when custom keyboard is opened, and then on tap
            // on TextInput we want to see regular one
            // but on Android it won't fire `focus` event again
            inputRef.current?.blur();
        }

        setCustomKeyboard(customKeyboard == null ? cKeyboardPrepared : undefined);
        customKeyboardRef.current = customKeyboard == null ? cKeyboardPrepared : undefined;
    }, [cKeyboardPrepared, customKeyboard, inputRef]);

    const onEventCallback = React.useCallback(
        (...args: any[]) => {
            if (cKeyboard?.onEvent == null) {
                return false;
            }

            const shouldDismiss = cKeyboard?.onEvent(...args);

            if (shouldDismiss) {
                dismiss();
            }

            return true;
        },
        [cKeyboard, dismiss],
    );

    React.useEffect(() => {
        if (cKeyboard?.moduleName) {
            callbacks[`${cKeyboard?.moduleName}:${keyboardID.current}`] = onEventCallback;

            dismisses[`${cKeyboard?.moduleName}:${keyboardID.current}`] = dismiss;
        }

        () => {
            if (cKeyboard?.moduleName) {
                callbacks[`${cKeyboard?.moduleName}:${keyboardID.current}`] = undefined;
                dismisses[`${cKeyboard?.moduleName}:${keyboardID.current}`] = undefined;
            }
        };
    }, [cKeyboard, onEventCallback, dismiss]);

    return {
        customKeyboardView: customKeyboard,
        dismiss,
        toggle,
    };
}

export function dismiss() {
    Object.keys(dismisses).forEach(kbID => {
        const dismissCb = dismisses[kbID];

        if (dismissCb) {
            dismissCb();
        }
    });
}

const originalKeyboardDismiss = Keyboard.dismiss;
Keyboard.dismiss = function rnDismissKeyboard() {
    originalKeyboardDismiss();
    dismiss();
};
