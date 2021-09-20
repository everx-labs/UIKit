import * as React from 'react';

// TODO: use new notice here!
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
                    maxLength.toString(),
                ),
                undefined,
                () => {
                    isAlertShown.current = false;
                },
            );
        }
    }, [maxLength]);
}
