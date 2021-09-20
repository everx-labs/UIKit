import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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

export function UIBlurView({ children, style, testID }: Props) {
    const color = useTheme()[ColorVariants.BackgroundOverlayInverted] as string;

    // BlurView is broken for Android in pair with `react-native-reanimated` (as per logs)
    // That's why we can blur it only once the screen transition is fully finished

    const [blurBackground, setBlurBackground] = React.useState(Platform.OS !== 'android');
    React.useEffect(() => {
        if (Platform.OS === 'android') {
            setTimeout(() => {
                setBlurBackground(true);
            }, 1000); // wait for a second to avoid crashes
        }
    }, []);

    // TODO: get rid of abandoned (not maintained) BlurView for Android which crashes the app!!!
    return (
        <View style={[styles.container, style]} testID={testID}>
            {blurBackground && (
                <BlurView
                    style={styles.blur}
                    blurType="light"
                    blurAmount={16}
                    reducedTransparencyFallbackColor={color}
                />
            )}
            {children}
        </View>
    );
}
