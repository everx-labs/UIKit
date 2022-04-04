import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { StyleProp, ViewStyle } from 'react-native';

export type PressableProps = {
    onPress?: () => void | Promise<void>;
    onLongPress?: () => void | Promise<void>;

    disabled?: boolean;
    loading?: boolean;

    // Colors:
    initialColor: ColorVariants;
    pressColor: ColorVariants;
    hoverColor: ColorVariants;
    disabledColor: ColorVariants;

    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
