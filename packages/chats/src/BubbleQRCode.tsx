import * as React from 'react';
import { View } from 'react-native';

import { UIQRCodeView, QRCodeType, QRCodeSize, useQRCodeValueError } from '@tonlabs/uikit.flask';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import { useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';
import type { QRCodeMessage, ChatQRCodeMessage } from './types';

export const ChatBubbleQRCode: React.FC<ChatQRCodeMessage> = (message: ChatQRCodeMessage) => {
    return <BubbleQRCode {...message} />;
};

export const BubbleQRCode: React.FC<QRCodeMessage> = (message: QRCodeMessage) => {
    const { status, data, onError, onSuccess } = message;
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(
        message,
        position,
        UIConstant.mediumBorderRadius(),
    );
    const styles = useStyles();

    const error = useQRCodeValueError(data, onError, onSuccess);

    if (error !== null) {
        return null;
    }

    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <View
                style={[
                    UIStyle.padding.verticalNormal(),
                    UIStyle.padding.horizontalNormal(),
                    bubbleBackgroundColor,
                    roundedCornerStyle,
                ]}
            >
                <View style={styles.qrCode}>
                    <UIQRCodeView
                        size={QRCodeSize.Medium}
                        testID={`chat_qr_code_${data}`}
                        type={QRCodeType.Square}
                        logo={UIAssets.icons.brand.tonSymbolBlack}
                        value={data}
                    />
                </View>
            </View>
        </View>
    );
};

const useStyles = makeStyles(() => ({
    qrCode: {
        borderRadius: UIConstant.mediumBorderRadius(),
        overflow: 'hidden',
    },
}));
