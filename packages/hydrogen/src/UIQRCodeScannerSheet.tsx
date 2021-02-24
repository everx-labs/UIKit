import * as React from 'react';

import { TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIAssets } from '@tonlabs/uikit.assets';
import { uiLocalized } from '@tonlabs/uikit.localization';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { QRCodeScanner, OnReadEvent } from './QRCodeScanner';
import { useTheme, ColorVariants } from './Colors';
import { UICardSheet, UICardSheetProps } from './UISheet';
import { UIImage } from './UIImage';
import { UIConstant } from './constants';
import { UILabel, UILabelColors, UILabelRoles } from './UILabel';

type UIQRCodeScannerSheetProps = Omit<UICardSheetProps, 'children'> & {
    onRead: (event: OnReadEvent) => void | Promise<void>;
};

// eslint-disable-next-line no-shadow
enum ShowStates {
    Open = 0,
    Opening = 1,
    Hide = 2,
    Hiding = 3,
}

function getErrorTranslateY(
    show: Animated.Value<ShowStates>,
    height: Animated.Value<number>,
) {
    const {
        block,
        cond,
        eq,
        and,
        set,
        startClock,
        stopClock,
        clockRunning,
        spring,
        sub,
    } = Animated;

    const clock = new Animated.Clock();

    const state = {
        finished: new Animated.Value(0),
        velocity: new Animated.Value(0),
        position: new Animated.Value(0),
        time: new Animated.Value(0),
    };

    const config: Animated.SpringConfig = {
        // Default ones from https://reactnative.dev/docs/animated#spring
        ...Animated.SpringUtils.makeConfigFromBouncinessAndSpeed({
            overshootClamping: false,
            bounciness: 3,
            speed: 12,
            // mass: new Animated.Value(1),
            // restSpeedThreshold: new Animated.Value(0.001),
            // restDisplacementThreshold: new Animated.Value(0.001),
            mass: 1,
            restSpeedThreshold: 100,
            restDisplacementThreshold: 40,
            toValue: new Animated.Value(0),
        }),
    };

    return block([
        cond(eq(show, ShowStates.Open), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.toValue, sub(0, height)),
            set(show, ShowStates.Opening),
            startClock(clock),
        ]),
        cond(eq(show, ShowStates.Hide), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.toValue, 0),
            set(show, ShowStates.Hiding),
            startClock(clock),
        ]),
        spring(clock, state, config),
        cond(and(state.finished, clockRunning(clock)), [stopClock(clock)]),
        state.position,
    ]);
}

const ERROR_DURATION = 3 * 1000;
const ERROR_VIBRATION_DURATION = 400;

function useErrorAnimation() {
    const show = Animated.useValue<ShowStates>(ShowStates.Hiding);
    const errorHeight = Animated.useValue(0);

    const translateY = React.useRef(getErrorTranslateY(show, errorHeight))
        .current;

    const onLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height },
            },
        }) => {
            errorHeight.setValue(height);
        },
        [errorHeight],
    );

    const style = React.useMemo(
        () => ({
            transform: [{ translateY }],
        }),
        [translateY],
    );

    const showError = React.useCallback(() => {
        show.setValue(ShowStates.Open);
        try {
            Vibration.vibrate(ERROR_VIBRATION_DURATION);
        } catch (err) {
            // Do nothing
        }

        setTimeout(() => {
            show.setValue(ShowStates.Hide);
        }, ERROR_DURATION);
    }, [show]);

    return {
        onLayout,
        style,
        showError,
    };
}

export function UIQRCodeScannerSheet({
    onRead: onReadProp,
    onClose,
    ...rest
}: UIQRCodeScannerSheetProps) {
    const theme = useTheme();

    const {
        onLayout: onErrorLayout,
        style: errorStyle,
        showError,
    } = useErrorAnimation();

    const onRead = React.useCallback(
        async (event: any) => {
            try {
                await onReadProp(event);
            } catch (err) {
                showError();
            }
        },
        [onReadProp, showError],
    );

    return (
        <UICardSheet {...rest} onClose={onClose} style={styles.cardContainer}>
            <QRCodeScanner
                onRead={onRead}
                reactivate
                reactivateTimeout={ERROR_VIBRATION_DURATION}
                containerStyle={[
                    {
                        backgroundColor:
                            theme[ColorVariants.StaticBackgroundBlack],
                    },
                ]}
            />
            <TouchableOpacity
                onPress={onClose}
                hitSlop={{
                    top: UIConstant.contentOffset,
                    left: UIConstant.contentOffset,
                    right: UIConstant.contentOffset,
                    bottom: UIConstant.contentOffset,
                }}
                style={[
                    styles.closeButton,
                    {
                        backgroundColor:
                            theme[ColorVariants.StaticBackgroundWhite],
                    },
                ]}
            >
                <UIImage
                    source={UIAssets.icons.ui.closeDarkThemeSecondary}
                    style={styles.closeIcon}
                    tintColor={ColorVariants.StaticIconPrimaryDark}
                />
            </TouchableOpacity>
            <Animated.View
                onLayout={onErrorLayout}
                style={[
                    styles.errorContainer,
                    {
                        backgroundColor:
                            theme[ColorVariants.BackgroundNegative],
                    },
                    errorStyle,
                ]}
            >
                <UILabel
                    role={UILabelRoles.ParagraphFootnote}
                    color={UILabelColors.StaticTextPrimaryLight}
                >
                    {uiLocalized.QRCodeScanner.ErrorOnRead}
                </UILabel>
            </Animated.View>
        </UICardSheet>
    );
}

const SCANNER_HEIGHT = 320;

const styles = StyleSheet.create({
    cardContainer: {
        height: SCANNER_HEIGHT,
        position: 'relative',
        borderRadius: UIConstant.alertBorderRadius,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: UIConstant.contentOffset,
        left: UIConstant.contentOffset,
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: UIConstant.alertBorderRadius,
    },
    closeIcon: {
        width: 16,
        height: 16,
    },
    errorContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        padding: UIConstant.contentOffset,
    },
});
