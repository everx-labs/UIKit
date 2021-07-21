import * as React from 'react';
import { UINoticeProps, UINoticeType } from './types';
import { BottomToastNotice } from './BottomToastNotice';

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
        case UINoticeType.BottomToast:
            return <BottomToastNotice {...props} onClose={onClose} />;
        case UINoticeType.TopToast:
        case UINoticeType.Bottom:
        case UINoticeType.Top:
        default:
            return <BottomToastNotice {...props} onClose={onClose} />;
    }
};
