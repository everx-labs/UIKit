import * as React from 'react';
import {
    requireNativeComponent,
    StyleProp,
    StyleSheet,
    ViewStyle,
    ColorValue,
    processColor,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

import type { UIInputAccessoryViewProps } from './types';

const NativeUIInputAccessoryView = requireNativeComponent<
    UIInputAccessoryViewProps & {
        style?: StyleProp<ViewStyle>;
    }
>('UIInputAccessoryView');

export function InputAccessoryView({
    children,
    managedScrollViewNativeID,
    customKeyboardView,
}: UIInputAccessoryViewProps) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const processedCustomKeyboardView = React.useMemo(() => {
        if (customKeyboardView == null) {
            return undefined;
        }

        return {
            ...customKeyboardView,
            ...(customKeyboardView.backgroundColor != null
                ? {
                      backgroundColor: processColor(
                          customKeyboardView.backgroundColor,
                      ) as ColorValue,
                  }
                : null),
        };
    }, [customKeyboardView]);

    return (
        <NativeUIInputAccessoryView
            style={styles.container}
            managedScrollViewNativeID={managedScrollViewNativeID}
            customKeyboardView={processedCustomKeyboardView}
        >
            {children}
            <View // A dummy view to make SafeArea translates look nicer
                style={[
                    { height: insets?.bottom ?? 0 },
                    styles.safeAreaFiller,
                    {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                ]}
            />
        </NativeUIInputAccessoryView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    safeAreaFiller: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '100%',
    },
});
