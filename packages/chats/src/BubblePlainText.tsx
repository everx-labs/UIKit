import * as React from "react";
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Platform,
    View,
    Text,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import Animated from "react-native-reanimated";
import {
    UILocalized,
    UIColor,
    UIFont,
    formatTime,
    UIConstant,
    UIStyle,
} from "@uikit/core";
import { UIShareManager } from "@uikit/navigation";

import { ChatMessageStatus } from "./types";
import type { PlainTextMessage, ChatMessageMeta } from "./types";

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

const getRoundedCornerStyle = (options: ChatMessageMeta) => {
    if (options.status === ChatMessageStatus.Received) {
        return options.firstFromChain ? styles.leftTopCorner : null;
    }
    return options.lastFromChain ? styles.rightBottomCorner : null;
};

const getBubbleStyle = (status: ChatMessageStatus) => {
    if (status === ChatMessageStatus.Received) {
        return styles.msgReceived;
    } else if (status === ChatMessageStatus.Sent) {
        return styles.msgSent;
    } else if (status === ChatMessageStatus.Sending) {
        return styles.msgSending;
    } else if (status === ChatMessageStatus.Aborted) {
        return styles.msgAborted;
    }
    return styles.msgSending;
};

const BubbleTime = (props: ChatMessageMeta) => {
    // TODO: check what logic was there before
    const testID = "chat_text_message_time";

    const msgTime = formatTime(props.time || Date.now());

    return (
        <View>
            <Text
                testID={testID}
                style={[UIFont.tinyRegular(), styles.timeText]}
            >
                {msgTime}
            </Text>
        </View>
    );
};

BubbleTime.displayName = "BubbleTime";

export const BubblePlainText = (props: PlainTextMessage) => {
    let testID;

    if (props.text) {
        if (props.text.split(" ")[1]) {
            testID = `chat_text_message_${props.text.split(" ")[0]} ${
                props.text.split(" ")[1]
            }`;
        } else {
            testID = `chat_text_message_${props.text.split(" ")[0]}`;
        }
    } else {
        testID = "chat_text_message";
    }

    const scale = React.useRef(new Animated.Value(1));
    const bubbleScaleAnimation = (scaleIn: boolean = false) => {
        Animated.spring(scale, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View>
            <TouchableWithoutFeedback
                onPressOut={() => bubbleScaleAnimation()}
                onPress={props.onTouchText}
                onLongPress={() => {
                    bubbleScaleAnimation(true);
                    UIShareManager.copyToClipboard(
                        props.text,
                        UILocalized.MessageCopiedToClipboard
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
                            styles.msgContainer,
                            getBubbleStyle(props.status),
                            getRoundedCornerStyle(props),
                        ]}
                    >
                        <ParsedText
                            testID={testID}
                            key={`chat_text_key_${props.key}`}
                            style={[
                                getFontColor(props.status),
                                UIFont.smallRegular(),
                                styles.textCell,
                            ]}
                            parse={[
                                {
                                    type: "url",
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
            </TouchableWithoutFeedback>
        </View>
    );
};

BubblePlainText.diaplyName = "BubblePlainText";

const styles = StyleSheet.create({
    textCell: {
        textAlign: "left",
        maxWidth: "100%",
    },
    urlReceived: {
        color: UIColor.primary(),
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === "android" ? "none" : "underline",
    },
    urlSent: {
        color: UIColor.fa(),
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === "android" ? "none" : "underline",
    },
    timeText: {
        textAlign: "right",
        alignSelf: "flex-end",
        color: UIColor.textQuaternary(),
    },
    wrapMsgContainer: {
        flexShrink: 1,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    msgContainer: {
        flexShrink: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        borderRadius: UIConstant.borderRadius(),
        paddingRight: "20%",
    },
    rightBottomCorner: {
        borderBottomRightRadius: 0,
    },
    leftTopCorner: {
        borderTopLeftRadius: 0,
    },
    msgSending: {
        alignItems: "flex-end",
        backgroundColor: UIColor.backgroundQuinary(),
    },
    msgReceived: {
        alignItems: "flex-start",
        backgroundColor: UIColor.backgroundTertiary(),
    },
    msgAborted: {
        alignItems: "flex-start",
        backgroundColor: UIColor.error(),
    },
    msgSent: {
        alignItems: "flex-end",
        backgroundColor: UIColor.primary(),
    },
});
