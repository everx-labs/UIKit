import * as React from 'react';

import { Portal } from '@tonlabs/uikit.hydrogen';

import { ToastNoticeContainer } from '../Notice/ToastNoticeContainer';
import { useNoticeVisibility } from '../Notice/hooks/useNoticeVisibility';
import { UINoticeDuration, UINoticeType } from '../Notice';

import { UIPushNoticeContent, UIPushNoticeContentPublicProps } from './UIPushNoticeContent';

export type UIPushNoticeProps = UIPushNoticeContentPublicProps & {
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
};

export function UIPushNotice({
    visible,
    duration,
    onClose,
    onTap,
    title,
    message,
    icon,
}: UIPushNoticeProps) {
    const {
        noticeVisible,
        countdownProgress,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    } = useNoticeVisibility(onClose, visible, duration);

    if (!noticeVisible) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <ToastNoticeContainer
                type={UINoticeType.TopToast}
                visible={visible}
                onTap={onTap}
                onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                suspendClosingTimer={clearClosingTimer}
                continueClosingTimer={startClosingTimer}
            >
                {({ onPress, onLongPress, onPressOut }) => (
                    <UIPushNoticeContent
                        title={title}
                        message={message}
                        icon={icon}
                        countdownProgress={countdownProgress}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        onPressOut={onPressOut}
                    />
                )}
            </ToastNoticeContainer>
        </Portal>
    );
}
