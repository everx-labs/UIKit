import * as React from 'react';
import {
    requireNativeComponent,
    StyleProp,
    StyleSheet,
    ViewStyle,
    ColorValue,
    processColor,
} from 'react-native';

type Props = {
    // eslint-disable-next-line react/no-unused-prop-types
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    managedScrollViewNativeID?: string;
    customKeyboardView?: {
        moduleName: string;
        initialProps?: Record<string, unknown>;
        backgroundColor?: ColorValue;
    };
};

const NativeUIInputAccessoryView = requireNativeComponent<Props>(
    'UIInputAccessoryView',
);

export function UIInputAccessoryView({
    children,
    managedScrollViewNativeID,
    customKeyboardView,
}: Props) {
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
});
