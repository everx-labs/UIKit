import * as React from 'react';
import { UINoticeProps, UINoticeType } from './types';
import { ToastNotice } from './ToastNotice';
import { useNoticeVisibility } from './hooks/useNoticeVisibility';
import { useAnimatedKeyboard } from '../useAnimatedKeyboard';

export const UINotice: React.FC<UINoticeProps> = (props: UINoticeProps) => {
    const { onClose, visible, type, duration } = props;

    const {
        noticeVisible,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    } = useNoticeVisibility(onClose, visible, duration);

    const keyboardHeight = useAnimatedKeyboard();

    if (!noticeVisible) {
        return null;
    }
    switch (type) {
        case UINoticeType.BottomToast:
        case UINoticeType.TopToast:
            return (
                <ToastNotice
                    {...props}
                    onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                    suspendClosingTimer={clearClosingTimer}
                    continueClosingTimer={startClosingTimer}
                    keyboardHeight={keyboardHeight}
                />
            );
        case UINoticeType.Bottom:
        case UINoticeType.Top:
        default:
            return (
                <ToastNotice
                    {...props}
                    onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                    suspendClosingTimer={clearClosingTimer}
                    continueClosingTimer={startClosingTimer}
                    keyboardHeight={keyboardHeight}
                />
            );
    }
};
