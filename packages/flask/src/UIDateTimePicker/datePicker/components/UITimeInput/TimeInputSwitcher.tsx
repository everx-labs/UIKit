import React from 'react';
import { View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {
    ColorVariants,
    makeStyles,
    Theme,
    UILabel,
    useTheme,
    TypographyVariants,
    TouchableOpacity,
} from '@tonlabs/uikit.hydrogen';
import { UIConstant } from '../../../../constants';

// @inline
const SWITCHER_LEFT = 0;
// @inline
const SWITCHER_RIGHT = 1;
// @inline
const SWITCHER_WIDTH = 89;
// @inline
const SWITCHER_INSET = 2;

export function TimeInputSwitcher({
    onPress,
    isAM = true,
}: {
    onPress: () => void;
    isAM: boolean;
}) {
    const theme = useTheme();
    const styles = useStyles(theme);

    const position = useSharedValue(isAM ? SWITCHER_LEFT : SWITCHER_RIGHT);

    const animatedButton = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        position.value,
                        [SWITCHER_LEFT, SWITCHER_RIGHT],
                        [
                            0,
                            SWITCHER_WIDTH -
                                SWITCHER_INSET -
                                Math.ceil(SWITCHER_WIDTH / SWITCHER_INSET),
                        ],
                    ),
                },
            ],
        };
    });

    React.useEffect(() => {
        position.value = withSpring(isAM ? SWITCHER_LEFT : SWITCHER_RIGHT, {
            overshootClamping: true,
        });
    }, [isAM, position]);

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
            <Animated.View style={styles.container}>
                <Animated.View style={[styles.button, animatedButton]} />
                <View style={[styles.labelContainer]}>
                    <UILabel role={TypographyVariants.Action}>AM</UILabel>
                </View>
                <View style={[styles.labelContainer]}>
                    <UILabel role={TypographyVariants.Action}>PM</UILabel>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary] as string,
        width: SWITCHER_WIDTH,
        height: 32,
        borderRadius: UIConstant.timeInput.amPmBorderRadius,
        padding: SWITCHER_INSET,
        marginLeft: UIConstant.timeInput.amPmOffset,
        flexDirection: 'row',
        position: 'relative',
    },
    labelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        position: 'absolute',
        top: SWITCHER_INSET,
        bottom: SWITCHER_INSET,
        left: SWITCHER_INSET,
        right: Math.floor(SWITCHER_WIDTH / SWITCHER_INSET),
        borderRadius: UIConstant.timeInput.amPmBorderRadius - SWITCHER_INSET,
        backgroundColor: theme[ColorVariants.BackgroundPrimary] as string,
    },
}));
