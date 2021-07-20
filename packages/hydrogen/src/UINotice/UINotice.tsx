import * as React from 'react';
import { UINoticeProps, UINoticeType } from './types';
import { ToastNotice } from './ToastNotice';

const ANIMATION_DURATION = 1000

export const UINotice: React.FC<UINoticeProps> = (props: UINoticeProps) => {
    const [noticeVisible, setNoticeVisible] = React.useState(!props.visible)
    React.useEffect(() => {
        let timerId: NodeJS.Timeout
        if (props.visible) {
            setNoticeVisible(true)
        } else {
            timerId = setTimeout(() => {
                setNoticeVisible(false)
            }, ANIMATION_DURATION)
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    }, [props.visible])
    if (!noticeVisible) {
        return null
    }
    switch (props.type) {
        case UINoticeType.Toast:
            return <ToastNotice {...props} />
        case UINoticeType.Bottom:
        case UINoticeType.Top:
        default:
            return <ToastNotice {...props} />
    }
};
