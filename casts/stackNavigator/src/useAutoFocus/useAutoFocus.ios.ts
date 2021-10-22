import * as React from 'react';
import type { TextInput } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

/**
 * Motivation:
 * on iOS we caught a bug, that when TextView is with autoFocus prop
 * and transition of UINavigationController happening, it cause
 * a very strange animation, when a screen is opening twice
 * and at the time a keyboard is jumping
 *
 * The issue can be reproduced only when autoFocus prop set to true.
 *
 * So, the fix is to listen for transition events, and therefore
 * prevent autofocus during it, and focus a TextView only when transition is ended.
 */
export function useAutoFocus(ref: React.Ref<TextInput>, autoFocus: boolean | undefined) {
    let navigation: NavigationProp<any> | null = null;
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navigation = useNavigation();
    } catch (e) {
        // nothing
    }

    React.useEffect(() => {
        if (!autoFocus || ref == null || !('current' in ref)) {
            return undefined;
        }

        let shouldWaitForTransition = false;
        let shouldListenForTransition = true;
        let shouldAutoFocus = true;

        const timeoutID = setTimeout(() => {
            // a guard to prevent an occaisonal second focus
            if (shouldAutoFocus) {
                if (ref && 'current' in ref) {
                    ref.current?.focus();
                }
                shouldAutoFocus = false;
            }
            shouldListenForTransition = false;
        }, 100); // 100 seems to be longer then duration before `transitionStart` is fired

        const transitionStartListener = () => {
            if (!shouldListenForTransition) {
                return;
            }

            shouldWaitForTransition = true;

            clearTimeout(timeoutID);
        };

        const transitionEndListener = () => {
            if (!shouldWaitForTransition) {
                return;
            }

            // a guard to prevent occaisonal second focus
            if (shouldAutoFocus) {
                if (ref && 'current' in ref) {
                    ref.current?.focus();
                }
                shouldAutoFocus = false;
            }
        };

        // @ts-ignore
        navigation?.addListener('transitionStart', transitionStartListener);
        // @ts-ignore
        navigation?.addListener('transitionEnd', transitionEndListener);

        return () => {
            navigation?.removeListener(
                // @ts-ignore
                'transitionStart',
                transitionStartListener,
            );
            // @ts-ignore
            navigation?.removeListener('transitionEnd', transitionEndListener);
        };
    }, [ref, autoFocus, navigation]);

    return false;
}
