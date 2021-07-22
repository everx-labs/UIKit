import * as React from 'react';
import { Platform } from 'react-native';
import { UINoticeDuration } from '../types';

const PLATFORM_NOTIFICATION_DURATION_MULTIPLIER =
    Platform.OS === 'web' ? 1.5 : 1;
const NOTIFICATION_DURATION_SHORT =
    1500 * PLATFORM_NOTIFICATION_DURATION_MULTIPLIER;
const NOTIFICATION_DURATION_LONG =
    3000 * PLATFORM_NOTIFICATION_DURATION_MULTIPLIER;

const getNotificationDuration = (duration: UINoticeDuration | undefined) => {
    switch (duration) {
        case UINoticeDuration.Short:
            return NOTIFICATION_DURATION_SHORT;
        case UINoticeDuration.Long:
        default:
            return NOTIFICATION_DURATION_LONG;
    }
};

export const useNoticeVisibility = (
    onClose: (() => void) | undefined,
    visible: boolean,
    duration: UINoticeDuration | undefined,
) => {
    const [noticeVisible, setNoticeVisible] = React.useState(visible);
    const timerId = React.useRef<NodeJS.Timeout | null>(null);

    const startClosingTimer = React.useCallback(() => {
        if (timerId.current) {
            /** Timer is already run */
            return;
        }

        timerId.current = setTimeout(() => {
            if (visible && onClose) {
                onClose();
            }
        }, getNotificationDuration(duration));
    }, [onClose, duration, visible]);

    const clearClosingTimer = React.useCallback(() => {
        if (!timerId.current) {
            /** Timer is not exist */
            return;
        }

        clearTimeout(timerId.current);
        timerId.current = null;
    }, []);

    const onNoticeCloseAnimationFinished = React.useCallback(() => {
        setNoticeVisible(false);
        clearClosingTimer();
        if (visible && onClose) {
            onClose();
        }
    }, [onClose, clearClosingTimer, visible]);

    React.useEffect(() => {
        if (visible) {
            setNoticeVisible(true);
        }
    }, [visible, startClosingTimer]);

    return {
        noticeVisible,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    };
};
