import { Platform, Share, Clipboard } from 'react-native';

import UIToastMessage from '../../components/notifications/UIToastMessage';

export default class UIShareManager {
    // Private
    static copyToClipboard(message, success) {
        if (!message) {
            return;
        }
        Clipboard.setString(message);
        UIToastMessage.showMessage(success);
    }

    static shareMessage(message, success) {
        if (!message) {
            return;
        }
        const content = {
            message,
        };
        Share.share(content).then((result) => {
            console.log('[UIShareManager] Message successfully shared with result:', result, success);
        }).catch((error) => {
            console.warn('[UIShareManager] Failed to share message with error:', error);
        });
    }

    // Public
    static share(message, success) {
        if (Platform.OS === 'web') {
            this.copyToClipboard(message, success);
        } else {
            this.shareMessage(message, success);
        }
    }
}
