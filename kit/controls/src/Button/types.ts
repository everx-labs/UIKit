import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';

import type { ColorVariants } from '@tonlabs/uikit.themes';

type BackgroundParams = {
    animationParam: Animated.SharedValue<number>;
    backgroundStyle?: AnimatedStyleProp<ViewStyle>;
    overlayStyle?: AnimatedStyleProp<ViewStyle>;
};

type ContentParams = {
    animationParam: Animated.SharedValue<number>;
    style: AnimatedStyleProp<TextStyle | ImageStyle>;
    initialColor?: ColorVariants;
    activeColor?: ColorVariants;
};

export type ButtonAnimations = {
    hover?: BackgroundParams;
    press?: BackgroundParams;
    title?: ContentParams;
    icon?: ContentParams;
};
