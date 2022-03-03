import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export function useStackTopInsetStyle(hasTopInset: boolean) {
    const { top } = useSafeAreaInsets();
    let navigation: ReturnType<typeof useNavigation> | null = null;

    // If it's used not in a navigation context
    // it might throw an error, to prevent a crash trying to catch it
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navigation = useNavigation();
    } catch (err) {
        // no-op
    }

    const topInsetStyle = React.useMemo(() => {
        if (!hasTopInset) {
            return null;
        }

        if (navigation != null && 'hide' in navigation) {
            return null;
        }

        return {
            paddingTop: top,
        };
    }, [hasTopInset, navigation, top]);

    return topInsetStyle;
}
