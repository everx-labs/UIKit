import type { StyleProp, ViewStyle } from 'react-native';
import type { ColorVariants } from '@tonlabs/uikit.themes';
import type { UIImageProps } from '@tonlabs/uikit.media';

export type InputIconProps = UIImageProps & {
    /**
     * Callback called by clicking/tapping on the icon
     */
    onPress?: () => void;
    /**
     * Style of icon container view
     */
    containerStyle?: StyleProp<ViewStyle>;
};

export type InputActionProps = InputTextProps & {
    /**
     * Flag whether input action is disabled or not
     */
    disabled?: boolean;
    /**
     * Callback called by clicking/tapping on the action
     */
    onPress?: () => void;
    /**
     * Children tint color
     */
    tintColor?: ColorVariants;
};

export type InputTextProps = {
    /**
     * You can pass a `string`, `Image`, or any other element as children.
     *
     * If it is a `string`, it will be placed in a `Label` with suitable styles.
     *
     * If it is the `Image`, a suitable `tintColor` prop and size styles will be passed to it.
     *
     * Any other element will be displayed unchanged.
     */
    children: React.ReactNode;
};

export type InputClearButtonProps = {
    clear: (() => void) | undefined;
};

export type InputIconChild = React.ReactElement<InputIconProps>;
export type InputActionChild = React.ReactElement<InputActionProps>;
export type InputTextChild = React.ReactElement<InputTextProps>;
export type InputChild = InputIconChild | InputActionChild | InputTextChild;

export type InputChildren = InputChild | InputChild[] | undefined;
