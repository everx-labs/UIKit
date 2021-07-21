import * as React from 'react';
import { UINoticeProps, UINoticeType } from './types';
import { ToastNotice } from './ToastNotice';

// const ANIMATION_DURATION = 1000

export const UINotice: React.FC<UINoticeProps> = (props: UINoticeProps) => {
    const [noticeVisible, setNoticeVisible] = React.useState(props.visible);
    React.useEffect(() => {
        if (props.visible) {
            setNoticeVisible(true);
        }
    }, [props.visible]);

    const onClose = React.useCallback(() => {
        setNoticeVisible(false);
        if (props.onClose) {
            props.onClose();
        }
    }, [props]);

    if (!noticeVisible) {
        return null;
    }
    switch (props.type) {
        case UINoticeType.Toast:
            return <ToastNotice {...props} onClose={onClose} />;
        case UINoticeType.Bottom:
        case UINoticeType.Top:
        default:
            return <ToastNotice {...props} onClose={onClose} />;
    }
};
