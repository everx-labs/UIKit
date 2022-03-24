import * as React from 'react';

import { Portal } from '@tonlabs/uikit.layout';

import { UINoticeProps, UINoticeType } from './types';
import { ToastNoticeContainer } from './ToastNoticeContainer';
import { useNoticeVisibility } from './hooks/useNoticeVisibility';
import { Notice } from './Notice';

export const UINotice: React.FC<UINoticeProps> = (props: UINoticeProps) => {
    const { onClose, visible, type, duration, title, color, testID, action, hasCountdown, onTap } =
        props;

    const {
        noticeVisible,
        countdownValue,
        countdownProgress,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    } = useNoticeVisibility(onClose, visible, duration);

    if (!noticeVisible) {
        return null;
    }
    switch (type) {
        // TODO Add UINoticeType.Top and UINoticeType.Bottom here
        case UINoticeType.BottomToast:
        case UINoticeType.TopToast:
        default:
            return (
                <Portal absoluteFill>
                    <ToastNoticeContainer
                        type={type}
                        visible={visible}
                        onTap={onTap}
                        onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                        suspendClosingTimer={clearClosingTimer}
                        continueClosingTimer={startClosingTimer}
                    >
                        {({ onPress, onLongPress, onPressOut }) => (
                            <Notice
                                title={title}
                                color={color}
                                testID={testID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                onPressOut={onPressOut}
                                action={action}
                                countdownValue={countdownValue}
                                countdownProgress={countdownProgress}
                                hasCountdown={hasCountdown}
                            />
                        )}
                    </ToastNoticeContainer>
                </Portal>
            );
    }
};
