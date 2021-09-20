// @flow
import { Platform, Share } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import UIShareScreen from './UIShareScreen';

const RNShare = Platform.OS === 'web' ? undefined : require('react-native-share').default;

export type ShareOptions = {
    title?: string,
    message?: string,
    url: string,
    type: string,
    subject?: string,
    excludedActivityTypes?: string[],
};

export default class UIShareManager {
    static async shareMessage(message: string, success: string) {
        if (!message) {
            return;
        }
        const content = {
            message,
        };
        try {
            const result = await Share.share(content);
            console.log(
                '[UIShareManager] Message successfully shared with result:',
                result,
                success,
            );
        } catch (error) {
            console.warn('[UIShareManager] Failed to share message with error:', error);
        }
    }

    // Public
    static share(message: string, success: string, subtitle: ?string) {
        if (Platform.OS === 'web') {
            UIShareScreen.share({ message, subtitle });
        } else {
            this.shareMessage(message, success);
        }
    }

    static async shareImage(shareOptions: ShareOptions) {
        if (Platform.OS === 'web') {
            return;
        }

        try {
            // $FlowExpectedError
            const result = await RNShare.open(shareOptions);
            console.log('[UIShareManager] Image successfully shared with result:', result);
        } catch (error) {
            console.warn('[UIShareManager] Failed to share image with error:', error);
        }
    }
}
