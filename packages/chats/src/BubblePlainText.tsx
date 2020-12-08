import * as React from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Platform,
    View,
    Text,
    Animated,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { UIColor, UIFont, UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIShareManager } from '@tonlabs/uikit.navigation';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

import { ChatMessageMeta, ChatMessageStatus } from './types';
import type { PlainTextMessage } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

const getUrlStyle = (status: ChatMessageStatus) => {
    if (status === ChatMessageStatus.Received) {
        return styles.urlReceived;
    }

    return styles.urlSent;
};

const getFontColor = (message: PlainTextMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return UILabelColors.TextPrimary; // TODO: is it right color?
    }

    if (message.status === ChatMessageStatus.Received) {
        return UILabelColors.TextSecondary;
    }

    return UILabelColors.TextPrimaryInverted; // TODO: is it right color?
};

const getRoundedCornerStyle = (
    options: ChatMessageMeta,
    position: BubblePosition,
) => {
    if (position === BubblePosition.left && options.firstFromChain) {
        return styles.leftTopCorner;
    }

    if (position === BubblePosition.right && options.lastFromChain) {
        return styles.rightBottomCorner;
    }

    return null;
};

const getBubbleContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    }

    if (position === BubblePosition.right) {
        return styles.containerRight;
    }

    return null;
};

const getBubbleStyle = (message: PlainTextMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return styles.msgAborted;
    }

    if (message.status === ChatMessageStatus.Received) {
        return styles.msgReceived;
    }

    if (message.status === ChatMessageStatus.Sent) {
        return styles.msgSent;
    }

    if (message.status === ChatMessageStatus.Pending) {
        return styles.msgPending;
    }

    return null;
};

const getActionString = (message: PlainTextMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return message.actionText || uiLocalized.Chats.Bubbles.TapToSendAgain;
    }

    return message.actionText;
};

const getActionStringColor = (message: PlainTextMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return UILabelColors.TextNegative;
    }

    return UILabelColors.TextTertiary;
};

// For e2e tests, to create unique id as in those tests
// we don't know much about messages
const createUniqTestId = (pattern: string, variable: string) =>
    pattern.replace('%', variable);

const createTestId = (pattern: string, text: string) => {
    return createUniqTestId(
        pattern,
        `_${text.split(' ').slice(0, 2).join(' ')}`,
    );
};

function BubbleTime(props: PlainTextMessage) {
    return (
        <View style={styles.timeTextContainer}>
            <Text
                testID={createTestId('chat_text_message%_time', props.text)}
                style={[UIFont.tinyRegular(), styles.timeText]}
            >
                {uiLocalized.formatTime(props.time || Date.now())}
            </Text>
        </View>
    );
}

export function BubblePlainText(props: PlainTextMessage) {
    const scale = React.useRef(new Animated.Value(1)).current;
    const bubbleScaleAnimation = (scaleIn = false) => {
        Animated.spring(scale, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };
    const position = useBubblePosition(props.status);
    const actionString = getActionString(props);

    return (
        <View style={[getBubbleContainer(position)]}>
            <TouchableWithoutFeedback
                onPressOut={() => bubbleScaleAnimation()}
                onPress={props.onTouchText}
                onLongPress={() => {
                    bubbleScaleAnimation(true);
                    UIShareManager.copyToClipboard(
                        props.text,
                        uiLocalized.MessageCopiedToClipboard,
                    );
                }}
            >
                <View>
                    <Animated.View
                        style={[
                            styles.wrapMsgContainer,
                            { transform: [{ scale }] },
                        ]}
                    >
                        <View
                            style={[
                                UIStyle.padding.verticalSmall(),
                                UIStyle.padding.horizontalNormal(),
                                styles.msgContainer,
                                getBubbleStyle(props),
                                getRoundedCornerStyle(props, position),
                                props.status === ChatMessageStatus.Pending &&
                                    UIStyle.common.opacity70(),
                            ]}
                        >
                            {/* TODO: use hydrogen if it's possible */}
                            <UILabel
                                testID={createTestId(
                                    'chat_text_message%',
                                    props.text,
                                )}
                                role={UILabelRoles.ParagraphText}
                                color={getFontColor(props)}
                                style={styles.textCell}
                            >
                                <ParsedText
                                    parse={[
                                        {
                                            type: 'url',
                                            style: getUrlStyle(props.status),
                                            onPress: (
                                                url: string,
                                                index: number,
                                            ) =>
                                                props.onPressUrl &&
                                                props.onPressUrl(url, index),
                                        },
                                    ]}
                                >
                                    {props.text}
                                </ParsedText>
                            </UILabel>
                            <BubbleTime {...props} />
                        </View>
                    </Animated.View>
                    {actionString && (
                        <UILabel
                            style={styles.actionString}
                            role={UILabelRoles.ActionFootnote}
                            color={getActionStringColor(props)}
                        >
                            {actionString}
                        </UILabel>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    containerRight: {
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    containerLeft: {
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    textCell: {
        textAlign: 'left',
        maxWidth: '100%',
    },
    urlReceived: {
        color: ColorVariants.TextPrimary,
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    urlSent: {
        color: ColorVariants.TextSecondary,
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    timeTextContainer: {
        paddingLeft: UIConstant.smallContentOffset(),
        paddingTop: UIConstant.verticalContentOffset() / 2,
        marginLeft: 'auto', // Need for correct positioning to right side in message cell
    },
    timeText: {
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: UIColor.textQuaternary(),
    },
    wrapMsgContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    msgContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: UIConstant.borderRadius(),
    },
    rightBottomCorner: {
        borderBottomRightRadius: 0,
    },
    leftTopCorner: {
        borderTopLeftRadius: 0,
    },
    msgReceived: {
        alignItems: 'flex-start',
        backgroundColor: UIColor.backgroundTertiary(),
    },
    msgAborted: {
        alignItems: 'flex-start',
        backgroundColor: UIColor.error(),
    },
    msgSent: {
        alignItems: 'flex-end',
        backgroundColor: UIColor.primary(),
    },
    msgPending: {
        alignItems: 'flex-end',
        backgroundColor: UIColor.primary(),
    },
    actionString: {
        textAlign: 'right',
        paddingTop: UIConstant.tinyContentOffset(),
    },
});
