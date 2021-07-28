import * as React from 'react';
import { View } from 'react-native';

import { UIQRCodeView, QRCodeType, QRCodeSize } from '@tonlabs/uikit.flask';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { makeStyles } from '@tonlabs/uikit.hydrogen';
import {
    useBubbleContainerStyle,
    useBubblePosition,
} from './useBubblePosition';
import {
    useNeutralBubbleBackgroundColor,
    useNeutralBubbleRoundedCornerStyle,
} from './useNeutralBubbleStyle';
import type { QRCodeMessage } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = UIAssets.icons.brand.tonSymbolBlack;

export const BubbleQRCode: React.FC<QRCodeMessage> = (
    message: QRCodeMessage,
) => {
    const { status, data } = message;
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useNeutralBubbleBackgroundColor(message);
    const roundedCornerStyle = useNeutralBubbleRoundedCornerStyle(
        message,
        position,
        UIConstant.mediumBorderRadius(),
    );
    const styles = useStyles();

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
                        logo={logo}
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
