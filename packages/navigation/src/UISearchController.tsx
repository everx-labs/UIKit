import * as React from 'react';
import { useWindowDimensions, ViewStyle, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Portal, useColorParts, ColorVariants } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import { UISearchBar } from './UISearchBar';
import { ELASTIC_WIDTH_CONTROLLER } from './constants';

export type UISearchControllerProps = {
    forId?: string;
    visible: boolean;
    placeholder?: string;
    onCancel: () => void | Promise<void>;
    onChangeText?: React.ComponentProps<typeof UISearchBar>['onChangeText'];
    children: ((searchText: string) => React.ReactNode) | React.ReactNode;
};

type UISearchControllerContentProps = Omit<UISearchControllerProps, 'forId'> & {
    onClosed: () => void;
};

// eslint-disable-next-line no-shadow
enum ShowStates {
    Close = 0,
    Closing = 1,
    Open = 2,
    Opening = 3,
}

function getAnimationOpacity(
    show: Animated.Value<ShowStates>,
    onClosed: () => void,
) {
    const {
        block,
        cond,
        eq,
        set,
        startClock,
        stopClock,
        clockRunning,
        and,
        call,
        spring,
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
            speed: 10,
            mass: new Animated.Value(1),
            restSpeedThreshold: new Animated.Value(0.01),
            restDisplacementThreshold: new Animated.Value(0.01),
            toValue: new Animated.Value(0),
        }),
    };

    return block([
        cond(eq(show, ShowStates.Close), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.toValue, 0),
            set(show, ShowStates.Closing),
            startClock(clock),
        ]),
        cond(eq(show, ShowStates.Open), [
            set(state.finished, 0),
            // @ts-ignore
            set(config.toValue, 1),
            set(show, ShowStates.Opening),
            startClock(clock),
        ]),
        cond(and(state.finished, clockRunning(clock)), [
            stopClock(clock),
            // Animated.debug('stopped', show),
            cond(eq(show, ShowStates.Closing), call([], onClosed)),
        ]),
        spring(clock, state, config),
        state.position,
    ]);
}

function useAnimation(onClosed: () => void) {
    const show = Animated.useValue<ShowStates>(ShowStates.Closing);

    const opacity = React.useRef(getAnimationOpacity(show, onClosed)).current;

    const animate = React.useCallback(
        (visible) => {
            show.setValue(visible ? ShowStates.Open : ShowStates.Close);
        },
        [show],
    );

    return {
        opacity,
        animate,
    };
}

function UISearchControllerContent({
    visible,
    placeholder,
    onCancel,
    children,
    onClosed,
    onChangeText: onChangeTextProp,
}: UISearchControllerContentProps) {
    const [searchText, setSearchText] = React.useState('');
    const { height } = useWindowDimensions();

    const { animate, opacity } = useAnimation(onClosed);

    React.useEffect(() => {
        animate(visible);
    }, [visible, animate]);

    const {
        colorParts: backgroundColorParts,
        opacity: backgroundOpacity,
    } = useColorParts(ColorVariants.BackgroundPrimary);

    // @ts-ignore TS doesn't understand when backgroundColor is animated node
    const backgroundStyle: ViewStyle = React.useMemo(
        () => ({
            flex: 1,
            // On web we can't just animate opacity
            // as it has a bug, it flickers a bit
            // on mounting
            backgroundColor: Animated.interpolateColors(opacity, {
                inputRange: [0, 1],
                outputColorRange: [
                    `rgba(${backgroundColorParts}, 0)`,
                    `rgba(${backgroundColorParts}, ${backgroundOpacity})`,
                ],
            }),
            transform: [
                {
                    translateY: Animated.interpolate(opacity, {
                        inputRange: [0, 1],
                        outputRange: [0 - height / 2, 0],
                    }),
                },
            ],
        }),
        [backgroundColorParts, backgroundOpacity, height, opacity],
    );

    const contentStyle: ViewStyle = React.useMemo(
        () => ({
            flex: 1,
            // @ts-ignore
            opacity: opacity as number,
        }),
        [opacity],
    );

    const onChangeText = React.useCallback(
        (text: string) => {
            if (onChangeTextProp) {
                onChangeTextProp(text);
            }

            setSearchText(text);
        },
        [onChangeTextProp, setSearchText],
    );

    return (
        <Animated.View style={backgroundStyle}>
            <SafeAreaView style={styles.contentInner} edges={['top']}>
                <UISearchBar
                    autoFocus
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    headerRightLabel={uiLocalized.Cancel}
                    headerRightOnPress={onCancel}
                />
                <Animated.View style={contentStyle}>
                    {typeof children === 'function'
                        ? children(searchText)
                        : children}
                </Animated.View>
            </SafeAreaView>
        </Animated.View>
    );
}

export function UISearchController({
    forId,
    ...props
}: UISearchControllerProps) {
    const { visible, children } = props;
    const [isVisible, setIsVisible] = React.useState(visible);

    React.useEffect(() => {
        if (!visible) {
            return;
        }

        setIsVisible(true);
    }, [visible]);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal forId={forId}>
            <UISearchControllerContent
                {...props}
                onClosed={() => setIsVisible(false)}
            >
                {children}
            </UISearchControllerContent>
        </Portal>
    );
}

const styles = StyleSheet.create({
    contentInner: {
        width: '100%',
        maxWidth: ELASTIC_WIDTH_CONTROLLER,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        flex: 1,
    },
});
