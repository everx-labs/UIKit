import * as React from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

import {
    QRCodeRef,
    QRCodeSize,
    QRCodeType,
    UIImage,
    UIQRCodeView,
    useQRCodeValueError,
} from '@tonlabs/uikit.media';
import { uiLocalized } from '@tonlabs/localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TypographyVariants,
    UILabel,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';
import { MessageStatus } from './constants';
import type { ChatQRCodeMessage, QRCodeMessage } from './types';

function getErrorMessage(messageStatus: MessageStatus): string {
    switch (messageStatus) {
        case MessageStatus.Received:
            return uiLocalized.Chats.QRCode.errorReceived;
        default:
            return uiLocalized.Chats.QRCode.errorSent;
    }
}

function renderErrorIcon(
    messageStatus: MessageStatus,
    iconStyles: StyleProp<ImageStyle>,
): React.ReactElement | null {
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
}

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
                    {
                        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
                        paddingHorizontal: UILayoutConstant.normalContentOffset,
                    },
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
            {renderErrorIcon(messageStatus, iconStyles)}
        </View>
    );
};

export function QRCodeContainer({
    qrCodeRef,
    // @ts-ignore
    children,
    style,
    onPress,
}: {
    onPress?: QRCodeMessage['onPress'];
    qrCodeRef: React.MutableRefObject<QRCodeRef | null>;
    style: StyleProp<ViewStyle>;
    children: React.ReactNode;
}) {
    const onQRCodePress = React.useCallback(async () => {
        if (!qrCodeRef.current) {
            return;
        }

        const base64 = await qrCodeRef.current.getPng();
        if (!base64) {
            return;
        }

        onPress?.(base64);
    }, [onPress, qrCodeRef]);

    if (onPress) {
        return (
            <UIPressableArea onPress={onQRCodePress}>
                <View style={style}>{children}</View>
            </UIPressableArea>
        );
    }

    return <View style={style}>{children}</View>;
}

export function BubbleQRCode(message: QRCodeMessage) {
    const { status, data, onError, onSuccess, onLayout, onPress } = message;
    const theme = useTheme();
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(
        message,
        position,
        UILayoutConstant.mediumBorderRadius,
    );
    const styles = useStyles(theme);
    const ref = React.useRef<QRCodeRef | null>(null);

    const error = useQRCodeValueError(data, onError, onSuccess);

    if (error) {
        return renderError(
            status,
            [containerStyle, styles.errorContainer],
            roundedCornerStyle,
            styles.errorBubble,
            styles.icon as ImageStyle,
        );
    }

    return (
        <View style={containerStyle} onLayout={onLayout}>
            <View
                style={[
                    {
                        paddingVertical: UILayoutConstant.contentInsetVerticalX3,
                        paddingHorizontal: UILayoutConstant.normalContentOffset,
                    },
                    bubbleBackgroundColor,
                    roundedCornerStyle,
                ]}
            >
                {/** @ts-ignore */}
                <QRCodeContainer qrCodeRef={ref} style={styles.qrCode} onPress={onPress}>
                    <UIQRCodeView
                        ref={ref}
                        size={QRCodeSize.Medium}
                        testID={`chat_qr_code_${data}`}
                        type={QRCodeType.Square}
                        logo={UIAssets.icons.brand.surfSymbolBlack}
                        value={data}
                    />
                </QRCodeContainer>
            </View>
        </View>
    );
}

export function ChatBubbleQRCode(message: ChatQRCodeMessage) {
    return <BubbleQRCode {...message} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    qrCode: {
        borderRadius: UILayoutConstant.borderRadius,
        overflow: 'hidden',
    },
    errorBubble: {
        backgroundColor: theme[ColorVariants.BackgroundTertiary],
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
