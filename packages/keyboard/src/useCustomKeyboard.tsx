import * as React from 'react';
import {
    Keyboard,
    TextInput,
    KeyboardEvent,
    Platform,
    AppRegistry,
} from 'react-native';
import type { OnEvent, UICustomKeyboardView } from './types';

export type OnCustomKeyboardVisible = (
    visible: boolean,
) => void | Promise<void>;

const callbacks: { [id: string]: OnEvent | undefined } = {};

export function registerKeyboardComponent<KeyboardProps>(
    moduleName: string,
    keyboardComponent: React.ComponentType<KeyboardProps>,
) {
    function UIKeyboard(props: KeyboardProps) {
        return React.createElement(keyboardComponent, {
            ...props,
            onEvent: (...args: any[]) => {
                const cb = callbacks[moduleName];
                if (cb != null) {
                    cb(...args);
                }
            },
        });
    }

    UIKeyboard.displayName = `UIKeyboard(${moduleName})`;

    AppRegistry.registerComponent(moduleName, () => UIKeyboard);

    return UIKeyboard;
}

export function useCustomKeyboard(
    inputRef: React.Ref<TextInput>,
    cKeyboard?: UICustomKeyboardView,
) {
    const [customKeyboard, setCustomKeyboard] = React.useState<
        typeof cKeyboard
    >(undefined);
    const customKeyboardRef = React.useRef<typeof cKeyboard>(undefined);

    React.useEffect(() => {
        const callback = ({ duration }: KeyboardEvent) => {
            if (customKeyboardRef.current == null) {
                return;
            }

            setTimeout(() => {
                setCustomKeyboard(undefined);
            }, duration);
        };
        Keyboard.addListener('keyboardWillHide', callback);

        return () => {
            Keyboard.removeListener('keyboardWillHide', callback);
        };
    }, []);

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

        setCustomKeyboard(customKeyboard == null ? cKeyboard : undefined);
        customKeyboardRef.current =
            customKeyboard == null ? cKeyboard : undefined;
    }, [cKeyboard, customKeyboard, inputRef]);

    React.useEffect(() => {
        if (cKeyboard?.moduleName) {
            callbacks[cKeyboard?.moduleName] = (...args: any[]) => {
                if (cKeyboard?.onEvent == null) {
                    return false;
                }

                const shouldDismiss = cKeyboard?.onEvent(...args);

                if (shouldDismiss) {
                    dismiss();
                }

                return true;
            };
        }

        () => {
            if (cKeyboard?.moduleName) {
                callbacks[cKeyboard?.moduleName] = undefined;
            }
        };
    }, [cKeyboard, dismiss]);

    return {
        customKeyboardView: customKeyboard,
        dismiss,
        toggle,
    };
}
