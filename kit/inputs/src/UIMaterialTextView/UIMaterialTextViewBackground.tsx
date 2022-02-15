import * as React from 'react';
import { View } from 'react-native';

import { ColorVariants, useTheme, Theme, makeStyles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import Animated from 'react-native-reanimated';
import type { UIMaterialTextViewCommonProps } from './types';

// const getBackgroundColor = (
//     success: boolean | undefined,
//     error: boolean | undefined,
//     isFocused: boolean,
//     isHovered: boolean,
// ): ColorVariants => {
//     'worklet';

//     if (success) {
//         return ColorVariants.Transparent;
//     }
//     if (error) {
//         return ColorVariants.LineNegative;
//     }
//     if (isFocused) {
//         return ColorVariants.LineAccent;
//     }
//     if (isHovered) {
//         return ColorVariants.LineNeutral;
//     }
//     return ColorVariants.LineSecondary;
// };

export function UIMaterialTextViewBackground(
    props: UIMaterialTextViewCommonProps & {
        // isFocused: boolean;
        children: React.ReactNode;
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        // isHovered: boolean;
    },
) {
    const {
        borderViewRef,
        onMouseEnter,
        onMouseLeave,
        // isFocused,
        // isHovered,
        children,
        // success,
        // error,
    } = props;
    const theme = useTheme();

    // const backgroundColor = useDerivedValue(() => {
    //     return theme[getBackgroundColor(success, error, isFocused, isHovered)];
    // }, [theme, success, error, isFocused, isHovered]);

    const styles = useStyles(theme);

    // const animatedStyles = useAnimatedStyle(() => {
    //     return {
    //         // @ts-expect-error
    //         backgroundColor: withSpring(backgroundColor.value, withSpringConfig),
    //     };
    // });

    return (
        <View
            ref={borderViewRef}
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Animated.View style={[styles.container]}>{children}</Animated.View>
        </View>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundBW],
    },
}));
