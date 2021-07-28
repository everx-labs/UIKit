import * as React from 'react';
import { UIConstant } from '../../constants';
import { UINoticeDuration } from '../types';

const getNotificationDuration = (duration: UINoticeDuration | undefined) => {
    switch (duration) {
        case UINoticeDuration.Short:
            return UIConstant.notice.notificationDurationsShort;
        case UINoticeDuration.Long:
        default:
            return UIConstant.notice.notificationDurationsLong;
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
            /** Timer is already running */
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
