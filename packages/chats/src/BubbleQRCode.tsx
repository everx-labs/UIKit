import * as React from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

import { UIQRCodeView, QRCodeType, QRCodeSize, useQRCodeValueError } from '@tonlabs/uikit.flask';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    makeStyles,
    UILabel,
    useTheme,
    Theme,
    ColorVariants,
    TypographyVariants,
    UIImage,
} from '@tonlabs/uikit.hydrogen';
import { useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';
import { QRCodeMessage, ChatQRCodeMessage, MessageStatus } from './types';

export const ChatBubbleQRCode: React.FC<ChatQRCodeMessage> = (message: ChatQRCodeMessage) => {
    return <BubbleQRCode {...message} />;
};

const getErrorMessage = (messageStatus: MessageStatus): string => {
    switch (messageStatus) {
        case MessageStatus.Received:
            return uiLocalized.Chats.QRCode.errorReceived;
        default:
            return uiLocalized.Chats.QRCode.errorSent;
    }
};

const renderIcon = (
    messageStatus: MessageStatus,
    iconStyles: StyleProp<ImageStyle>,
): React.ReactElement | null => {
    switch (messageStatus) {
        case MessageStatus.Received:
            return null;
        default:
            return (
                <UIImage
                    source={UIAssets.icons.ui.info}
                    style={iconStyles}
                    tintColor={ColorVariants.TextSecondary}
                />
            );
    }
};

const renderError = (
    messageStatus: MessageStatus,
    containerStyle: StyleProp<ViewStyle>,
    roundedCornerStyle: StyleProp<ViewStyle>,
    errorBubble: StyleProp<ViewStyle>,
    iconStyles: StyleProp<ImageStyle>,
): React.ReactElement => {
    return (
        <View style={containerStyle}>
            <View
                style={[
                    roundedCornerStyle,
                    UIStyle.padding.verticalNormal(),
                    UIStyle.padding.horizontalNormal(),
                    errorBubble,
                ]}
            >
                <UILabel
                    role={TypographyVariants.ParagraphText}
                    color={ColorVariants.TextSecondary}
                >
                    {getErrorMessage(messageStatus)}
                </UILabel>
            </View>
            {renderIcon(messageStatus, iconStyles)}
        </View>
    );
};

export const BubbleQRCode: React.FC<QRCodeMessage> = (message: QRCodeMessage) => {
    const { status, data, onError, onSuccess } = message;
    const theme = useTheme();
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(
        message,
        position,
        UIConstant.mediumBorderRadius(),
    );
    const styles = useStyles(theme);

    const error = useQRCodeValueError(data, onError, onSuccess);

    if (error) {
        return renderError(
            message.status,
            [containerStyle, styles.errorContainer],
            roundedCornerStyle,
            styles.errorBubble,
            styles.icon as ImageStyle,
        );
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

const useStyles = makeStyles((theme: Theme) => ({
    qrCode: {
        borderRadius: UIConstant.mediumBorderRadius(),
        overflow: 'hidden',
    },
    errorBubble: {
        backgroundColor: theme[ColorVariants.BackgroundNeutral],
    },
    errorContainer: {
        flexDirection: 'row',
    },
    icon: {
        height: 24,
        aspectRatio: 1,
        marginLeft: 8,
    },
}));
