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
import { runOnUI } from 'react-native-reanimated';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIShareManager } from '@tonlabs/uikit.navigation_legacy';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
    hapticImpact,
} from '@tonlabs/uikit.hydrogen';

import { MessageStatus } from './types';
import type { ChatPlainTextMessage, PlainTextMessage } from './types';
import {
    useBubblePosition,
    BubblePosition,
    useBubbleContainerStyle,
} from './useBubblePosition';

const useUrlStyle = (status: MessageStatus) => {
    const theme = useTheme();

    if (status === MessageStatus.Received) {
        return [
            { color: theme[ColorVariants.TextPrimary] },
            styles.urlReceived,
        ];
    }

    return [{ color: theme[ColorVariants.StaticTextPrimaryLight] }, styles.urlSent];
};

const getFontColor = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return UILabelColors.StaticTextPrimaryLight;
    }

    if (message.status === MessageStatus.Received) {
        return UILabelColors.TextPrimary;
    }

    return UILabelColors.StaticTextPrimaryLight;
};

const getTimeFontColor = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return UILabelColors.StaticTextOverlayLight;
    }

    if (message.status === MessageStatus.Received) {
        return UILabelColors.TextOverlay;
    }

    return UILabelColors.StaticTextOverlayLight;
};

const getRoundedCornerStyle = (
    options: PlainTextMessage,
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

const useBubbleStyle = (message: PlainTextMessage) => {
    const theme = useTheme();

    if (message.status === MessageStatus.Aborted) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundNegative],
            ),
        ];
    }

    if (message.status === MessageStatus.Received) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundSecondary],
            ),
        ];
    }

    if (message.status === MessageStatus.Sent) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundAccent],
            ),
        ];
    }

    if (message.status === MessageStatus.Pending) {
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
    if (message.status === MessageStatus.Aborted) {
        return message.actionText || uiLocalized.Chats.Bubbles.TapToSendAgain;
    }

    return message.actionText;
};

const getActionStringColor = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
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
    props: ChatPlainTextMessage & {
        style?: TextStyle;
        formattedTime: string;
        isHidden?: boolean;
    },
) {
    return (
        <UILabel
            role={UILabelRoles.ParagraphFootnote}
            color={
                props.isHidden
                    ? UILabelColors.Transparent
                    : getTimeFontColor(props)
            }
            style={props.style}
        >
            {/* Use spaces instead of margins
             *  since they're not working for nested text
             *  \u00A0 is https://en.wikipedia.org/wiki/Non-breaking_space
             */}
            {`\u00A0\u00A0${props.formattedTime}`}
        </UILabel>
    );
}

function PlainTextContainer(
    props: PlainTextMessage & { children: React.ReactNode },
) {
    const scale = React.useRef(new Animated.Value(1)).current;
    const bubbleScaleAnimation = (scaleIn = false) => {
        Animated.spring(scale, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };
    const position = useBubblePosition(props.status);
    const containerStyle = useBubbleContainerStyle(props);
    const bubbleStyle = useBubbleStyle(props);
    const actionString = getActionString(props);

    return (
        <View style={containerStyle} onLayout={props.onLayout}>
            <TouchableWithoutFeedback
                onPressOut={() => bubbleScaleAnimation()}
                onPress={props.onTouchText}
                onLongPress={() => {
                    bubbleScaleAnimation(true);
                    /**
                     * Maybe it's not the best place to run haptic
                     * but I don't want to put it in legacy package
                     * so left it here, until we make new share manager
                     */
                    runOnUI(hapticImpact)('medium');
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
                        {props.children}
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

export function BubbleChatPlainText(props: ChatPlainTextMessage) {
    const urlStyle = useUrlStyle(props.status);
    const formattedTime = React.useMemo(
        () => uiLocalized.formatTime(props.time || Date.now()),
        [props.time],
    );

    return (
        <PlainTextContainer {...props}>
            <UILabel
                testID={createTestId('chat_text_message%', props.text)}
                role={UILabelRoles.ParagraphText}
                color={getFontColor(props)}
                style={styles.textCell}
            >
                <ParsedText
                    parse={[
                        {
                            type: 'url',
                            style: urlStyle,
                            onPress: (url: string, index: number) =>
                                props.onPressUrl &&
                                props.onPressUrl(url, index),
                        },
                    ]}
                >
                    {props.text}
                </ParsedText>
                <BubbleTime
                    {...props}
                    isHidden
                    style={styles.timeHidden}
                    formattedTime={formattedTime}
                />
            </UILabel>
            {/* The idea is to always draw time in a corner
             * but it should be kinda wrapped by a main text.
             * In order to achive it we draw it two times.
             * First time we draw it with a main text of a message
             * but at the same time make it invisible, this allow us
             * to have a proper padding for the last line.
             * That padding is needed for a time that we draw second time,
             * except this time we place it with `position: absolute` in a corner.
             */}
            <Text
                testID={createTestId('chat_text_message%_time', props.text)}
                style={styles.timeFloating}
            >
                <BubbleTime {...props} formattedTime={formattedTime} />
            </Text>
        </PlainTextContainer>
    );
}

export function BubbleSimplePlainText(props: PlainTextMessage) {
    const urlStyle = useUrlStyle(props.status);

    return (
        <PlainTextContainer {...props}>
            <UILabel
                testID={createTestId('chat_text_message%', props.text)}
                role={UILabelRoles.ParagraphText}
                color={getFontColor(props)}
                style={styles.textCell}
            >
                <ParsedText
                    parse={[
                        {
                            type: 'url',
                            style: urlStyle,
                            onPress: (url: string, index: number) =>
                                props.onPressUrl &&
                                props.onPressUrl(url, index),
                        },
                    ]}
                >
                    {props.text}
                </ParsedText>
            </UILabel>
        </PlainTextContainer>
    );
}

const styles = StyleSheet.create({
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
        // Beside we set transparent color
        // (that needed mostly for Android)
        // we need opacity for web
        opacity: 0,
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
        }),
    },
    timeFloating: {
        position: 'absolute',
        lineHeight: Platform.select({
            web: 24,
            // Less then ParagraphText by 2, for some reason it works better
            default: 22,
        }),
        bottom: UIConstant.smallContentOffset(),
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
