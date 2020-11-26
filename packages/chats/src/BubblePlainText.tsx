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

import { ChatMessageMeta, ChatMessageStatus } from './types';
import type { PlainTextMessage } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

const getUrlStyle = (status: ChatMessageStatus) =>
    status === ChatMessageStatus.Received ? styles.urlReceived : styles.urlSent;

const getFontColor = (status: ChatMessageStatus) =>
    status === ChatMessageStatus.Received
        ? UIStyle.Color.getColorStyle(
              UIColor.textSecondary(UIColor.Theme.Light)
          )
        : UIStyle.Color.getColorStyle(
              UIColor.textSecondary(UIColor.Theme.Dark)
          );

const getRoundedCornerStyle = (
    options: ChatMessageMeta,
    position: BubblePosition
) => {
    if (position === BubblePosition.left && options.firstFromChain) {
        return styles.leftTopCorner;
    } else if (position === BubblePosition.right && options.lastFromChain) {
        return styles.rightBottomCorner;
    }
    return null;
};

const getBubbleContainer = (position: BubblePosition) => {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    } else if (position === BubblePosition.right) {
        return styles.containerRight;
    }
    return null;
};

const getBubbleStyle = (message: PlainTextMessage) => {
    if (message.status === ChatMessageStatus.Received) {
        return styles.msgReceived;
    } else if (message.status === ChatMessageStatus.Sent) {
        return styles.msgSent;
    } else if (message.status === ChatMessageStatus.Pending) {
        return styles.msgSending;
    } else if (message.isAborted) {
        return styles.msgAborted;
    }
    return styles.msgSending;
};

// For e2e tests, to create unique id as in those tests
// we don't know much about messages
const createUniqTestId = (pattern: string, variable: string) =>
    pattern.replace('%', variable);

const createTestId = (pattern: string, text: string) => {
    return createUniqTestId(
        pattern,
        '_' + text.split(' ').slice(0, 2).join(' ')
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
    const bubbleScaleAnimation = (scaleIn: boolean = false) => {
        Animated.spring(scale, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };
    const position = useBubblePosition(props.status);

    return (
        <View style={[getBubbleContainer(position)]}>
            <TouchableWithoutFeedback
                onPressOut={() => bubbleScaleAnimation()}
                onPress={props.onTouchText}
                onLongPress={() => {
                    bubbleScaleAnimation(true);
                    UIShareManager.copyToClipboard(
                        props.text,
                        uiLocalized.MessageCopiedToClipboard
                    );
                }}
            >
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
                        ]}
                    >
                        <ParsedText
                            testID={createTestId(
                                'chat_text_message%',
                                props.text
                            )}
                            key={`chat_text_key_${props.key}`}
                            style={[
                                getFontColor(props.status),
                                UIFont.smallRegular(),
                                styles.textCell,
                            ]}
                            parse={[
                                {
                                    type: 'url',
                                    style: getUrlStyle(props.status),
                                    onPress: (url: string, index: number) =>
                                        props.onPressUrl &&
                                        props.onPressUrl(url, index),
                                },
                            ]}
                        >
                            {props.text}
                        </ParsedText>
                        <BubbleTime {...props} />
                    </View>
                </Animated.View>
                {/* TODO: action string */}
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
        color: UIColor.primary(),
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    urlSent: {
        color: UIColor.fa(),
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
    msgSending: {
        alignItems: 'flex-end',
        backgroundColor: UIColor.backgroundQuinary(),
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
});
