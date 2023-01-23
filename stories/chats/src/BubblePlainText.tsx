import * as React from 'react';
import { StyleSheet, Platform, View, TextStyle, I18nManager } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { runOnUI } from 'react-native-reanimated';

import { uiLocalized } from '@tonlabs/localization';
import { UIPressableArea, hapticImpact } from '@tonlabs/uikit.controls';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { MessageStatus, RegExpConstants } from './constants';
import type { OnLongPressText, OnPressUrl, ChatPlainTextMessage, PlainTextMessage } from './types';
import { useBubblePosition, useBubbleContainerStyle } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';

const renderParsedText = (matchingString: string) => {
    return matchingString.replace(RegExpConstants.protocol, '');
};

const useUrlStyle = (status: MessageStatus) => {
    const theme = useTheme();

    if (status === MessageStatus.Received) {
        return [{ color: theme[ColorVariants.TextPrimary] }, styles.urlReceived];
    }

    return [{ color: theme[ColorVariants.StaticTextPrimaryLight] }, styles.urlSent];
};

export const UrlPressHandlerContext = React.createContext<OnPressUrl>(undefined);

export const TextLongPressHandlerContext = React.createContext<OnLongPressText>(undefined);

function useUrlPressHandler() {
    return React.useContext(UrlPressHandlerContext);
}

function useTextLongPressHandler() {
    return React.useContext(TextLongPressHandlerContext);
}

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
const createUniqTestId = (pattern: string, variable: string) => pattern.replace('%', variable);

const createTestId = (pattern: string, text: string) => {
    return createUniqTestId(pattern, `_${text.split(' ').slice(0, 2).join(' ')}`);
};

function BubbleTime(
    props: ChatPlainTextMessage & {
        style?: TextStyle;
        formattedTime: string;
        isHidden?: boolean;
    },
) {
    const { isHidden, style, formattedTime, text } = props;
    return (
        <UILabel
            testID={createTestId('chat_text_message%_time', text)}
            role={UILabelRoles.NarrowParagraphFootnote}
            color={isHidden ? UILabelColors.Transparent : getTimeFontColor(props)}
            style={style}
        >
            {/* Use spaces instead of margins
             *  since they're not working for nested text
             *  \u00A0 is https://en.wikipedia.org/wiki/Non-breaking_space
             */}
            {`\u00A0\u00A0${formattedTime}`}
        </UILabel>
    );
}

function PlainTextContainer(props: PlainTextMessage & { children: React.ReactNode }) {
    const { status, text, onLayout, onTouchText, children } = props;
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(props);
    const bubbleBackgroundColor = useBubbleBackgroundColor(props);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(props, position);
    const actionString = getActionString(props);

    const textLongPressHandler = useTextLongPressHandler();

    const longPressHandle = React.useCallback(() => {
        text && textLongPressHandler && textLongPressHandler(text);
        /**
         * Maybe it's not the best place to run haptic
         * but I don't want to put it in legacy package
         * so left it here, until we make new share manager
         */
        runOnUI(hapticImpact)('medium');
    }, [text, textLongPressHandler]);

    return (
        <View style={containerStyle} onLayout={onLayout}>
            <UIPressableArea
                onPress={onTouchText}
                onLongPress={longPressHandle}
                scaleParameters={{ hovered: 1 }}
            >
                <View>
                    <View
                        style={[
                            {
                                paddingVertical: UILayoutConstant.contentInsetVerticalX2,
                                paddingHorizontal: UILayoutConstant.normalContentOffset,
                            },
                            styles.msgContainer,
                            isRTL ? styles.msgContainerRTL : null,
                            bubbleBackgroundColor,
                            roundedCornerStyle,
                        ]}
                    >
                        {children}
                    </View>
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
            </UIPressableArea>
        </View>
    );
}

export function BubbleChatPlainText(props: ChatPlainTextMessage) {
    const { status, time, text } = props;
    const urlStyle = useUrlStyle(status);
    const formattedTime = React.useMemo(() => uiLocalized.formatTime(time || Date.now()), [time]);

    const urlPressHandler = useUrlPressHandler();

    return (
        <PlainTextContainer {...props}>
            <UILabel
                testID={createTestId('chat_text_message%', text)}
                role={UILabelRoles.ParagraphText}
                color={getFontColor(props)}
            >
                <ParsedText
                    parse={[
                        {
                            /**
                             * We need to use our RegExp because we must also
                             * identify links with cyrillic.
                             * The library doesn't do this.
                             * */
                            pattern: RegExpConstants.url,
                            style: urlStyle,
                            onPress: urlPressHandler,
                            renderText: renderParsedText,
                        },
                    ]}
                >
                    {text}
                </ParsedText>
            </UILabel>
            <BubbleTime {...props} formattedTime={formattedTime} />
        </PlainTextContainer>
    );
}

export function BubbleSimplePlainText(props: PlainTextMessage) {
    const { status, text } = props;
    const urlStyle = useUrlStyle(status);
    const urlPressHandler = useUrlPressHandler();

    return (
        <PlainTextContainer {...props}>
            <UILabel
                testID={createTestId('chat_text_message%', text)}
                role={UILabelRoles.ParagraphText}
                color={getFontColor(props)}
            >
                <ParsedText
                    parse={[
                        {
                            pattern: RegExpConstants.url,
                            style: urlStyle,
                            onPress: urlPressHandler,
                            renderText: renderParsedText,
                        },
                    ]}
                >
                    {text}
                </ParsedText>
            </UILabel>
        </PlainTextContainer>
    );
}

const styles = StyleSheet.create({
    urlReceived: {
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    urlSent: {
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    msgContainer: {
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    msgContainerRTL: {
        flexDirection: 'row-reverse',
    },
    actionString: {
        textAlign: 'right',
        paddingTop: UILayoutConstant.contentInsetVerticalX1,
    },
});
