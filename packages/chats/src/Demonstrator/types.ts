import type Animated from "react-native-reanimated";

export type Dimensions = {
    width: Animated.SharedValue<number>;
    height: Animated.SharedValue<number>;
    pageX: Animated.SharedValue<number>;
    pageY: Animated.SharedValue<number>;
};
