import * as React from 'react';
import {
    View,
    Animated,
    Modal,
    TouchableWithoutFeedback,
    Pressable,
    StyleSheet,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, ColorVariants } from './Colors';
import { UIConstant } from './constants';
import { Portal } from './Portal';

type UICustomSheetProps = {
    children: React.ReactNode;
};

type UICustomSheetRef = {
    show: () => void;
    hide: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const UICustomSheet = React.forwardRef<
    UICustomSheetRef,
    UICustomSheetProps
>(function UICustomSheetForwarded(props: UICustomSheetProps, ref) {
    const theme = useTheme();

    const { overlayColor, overlayOpacity } = React.useMemo(() => {
        const rgbaRegex = /rgba\((\d+),\s+(\d+),\s+(\d+),\s+([\d.]+)\)/;
        const currentColor = theme[ColorVariants.BackgroundOverlay] as string;

        if (!rgbaRegex.test(currentColor)) {
            return {
                overlayColor: currentColor,
                overlayOpacity: 1,
            };
        }

        // @ts-ignore
        const [, red, green, blue, opacity] = currentColor.match(rgbaRegex);

        return {
            overlayColor: `rgb(${red}, ${green}, ${blue})`,
            overlayOpacity: Number(opacity),
        };
    }, [theme]);

    const [isVisibleModal, setIsVisibleModal] = React.useState(false);
    const positionRef = React.useRef(new Animated.Value(0));

    const [height, setHeight] = React.useState(0);

    const { bottom } = useSafeAreaInsets();

    const topDisplacement = React.useMemo(() => bottom + height, [
        bottom,
        height,
    ]);

    const animate = React.useCallback(
        (isVisibleInner) => {
            Animated.spring(positionRef.current, {
                toValue: isVisibleInner ? -topDisplacement : 0,
                useNativeDriver: true,
            }).start(() => {
                // Need to get a time for animation, before close modal
                if (!isVisibleInner) {
                    setIsVisibleModal(false);
                }
            });
        },
        [topDisplacement],
    );

    const shouldAnimate = React.useRef(false);

    React.useEffect(() => {
        if (shouldAnimate.current) {
            animate(true);
            shouldAnimate.current = false;
        }
    }, [height, animate]);

    React.useImperativeHandle(ref, () => ({
        show: () => {
            setIsVisibleModal(true);
            if (height > 0) {
                animate(true);
            } else {
                shouldAnimate.current = true;
            }
        },
        hide: () => {
            animate(false);
        },
    }));

    const overlayStyle = React.useMemo(
        () => ({
            flex: 1,
            backgroundColor: overlayColor,
            opacity: positionRef.current.interpolate({
                inputRange: [-topDisplacement, 0],
                outputRange: [overlayOpacity, 0],
            }),
        }),
        [overlayColor, overlayOpacity, topDisplacement],
    );

    const cardStyle = React.useMemo(
        () => [
            styles.card,
            {
                transform: [
                    {
                        translateY: positionRef.current,
                    },
                ],
            },
        ],
        [],
    );

    const onCardLayout = React.useCallback(
        ({
            nativeEvent: {
                layout: { height: lHeight },
            },
        }) => {
            if (height === 0) {
                setHeight(lHeight);
            }
        },
        [height],
    );

    const content = !isVisibleModal ? null : (
        <View style={{ flex: 1, position: 'relative' }}>
            <AnimatedPressable
                testID="background_layer"
                onPress={() => {
                    animate(false);
                }}
                style={overlayStyle}
            />
            <Animated.View style={cardStyle} onLayout={onCardLayout}>
                {props.children}
            </Animated.View>
        </View>
    );

    return <Portal>{content}</Portal>;
});

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        top: '100%',
        width: '100%',
        maxWidth: UIConstant.elasticWidthHalfNormal,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
    },
});
