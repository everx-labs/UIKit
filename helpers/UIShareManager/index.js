// @flow

import { Platform, Share, Clipboard } from 'react-native';

import UIToastMessage from '../../components/notifications/UIToastMessage';
import UIShareScreen from './UIShareScreen';

export default class UIShareManager {
    // Private
    static copyToClipboard(message: string, success: string) {
        if (!message) {
            return;
        }
        Clipboard.setString(message);
        UIToastMessage.showMessage(success);
    }

    static shareMessage(message: string, success: string) {
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
    static share(message: string, success: string) {
        if (Platform.OS === 'web') {
            UIShareScreen.share({ message });
        } else {
            this.shareMessage(message, success);
        }
    }
}
