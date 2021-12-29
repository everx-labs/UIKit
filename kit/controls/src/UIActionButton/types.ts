import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { ColorValue, ImageSourcePropType, TextStyle } from 'react-native';
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
    animatedProps: { tintColor?: ColorValue };
    initialColor?: ColorVariants;
};

export type ContentAnimations = {
    titleStyle: AnimatedStyleProp<TextStyle>;
    iconProps: { tintColor?: ColorValue };
};

export type ActionButtonColors = {
    normal: ColorVariants;
    hover: ColorVariants;
    pressed: ColorVariants;
    disabled: ColorVariants;
};

export type ActionButtonColorScheme = {
    overlay: ActionButtonColors;
    content: ActionButtonColors;
};
