import * as React from "react";
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Platform,
    View,
    Text,
    Animated,
} from "react-native";
import ParsedText from "react-native-parsed-text";
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

const getBubbleContainer = (status: ChatMessageStatus) => {
    if (status === ChatMessageStatus.Received) {
        return styles.containerReceived;
    }
    return styles.container;
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

// For e2e tests, to create unique id as in those tests
// we don't know much about messages
const createUniqTestId = (pattern, variable) => pattern.replace("%", variable);

const createTestId = (pattern: string, text: string) => {
    return createUniqTestId(
        pattern,
        "_" + text.split(" ").slice(0, 2).join(" ")
    );
};

const BubbleTime = (props: ChatMessageMeta) => (
    <View style={styles.timeTextContainer}>
        <Text
            testID={createTestId("chat_text_message%_time", props.text)}
            style={[UIFont.tinyRegular(), styles.timeText]}
        >
            {formatTime(props.time || Date.now())}
        </Text>
    </View>
);

BubbleTime.displayName = "BubbleTime";

export const BubblePlainText = (props: PlainTextMessage) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const bubbleScaleAnimation = (scaleIn: boolean = false) => {
        Animated.spring(scale, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={[getBubbleContainer(props.status)]}>
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
                            UIStyle.padding.verticalSmall(),
                            UIStyle.padding.horizontalNormal(),
                            styles.msgContainer,
                            getBubbleStyle(props.status),
                            getRoundedCornerStyle(props),
                        ]}
                    >
                        <ParsedText
                            testID={createTestId(
                                "chat_text_message%",
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
    container: {
        paddingLeft: "20%",
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    containerReceived: {
        paddingRight: "20%",
        alignSelf: "flex-start",
        justifyContent: "flex-start",
    },
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
    timeTextContainer: {
        paddingLeft: UIConstant.smallContentOffset(),
        paddingTop: UIConstant.verticalContentOffset() / 2,
        marginLeft: "auto", // Need for correct positioning to right side in message cell
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
