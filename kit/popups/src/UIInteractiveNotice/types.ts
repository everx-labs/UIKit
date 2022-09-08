import type { UIImageProps } from '@tonlabs/uikit.media';
import type Animated from 'react-native-reanimated';
import type { ActionProps, UINoticeActionAttributes, UINoticeDuration } from '../Notice';

export type UIInteractiveNoticeProps = {
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
    hasCountdown?: boolean;
};

export type InteractiveNoticeProps = {
    title: string;
    onPress: () => void;
    onLongPress: () => void;
    onPressOut: () => void;
    action?: UINoticeActionAttributes;
    countdownProgress: Animated.SharedValue<number>;
    hasCountdown?: boolean;
    testID?: string;
    icon?: UIImageProps['source'];
};

export type { ActionProps, UINoticeActionAttributes };
