import * as React from 'react';
import { Animated, LayoutAnimation } from 'react-native';

import { UIConstant, UIDevice } from '@tonlabs/uikit.core';
import { UIController } from '@tonlabs/uikit.navigation';

const CustomKeyboardKeyboardHeight = UIDevice.isDesktop() ? 180 : 270;

function useCustomKeyboardWrapperAnimations(customKeyboardVisible: boolean) {
    const height = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    const animate = React.useCallback((show: boolean) => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: show ? 1.0 : 0.0,
                duration: UIConstant.animationDuration(),
                easing: UIController.getEasingFunction(
                    LayoutAnimation.Types.keyboard,
                ),
                useNativeDriver: true,
            }),
            Animated.timing(height, {
                toValue: show ? CustomKeyboardKeyboardHeight : 0.0,
                duration: UIConstant.animationDuration(),
                easing: UIController.getEasingFunction(
                    LayoutAnimation.Types.keyboard,
                ),
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    React.useEffect(() => {
        if (customKeyboardVisible) {
            animate(true);
        } else {
            animate(false);
        }
    }, [customKeyboardVisible]);

    return {
        height,
        opacity,
    };
}

type Props = {
    isCustomKeyboard?: boolean;
    customKeyboardVisible: boolean;
    children: React.ReactNode;
};

export function CustomKeyboardWrapper(props: Props) {
    const { height, opacity } = useCustomKeyboardWrapperAnimations(
        props.customKeyboardVisible,
    );

    if (props.isCustomKeyboard) {
        return (
            <Animated.View
                style={{
                    opacity,
                }}
            >
                {props.children}
            </Animated.View>
        );
    }

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
                {props.children}
            </Animated.View>
        </Animated.View>
    );
}
