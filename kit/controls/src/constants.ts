// import { Platform } from 'react-native';
import type Animated from 'react-native-reanimated';

export const UIConstant = {
    iconSize: 24,

    loaderSize: 18,

    buttonBorderWidth: 1,

    boxButtonHeight: 48,
    msgButtonHeight: 40,
    pillButtonHeight: 32,
    linkButtonHeight: 48,

    showMoreButtonIndicatorSizeMedium: 18,
    showMoreButtonIndicatorSizeSmall: 12,
    showMoreButtonSizeMedium: 40,
    showMoreButtonSizeSmall: 32,

    tinyContentOffset: 4,
    smallContentOffset: 8,
    normalContentOffset: 12,
    alertBorderRadius: 12,
    pillButtonBorderRadius: 20,

    switcher: {
        circlePadding: 2,
        squarePadding: 3,
        squareBorderRadius: 4,
        thikIconSize: 12,
        radioDotSize: 8,
        offBorderWidth: 1.75,
        toggleDotSize: 10,
        toggleWidth: 32,
        toggleHeight: 18,
        togglePadding: 4,
    },
};

export const BUTTON_WITH_SPRING_CONFIG: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 500,
};
