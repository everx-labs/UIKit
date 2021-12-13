import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { ImageSourcePropType, ImageStyle, TextStyle } from 'react-native';
import type { AnimatedStyleProp } from 'react-native-reanimated';
import type { BackgroundParams } from '../Button/types';

export type ActionButtonAnimations = {
    hover: BackgroundParams;
    press: BackgroundParams;
};

// eslint-disable-next-line no-shadow
export enum UIActionButtonType {
    Primary = 'Primary',
    Accent = 'Accent',
}

export type UIActionButtonIconProps = {
    icon?: ImageSourcePropType;
    loading?: boolean;
    animStyles: {
        hoverStyle: AnimatedStyleProp<ImageStyle>;
        pressStyle: AnimatedStyleProp<ImageStyle>;
    };
    initialColor?: ColorVariants;
};

export type ContentAnimations = {
    titleStyle: AnimatedStyleProp<TextStyle>;
    icon: {
        hoverStyle: AnimatedStyleProp<ImageStyle>;
        pressStyle: AnimatedStyleProp<ImageStyle>;
    };
};
