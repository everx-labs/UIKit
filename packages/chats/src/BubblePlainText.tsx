import * as React from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Platform,
    View,
    Animated,
    Text,
    TextStyle,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIShareManager } from '@tonlabs/uikit.navigation';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.hydrogen';

import { ChatMessageMeta, ChatMessageStatus } from './types';
import type { PlainTextMessage } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

const useUrlStyle = (status: ChatMessageStatus) => {
    const theme = useTheme();

    if (status === ChatMessageStatus.Received) {
        return [
            { color: theme[ColorVariants.TextPrimary] },
            styles.urlReceived,
        ];
    }

    return [{ color: theme[ColorVariants.TextSecondary] }, styles.urlSent];
};

const getFontColor = (message: PlainTextMessage) => {
    if (message.status === ChatMessageStatus.Aborted) {
        return UILabelColors.TextPrimaryInverted; // TODO: is it right color?
    }

    if (message.status === ChatMessageStatus.Received) {
        return UILabelColors.TextPrimary;
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

const useBubbleStyle = (message: PlainTextMessage) => {
    const theme = useTheme();

    if (message.status === ChatMessageStatus.Aborted) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundNegative],
            ),
        ];
    }

    if (message.status === ChatMessageStatus.Received) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundTertiary],
            ),
        ];
    }

    if (message.status === ChatMessageStatus.Sent) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundAccent],
            ),
        ];
    }

    if (message.status === ChatMessageStatus.Pending) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundAccent],
            ),
            UIStyle.common.opacity70(),
        ];
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

function BubbleTime(
    props: PlainTextMessage & { style?: TextStyle; formattedTime: string },
) {
    return (
        <UILabel
            testID={createTestId('chat_text_message%_time', props.text)}
            role={UILabelRoles.ParagraphFootnote}
            color={getFontColor(props)}
            style={props.style}
        >
            {/* Use spaces instead of margins */}
            {`  ${props.formattedTime}`}
        </UILabel>
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
    const bubbleStyle = useBubbleStyle(props);
    const urlStyle = useUrlStyle(props.status);
    const actionString = getActionString(props);
    const formattedTime = React.useMemo(
        () => uiLocalized.formatTime(props.time || Date.now()),
        [props.time],
    );

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
                            UIStyle.padding.verticalSmall(),
                            UIStyle.padding.horizontalNormal(),
                            styles.msgContainer,
                            bubbleStyle,
                            getRoundedCornerStyle(props, position),
                            { transform: [{ scale }] },
                        ]}
                    >
                        {/* <Text> here is to use BubbleTime with a message text as a single string */}
                        <Text>
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
                                            style: urlStyle,
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
                            <BubbleTime
                                {...props}
                                style={styles.timeHidden}
                                formattedTime={formattedTime}
                            />
                        </Text>
                        <BubbleTime
                            {...props}
                            style={styles.timeFloating}
                            formattedTime={formattedTime}
                        />
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
        maxWidth: '100%',
    },
    containerLeft: {
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        maxWidth: '100%',
    },
    textCell: {
        textAlign: 'left',
    },
    urlReceived: {
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    urlSent: {
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    timeHidden: {
        opacity: 0,
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
        }),
    },
    timeFloating: {
        position: 'absolute',
        // 2.5 is a magical number to kinda align time with a main text baseline
        bottom: UIConstant.smallContentOffset() + 2.5,
        right: UIConstant.normalContentOffset(),
    },
    msgContainer: {
        position: 'relative',
        borderRadius: UIConstant.borderRadius(),
    },
    rightBottomCorner: {
        borderBottomRightRadius: 0,
    },
    leftTopCorner: {
        borderTopLeftRadius: 0,
    },
    actionString: {
        textAlign: 'right',
        paddingTop: UIConstant.tinyContentOffset(),
    },
});
