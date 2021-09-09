import type { UIBoxButtonVariant, ColorVariants } from '@tonlabs/uikit.hydrogen';
import type Animated from 'react-native-reanimated';

// eslint-disable-next-line no-shadow
export enum UINoticeType {
    TopToast = 'TopToast',
    BottomToast = 'BottomToast',
}

// eslint-disable-next-line no-shadow
export enum UINoticeColor {
    PrimaryInverted = 'PrimaryInverted',
    Secondary = 'Secondary',
    Negative = 'Negative',
}

// eslint-disable-next-line no-shadow
export enum UINoticeDuration {
    Long = 'Long',
    Short = 'Short',
}

export type UINoticeActionAttributes = {
    title: string;
    onTap: () => void;
};

export type NoticeProps = {
    type: UINoticeType;
    color: UINoticeColor;
    title: string;
    onPress: () => void;
    onLongPress: () => void;
    onPressOut: () => void;
    action?: UINoticeActionAttributes;
    countdownValue: Animated.SharedValue<number>;
    countdownProgress: Animated.SharedValue<number>;
    testID?: string;
};

export type ActionProps = {
    action?: UINoticeActionAttributes;
    variant?: UIBoxButtonVariant;
};

export type UINoticeProps = {
    /**
     * Type of notification
     */
    type: UINoticeType;
    /**
     * Color of notification
     */
    color: UINoticeColor;
    /**
     * Is the notification visible
     */
    visible: boolean;
    /**
     * Title of notification
     */
    title: string;
    /**
     * Action attributes
     */
    action?: UINoticeActionAttributes;
    /**
     * How long will the notification be displayed
     */
    duration?: UINoticeDuration; // By default: UINoticeDuration.Long
    /**
     * The callback that is called when the notification is closed
     */
    onClose?: () => void;
    /**
     * The callback that is called when the notification is tapped/clicked
     */
    onTap?: () => void;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type ToastNoticeProps = UINoticeProps & {
    onCloseAnimationEnd: () => void;
    suspendClosingTimer: () => void;
    continueClosingTimer: () => void;
    keyboardHeight: Animated.SharedValue<number>;
    countdownValue: Animated.SharedValue<number>;
    countdownProgress: Animated.SharedValue<number>;
};

export type SnapPoints = {
    openedSnapPoint: Readonly<Animated.SharedValue<number>>;
    closedSnapPoint: Readonly<Animated.SharedValue<number>>;
};

/**
 * UIPopup.Notice interface
 */
export type IUINotice = React.FC<UINoticeProps> & {
    Type: typeof UINoticeType;
    Color: typeof UINoticeColor;
    Duration: typeof UINoticeDuration;
};

export type CountdownCirlceProps = {
    countdownValue: Animated.SharedValue<number>;
    countdownProgress: Animated.SharedValue<number>;
    color: ColorVariants;
};
