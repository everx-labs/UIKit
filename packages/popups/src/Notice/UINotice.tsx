import * as React from 'react';
import { useAnimatedKeyboardHeight } from '@tonlabs/uikit.inputs';
import { UINoticeProps, UINoticeType } from './types';
import { ToastNotice } from './ToastNotice';
import { useNoticeVisibility } from './hooks/useNoticeVisibility';

export const UINotice: React.FC<UINoticeProps> = (props: UINoticeProps) => {
    const { onClose, visible, type, duration } = props;

    const {
        noticeVisible,
        countdownValue,
        countdownProgress,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    } = useNoticeVisibility(onClose, visible, duration);

    const keyboardHeight = useAnimatedKeyboardHeight();

    if (!noticeVisible) {
        return null;
    }
    switch (type) {
        // TODO Add UINoticeType.Top and UINoticeType.Bottom here
        case UINoticeType.BottomToast:
        case UINoticeType.TopToast:
        default:
            return (
                <ToastNotice
                    {...props}
                    onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                    suspendClosingTimer={clearClosingTimer}
                    continueClosingTimer={startClosingTimer}
                    keyboardHeight={keyboardHeight}
                    countdownValue={countdownValue}
                    countdownProgress={countdownProgress}
                />
            );
    }
};
