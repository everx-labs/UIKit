import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

import type { ColorVariants } from '@tonlabs/uikit.themes';

type BackgroundParams = {
    animationParam: Animated.SharedValue<number>;
    backgroundStyle?: Animated.AnimatedStyleProp<ViewStyle>;
    overlayStyle?: Animated.AnimatedStyleProp<ViewStyle>;
};

type ContentParams = {
    animationParam: Animated.SharedValue<number>;
    style: Animated.AnimatedStyleProp<TextStyle | ImageStyle>;
    initialColor?: ColorVariants;
    activeColor?: ColorVariants;
};

export type ButtonAnimations = {
    hover?: BackgroundParams;
    press?: BackgroundParams;
    title?: ContentParams;
    icon?: ContentParams;
};
