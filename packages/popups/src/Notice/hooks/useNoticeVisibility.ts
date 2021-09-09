import * as React from 'react';
import {
    useSharedValue,
    withTiming,
    cancelAnimation,
    useAnimatedReaction,
    runOnJS,
    useDerivedValue,
    Easing,
} from 'react-native-reanimated';
import { UIConstant } from '@tonlabs/uikit.navigation';
import { UINoticeDuration } from '../types';

const useNotificationDuration = (duration: UINoticeDuration | undefined) => {
    return React.useMemo(() => {
        switch (duration) {
            case UINoticeDuration.Short:
                return UIConstant.notice.notificationDurationsShort;
            case UINoticeDuration.Long:
            default:
                return UIConstant.notice.notificationDurationsLong;
        }
    }, [duration]);
};

export const useNoticeVisibility = (
    onClose: (() => void) | undefined,
    visible: boolean,
    duration: UINoticeDuration | undefined,
) => {
    const [noticeVisible, setNoticeVisible] = React.useState(visible);
    const countdownValue = useSharedValue<number>(-1);

    const notificationDuration = useNotificationDuration(duration);

    const countdownProgress = useDerivedValue(() => {
        return 1 - countdownValue.value / notificationDuration;
    }, [notificationDuration]);

    useAnimatedReaction(
        () => {
            return {
                countdownValue: countdownValue.value,
                visible,
                onClose,
            };
        },
        state => {
            if (state.countdownValue === 0 && state.visible && state.onClose) {
                runOnJS(state.onClose)();
            }
        },
        [visible, onClose],
    );

    const onNoticeCloseAnimationFinished = React.useCallback(() => {
        setNoticeVisible(false);
        countdownValue.value = -1;
        if (visible && onClose) {
            onClose();
        }
    }, [onClose, countdownValue, visible]);

    const startCountdown = React.useCallback(() => {
        countdownValue.value = notificationDuration;
        countdownValue.value = withTiming(0, {
            duration: notificationDuration,
            easing: Easing.linear,
        });
    }, [countdownValue, notificationDuration]);

    const pauseCountdown = React.useCallback(() => {
        cancelAnimation(countdownValue);
    }, [countdownValue]);

    React.useEffect(() => {
        if (visible) {
            setNoticeVisible(true);
        }
    }, [visible]);

    return {
        noticeVisible,
        countdownValue,
        countdownProgress,
        startClosingTimer: startCountdown,
        clearClosingTimer: pauseCountdown,
        onNoticeCloseAnimationFinished,
    };
};
