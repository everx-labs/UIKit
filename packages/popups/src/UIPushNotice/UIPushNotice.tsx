import * as React from 'react';

import { Portal } from '@tonlabs/uikit.hydrogen';

import { ToastNoticeContainer } from '../Notice/ToastNoticeContainer';
import { useNoticeVisibility } from '../Notice/hooks/useNoticeVisibility';
import { UINoticeDuration, UINoticeType } from '../Notice';

import { UIPushNoticeContent, UIPushNoticeContentPublicProps } from './UIPushNoticeContent';

export type UIPushNoticeProps = UIPushNoticeContentPublicProps & {
    visible: boolean;
    duration?: UINoticeDuration;
    onClose?: () => void;
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
