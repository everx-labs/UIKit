import * as React from 'react';

import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

export function useChatMaxLengthAlert(maxLength: number) {
    const isAlertShown = React.useRef(false);

    return React.useCallback(() => {
        if (!isAlertShown.current) {
            isAlertShown.current = true;
            UIDropdownAlert.showNotification(
                uiLocalized.formatString(
                    uiLocalized.Chats.Alerts.MessageTooLong,
                    maxLength,
                ),
                undefined,
                () => {
                    isAlertShown.current = false;
                },
            );
        }
    }, [maxLength]);
}
