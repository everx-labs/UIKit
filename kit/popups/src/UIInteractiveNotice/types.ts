import type { UIImageProps } from '@tonlabs/uikit.media';
import type Animated from 'react-native-reanimated';
import type { UINoticeDuration, UINoticeType } from '../Notice';

export type UIInteractiveNoticeAction = {
    title: string;
    onTap: () => void;
};

export type UIInteractiveNoticeProps = {
    /**
     * Type of notification
     *
     * @default UINoticeType.BottomToast
     */
    type?: UINoticeType;
    /**
     * A title of the notification.
     */
    title: string;
    /**
     * Notice is a controlled component,
     * so to controll visibility use the prop.
     */
    visible: boolean;
    /**
     * Optional prop to control duration of how long it will be opened.
     *
     * By default - UINoticeDuration.Long
     */
    duration?: UINoticeDuration;
    /**
     * A callback that is called when duration has expired,
     * and notice wants to be closed.
     * Or the close button was pressed.
     *
     * One have to set `visible` to `false` in this callback,
     * as component is controlled.
     */
    onClose: () => void;
    /**
     * A callback that is fired when user tap on notice.
     */
    onTap?: () => void;
    /**
     * Optional icon source
     */
    icon?: UIImageProps['source'];
    /**
     * Is the countdown displayed (default: false)
     */
    hasCountdown?: boolean;
    /**
     * Action or action list
     */
    actions?: UIInteractiveNoticeAction | UIInteractiveNoticeAction[];
    /**
     * Should notification show the close button
     */
    showCloseButton?: boolean;
    /**
     * ID for usage in tests
     */
    testID?: string;
};

export type InteractiveNoticeContentProps = UIInteractiveNoticeProps & {
    onPress: () => void;
    onLongPress: () => void;
    onPressOut: () => void;
    countdownProgress: Animated.SharedValue<number>;
};
