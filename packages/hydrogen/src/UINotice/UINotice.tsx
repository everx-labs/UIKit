import * as React from 'react';
import { UINoticeProps, UINoticeType } from './types';
import { BottomToastNotice } from './BottomToastNotice';
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
            return (
                <BottomToastNotice
                    {...props}
                    onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                    suspendClosingTimer={clearClosingTimer}
                    continueClosingTimer={startClosingTimer}
                    keyboardHeight={keyboardHeight}
                />
            );
        case UINoticeType.TopToast:
        case UINoticeType.Bottom:
        case UINoticeType.Top:
        default:
            return (
                <BottomToastNotice
                    {...props}
                    onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                    suspendClosingTimer={clearClosingTimer}
                    continueClosingTimer={startClosingTimer}
                    keyboardHeight={keyboardHeight}
                />
            );
    }
};
