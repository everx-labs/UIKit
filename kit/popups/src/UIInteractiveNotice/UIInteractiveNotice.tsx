import * as React from 'react';

import { Portal } from '@tonlabs/uikit.layout';

import { ToastNoticeContainer } from '../Notice/ToastNoticeContainer';
import { useNoticeVisibility } from '../Notice/hooks/useNoticeVisibility';
import { UINoticeType } from '../Notice';

import { UIInteractiveNoticeContent } from './UIInteractiveNoticeContent';
import type { UIInteractiveNoticeProps } from './types';

export function UIInteractiveNotice({
    visible,
    duration,
    onClose,
    onTap,
    title,
    icon,
    hasCountdown,
}: UIInteractiveNoticeProps) {
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
                    <UIInteractiveNoticeContent
                        title={title}
                        icon={icon}
                        countdownProgress={countdownProgress}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        onPressOut={onPressOut}
                        hasCountdown={hasCountdown}
                    />
                )}
            </ToastNoticeContainer>
        </Portal>
    );
}
