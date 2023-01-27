import type { WithSpringConfig } from 'react-native-reanimated';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

export const UIConstant = {
    loaderSize: 18,

    buttonBorderWidth: 1,

    boxButtonHeight: UILayoutConstant.buttonHeight,
    msgButtonHeight: UILayoutConstant.mediumButtonHeight,
    pillButtonHeight: UILayoutConstant.smallButtonHeight,
    linkButtonHeight: UILayoutConstant.buttonHeight,
    actionButtonHeight: UILayoutConstant.mediumButtonHeight,
    actionButtonIconSize: 16,

    showMoreButtonIndicatorSizeMedium: 18,
    showMoreButtonIndicatorSizeSmall: 12,
    showMoreButtonSizeMedium: UILayoutConstant.mediumButtonHeight,
    showMoreButtonSizeSmall: UILayoutConstant.smallButtonHeight,

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
    indicator: {
        defaultSize: 20,
        defaultTrackWidth: 1.75,
    },
};

export const BUTTON_WITH_SPRING_CONFIG: WithSpringConfig = {
    damping: 100,
    stiffness: 500,
};
