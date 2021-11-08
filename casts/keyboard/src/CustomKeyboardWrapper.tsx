import * as React from 'react';
import { Animated, LayoutAnimation } from 'react-native';

import { UIConstant, UIDevice } from '@tonlabs/uikit.core';

import { getEasingFunction } from './getEasingFunction';

const CustomKeyboardKeyboardHeight = UIDevice.isDesktop() ? 180 : 270;

function useCustomKeyboardWrapperAnimations(customKeyboardVisible: boolean) {
    const height = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    const animate = React.useCallback(
        (show: boolean) => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: show ? 1.0 : 0.0,
                    duration: UIConstant.animationDuration(),
                    easing: getEasingFunction(LayoutAnimation.Types.keyboard),
                    useNativeDriver: true,
                }),
                Animated.timing(height, {
                    toValue: show ? CustomKeyboardKeyboardHeight : 0.0,
                    duration: UIConstant.animationDuration(),
                    easing: getEasingFunction(LayoutAnimation.Types.keyboard),
                    useNativeDriver: false,
                }),
            ]).start();
        },
        [height, opacity],
    );

    React.useEffect(() => {
        if (customKeyboardVisible) {
            animate(true);
        } else {
            animate(false);
        }
    }, [customKeyboardVisible, animate]);

    return {
        height,
        opacity,
    };
}

type Props = {
    children: React.ReactNode;
};

export function CustomKeyboardWrapper({ children }: Props) {
    const { height, opacity } = useCustomKeyboardWrapperAnimations(children != null);

    return (
        <Animated.View>
            <Animated.View
                style={[
                    {
                        height,
                        opacity,
                    },
                ]}
            >
                {children}
            </Animated.View>
        </Animated.View>
    );
}
