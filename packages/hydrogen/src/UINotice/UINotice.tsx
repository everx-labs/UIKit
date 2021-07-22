import * as React from 'react';
import { UINoticeProps, UINoticeType } from './types';
import { BottomToastNotice } from './BottomToastNotice';
import { useNoticeVisibility } from './hooks/useNoticeVisibility';

export const UINotice: React.FC<UINoticeProps> = (props: UINoticeProps) => {
    const { onClose, visible, type, duration } = props;

    const {
        noticeVisible,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    } = useNoticeVisibility(onClose, visible, duration);

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
                />
            );
    }
};
