import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import type { ViewStyle, StyleProp, ViewProps } from 'react-native';

import { ColorVariants, useTheme } from '../Colors';
import { UIConstant } from '../constants';

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: UIConstant.alertBorderRadius,
    },
    blur: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

type Props = Omit<ViewProps, 'style'> & {
    /**
     * Elements to be rendered on the BlurView
     */
    children?: React.ReactNode;
    /**
     * Style of the container View that wraps BlurView
     */
    style?: StyleProp<ViewStyle>;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export function UIBlurView({
    children,
    style,
    testID,
}: Props) {
    const color = useTheme()[ColorVariants.BackgroundOverlayInverted] as string;

    return (
        <View
            style={[styles.container, style]}
            testID={testID}
        >
            <BlurView
                style={styles.blur}
                blurType="light"
                blurAmount={16}
                reducedTransparencyFallbackColor={color}
            />
            {children}
        </View>
    );
}
