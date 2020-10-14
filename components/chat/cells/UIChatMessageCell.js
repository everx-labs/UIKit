// @flow
import React from 'react';
import {
    Animated,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import isEqual from 'lodash/isEqual';

import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UILocalized, { formatTime } from '../../../helpers/UILocalized';
import UILabel from '../../text/UILabel';

import UIShareManager from '../../../helpers/UIShareManager';

import UIChatImageCell from './UIChatImageCell';
import UIChatStickerCell from './UIChatStickerCell';
import UIChatDocumentCell from './UIChatDocumentCell';
import UIChatTransactionCell from './UIChatTransactionCell';
import UIChatActionCell from './UIChatActionCell';

import {
    ChatMessageContent,
    ChatMessageStatus,
    TypeOfAction,
    TypeOfActionDirection,
} from '../extras';

import type {
    ChatMessageContentType,
    ChatMessageStatusType,
    ChatAdditionalInfo,
    TypeOfActionDirectionType,
} from '../extras';
import UIAssets from '../../../assets/UIAssets';

type Props = {
    type?: ChatMessageContentType,
    status?: ChatMessageStatusType,
    isReceived: boolean,
    data?: any,
    additionalInfo?: ChatAdditionalInfo,
    messageDetails?: string,
    messageDetailsStyle?: ViewStyleProp | ViewStyleProp[],

    onTouchMedia?: (objectToReturn: any) => void,
    onOpenPDF?: (docData: any, docName: string) => void,
    onPressUrl?: (url: string) => void,
    onTouchTransaction?: (trx: any) => void,
    onTouchAction?: (action: any) => void,
    onTouchText?: () => void,
    onLayout?: (e: any) => void,
}

type State = {
    // empty
}

type RenderOptions = {
    isSticker?: boolean,
    isImage?: boolean,
}

export default class UIChatMessageCell extends UIComponent<Props, State> {
    static defaultProps = {
        type: ChatMessageContent.EmptyChat,
        status: ChatMessageStatus.Received,
        isReceived: false,
        data: null,
        additionalInfo: { message: null, lastFromChain: true },

        onTouchMedia: () => {},
        onOpenPDF: () => {},
        onTouchTransaction: () => {},
        onTouchAction: () => {},
        onTouchText: () => {},
    };

    shouldComponentUpdate(nextProps: Props): boolean {
        return !isEqual(this.props.data, nextProps.data)
            || this.props.status !== nextProps.status
            || !isEqual(this.props.additionalInfo !== nextProps.additionalInfo);
    }

    animatedBubble = new Animated.Value(1);
    bubbleScaleAnimation(scaleIn: boolean = false) {
        Animated.spring(this.animatedBubble, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }

    // eslint-disable-next-line no-unused-vars
    onPressUrl(url: string, matchIndex: number = 0) {
        const { onPressUrl } = this.props;
        if (onPressUrl) {
            onPressUrl(url);
        }
    }

    onTransactionPress = () => {
        const { additionalInfo, onTouchTransaction } = this.props;
        const message = additionalInfo?.message;
        if (message && onTouchTransaction) {
            onTouchTransaction(message?.info.trx);
        }
    };

    onActionPress = () => {
        const { additionalInfo, onTouchAction } = this.props;
        const actionType = additionalInfo?.actionType;

        if (actionType === TypeOfAction.Link) {
            this.onPressUrl(additionalInfo?.link || '');
            return;
        }

        if (onTouchAction) {
            onTouchAction();
        }
    };

    getActionDirection(): TypeOfActionDirectionType {
        return this.props.additionalInfo?.message?.info?.direction || TypeOfActionDirection.None;
    }

    getFontColor(): TextStyleProp {
        return this.isReceived
            ? UIStyle.Color.getColorStyle(UIColor.textSecondary(UIColor.Theme.Light))
            : UIStyle.Color.getColorStyle(UIColor.textSecondary(UIColor.Theme.Dark));
    }

    getStatus(): string {
        const { status } = this.props;
        return status || ChatMessageStatus.Received;
    }

    get isReceived(): boolean {
        return this.props.isReceived;
    }

    getRoundedCornerStyle(): ViewStyleProp | ViewStyleProp[] {
        const { additionalInfo } = this.props;
        if (this.isReceived) {
            return additionalInfo?.firstFromChain ? styles.leftTopCorner : null;
        }

        return additionalInfo?.lastFromChain ? styles.rightBottomCorner : null;
    }

    formattedTime(date: ?Date): string {
        const msg = this.props.additionalInfo?.message;
        if (msg?.info.sending) {
            return UILocalized.message.sending;
        }

        if (date) {
            return formatTime(date.valueOf());
        }

        return formatTime(msg?.info.created || Date.now());
    }

    wrapInMessageContainer(
        children: React$Element<any>,
        options: RenderOptions = {},
    ): React$Element<any> {
        const { isSticker, isImage } = options;

        const sticker = isSticker ? styles.stickerCell : null;
        const userName = isSticker ? null : this.renderName();

        const rounded = this.getRoundedCornerStyle();

        let style = styles.msgSending;
        if (this.getStatus() === ChatMessageStatus.Received) {
            style = styles.msgReceived;
        } else if (this.getStatus() === ChatMessageStatus.Sent) {
            style = styles.msgSent;
        } else if (this.getStatus() === ChatMessageStatus.Sending) {
            style = styles.msgSending;
        } else if (this.getStatus() === ChatMessageStatus.Aborted) {
            style = styles.msgAborted;
        }

        const animation = { transform: [{ scale: this.animatedBubble }] };
        const isText = this.props.type === ChatMessageContent.SimpleText;

        return (
            <Animated.View
                style={[
                    styles.wrapMsgContainer,
                    animation,
                ]}
            >
                {this.renderAvatar()}
                <View
                    style={[
                        !isImage && UIStyle.padding.verticalSmall(),
                        !isImage && UIStyle.padding.horizontalNormal(),
                        styles.msgContainer,
                        !isText && UIStyle.common.flexColumn(),
                        style,
                        rounded,
                        sticker,
                    ]}
                >
                    {userName}
                    {children}
                    {this.renderTime(options)}
                </View>
            </Animated.View>
        );
    }

    wrapInTouch(wrap: React$Element<*>, objectToReturn: any): React$Element<*> {
        return (
            <TouchableHighlight
                style={UIStyle.Common.flex()}
                onPress={() => {
                    if (this.props.onTouchMedia) {
                        this.props.onTouchMedia(objectToReturn);
                    }
                }}
                key={`touchWrap_${wrap.key || ''}`}
            >
                <View>
                    {wrap}
                </View>
            </TouchableHighlight>
        );
    }

    renderAvatar() {
        return null; // TODO:
    }

    renderName() {
        return null; // TODO:
    }

    renderTime(options: RenderOptions = {}) {
        // Calculate the testID prop
        let testID;
        const { data } = this.props;
        const { isImage, isSticker } = options;

        if (data instanceof String || typeof data === 'string') {
            if (data.split(' ')[1]) {
                testID = `chat_text_message_${data.split(' ')[0]} ${data.split(' ')[1]}_time`;
            } else {
                testID = `chat_text_message_${data.split(' ')[0]}_time`;
            }
        } else {
            testID = 'chat_text_message_time';
        }

        // Get the formatted message time
        const msgTime = this.formattedTime();
        const bgSticker = { backgroundColor: UIColor.backgroundWhiteLight() };
        return (
            <View
                style={[
                    (isImage || isSticker) && styles.absoluteDate,
                    (isImage || isSticker) && styles.dateWithBackground,
                    !isImage && !isSticker && styles.timeTextContainer,
                    isSticker && bgSticker,
                ]}
            >
                <Text
                    testID={testID}
                    style={[
                        UIFont.tinyRegular(), styles.timeText,
                        isImage && UIColor.getColorStyle(UIColor.white()),
                        isSticker && UIColor.getColorStyle(UIColor.black()),
                    ]}
                >
                    {msgTime}
                </Text>
            </View>
        );
    }

    renderDateSeparator() {
        const { data } = this.props;
        return (
            <View style={styles.dateSeparator}>
                <UILabel
                    role={UILabel.Role.TinyRegular}
                    style={UIStyle.color.getColorStyle(UIColor.textTertiary())}
                    text={data}
                />
            </View>
        );
    }

    renderSystemInfo() {
        const { additionalInfo } = this.props;
        return (
            <View style={styles.systemInfo}>
                <Text style={[UIFont.tinyRegular(), styles.sysText]}>
                    {additionalInfo?.message?.info?.text || ''}
                </Text>
            </View>
        );
    }

    renderActionLabel() {
        const { additionalInfo } = this.props;
        const rounded = this.isReceived
            ? styles.leftTopCorner
            : styles.rightBottomCorner;
        return (
            <View style={[
                styles.msgContainer,
                UIStyle.padding.verticalSmall(),
                UIStyle.padding.horizontalNormal(),
                rounded,
                styles.actionLabel,
            ]}
            >
                <Text style={styles.actionLabelText}>
                    {additionalInfo?.message?.info?.text || ''}
                </Text>
            </View>
        );
    }

    renderImageCell() {
        const { data, additionalInfo } = this.props;
        if (!data) {
            return null;
        }

        return (
            this.wrapInMessageContainer(
                <UIChatImageCell
                    image={data}
                    additionalInfo={additionalInfo}
                    style={this.getRoundedCornerStyle()}
                />,
                { isImage: true },
            )
        );
    }

    renderStickerCell() {
        const { data, additionalInfo } = this.props;
        if (!data) {
            return null;
        }

        return (
            this.wrapInMessageContainer(
                <UIChatStickerCell
                    sticker={data}
                    additionalInfo={additionalInfo}
                />,
                { isSticker: true },
            )
        );
    }

    renderDocumentCell() {
        const { data, onOpenPDF, additionalInfo } = this.props;

        if (!data) {
            return null;
        }

        return (
            this.wrapInMessageContainer(<UIChatDocumentCell
                document={data}
                additionalInfo={additionalInfo}
                isReceived={this.isReceived}
                onOpenPDF={(docData, docName) => {
                    if (onOpenPDF) {
                        onOpenPDF(docData, docName);
                    }
                }}
            />)
        );
    }

    renderInformationCell(text: string) {
        return (
            <View style={[styles.msgContainerInformation]}>
                <Text
                    testID="chat_information"
                    style={[
                        UIStyle.Color.getColorStyle(UIColor.white()),
                        UIFont.menuRegular(),
                    ]}
                >
                    [{this.formattedTime()}] {text}
                </Text>
            </View>
        );
    }

    renderEmptyChatCell() {
        return (
            <View style={[styles.container, styles.emptyChatCell]}>
                <View style={styles.msgContainerEmpty}>
                    <Text
                        testID="empty_chat_message"
                        style={[
                            UIFont.bodyMedium(),
                            UIStyle.Color.getColorStyle(UIColor.textPrimary()),
                        ]}
                    >
                        {UILocalized.SayHello}
                    </Text>
                </View>
            </View>
        );
    }

    getTransactionHandler() {
        return this.props.onTouchTransaction ? this.onTransactionPress : undefined;
    }

    renderTransactionCell() {
        const {
            additionalInfo, data, status, isReceived,
        } = this.props;

        return (
            <UIChatTransactionCell
                message={data}
                status={status}
                isReceived={isReceived}
                additionalInfo={additionalInfo}
                onPress={this.getTransactionHandler()}
            />
        );
    }

    renderTransactionCommentCell() {
        const { additionalInfo } = this.props;
        const rounded = this.isReceived
            ? null
            : styles.rightTopCorner;
        let background = this.isReceived
            ? styles.greenBubble
            : styles.blackBubble;

        if (additionalInfo?.message.info.aborted) { // TODO: make it better in terms of structuring!
            background = styles.msgAborted;
        }

        return (
            <TouchableOpacity
                style={[
                    styles.msgContainer,
                    UIStyle.padding.verticalSmall(),
                    UIStyle.padding.horizontalNormal(),
                    rounded,
                    background,
                ]}
                onPress={this.getTransactionHandler()}
            >
                <Text
                    testID={`transaction_comment_${additionalInfo?.message.info.text || ''}`}
                    style={[styles.actionLabelText, UIFont.smallRegularHigh(), styles.textCell]}
                >
                    {additionalInfo?.message.info.text || ''}
                </Text>
                {additionalInfo?.message.info.encrypted && (
                    <View style={styles.keyThin}>
                        <Image source={UIAssets.keyThin} />
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    renderLinkActionMessageCell() {
        const { isReceived, additionalInfo } = this.props;
        const style = isReceived ? styles.linkActionMessageContainer : null;

        return (
            <View style={style}>
                {this.renderTextCell()}
                {isReceived && !additionalInfo?.processed && (
                    <View style={styles.verticalSeparator}>
                        {this.renderActionCell()}
                    </View>
                )}
            </View>
        );
    }

    renderActionCell(actionDirection: TypeOfActionDirectionType = TypeOfActionDirection.None) {
        const { additionalInfo, data } = this.props;
        const actionType = additionalInfo?.actionType;

        if (!actionType) {
            return null;
        }

        return (
            <UIChatActionCell
                testID={data ? `action_cell_${data}` : 'action_cell'}
                text={additionalInfo?.linkTitle || data}
                onPress={this.onActionPress}
                typeOfAction={actionType}
                actionDirection={actionDirection}
            />
        );
    }

    renderSystemCell() {
        const { data } = this.props;

        return (
            <UILabel
                role={UILabel.Role.TinyRegular}
                text={data}
                style={UIStyle.color.textTertiary()}
                numberOfLines={1}
                ellipsizeMode="middle"
            />
        );
    }

    renderTextCell() {
        const { data } = this.props;
        return (
            <TouchableWithoutFeedback
                onPressOut={() => this.bubbleScaleAnimation()}
                onPress={this.props.onTouchText}
                onLongPress={() => {
                    if (data && (data instanceof String || typeof data === 'string')) {
                        this.bubbleScaleAnimation(true);
                        UIShareManager.copyToClipboard(data, UILocalized.MessageCopiedToClipboard);
                    }
                }}
            >
                {this.wrapInMessageContainer(this.renderText(data || ''))}
            </TouchableWithoutFeedback>
        );
    }

    renderText(text: string) {
        const urlStyle = this.isReceived ? styles.urlReceived : styles.urlSent;
        let testID;

        if (text) {
            if (text.split(' ')[1]) {
                testID = `chat_text_message_${text.split(' ')[0]} ${text.split(' ')[1]}`;
            } else {
                testID = `chat_text_message_${text.split(' ')[0]}`;
            }
        } else {
            testID = 'chat_text_message';
        }

        return (
            <ParsedText
                testID={testID}
                style={[this.getFontColor(), UIFont.smallRegular(), styles.textCell]}
                parse={[{ type: 'url', style: urlStyle, onPress: (url, index) => this.onPressUrl(url, index) }]}
                key={`text${Math.trunc(Math.random() * 10000).toString()}`}
            >
                {text}
            </ParsedText>
        );
    }

    render() {
        const {
            type, additionalInfo, data, messageDetails, messageDetailsStyle,
        } = this.props;

        const { firstFromChain, lastFromChain } = additionalInfo || {};

        let cell = null;
        let testID = '';

        let padding = {
            paddingTop: UIConstant.smallContentOffset(),
            paddingBottom: lastFromChain ? 0 : UIConstant.smallContentOffset(),
        };

        let align = this.isReceived ? 'flex-start' : 'flex-end';

        if (type === ChatMessageContent.DateSeparator) {
            align = 'center';
            cell = this.renderDateSeparator();
            padding = {
                paddingTop: UIConstant.contentOffset(),
                paddingBottom: UIConstant.contentOffset(),
            };
        } else if (type === ChatMessageContent.SystemInfo) {
            align = 'center';
            cell = this.renderSystemInfo();
        } else if (type === ChatMessageContent.ActionLabel) {
            cell = this.renderActionLabel();
        } else if (type === ChatMessageContent.EmptyChat) {
            align = 'flex-start';
            cell = this.renderEmptyChatCell();
        } else if (type === ChatMessageContent.TransactionInChat) {
            cell = this.renderTransactionCell();
            testID = `chat_message_${data?.info?.trx?.amount || 'trx'}`;

            if (!lastFromChain) {
                padding = {
                    paddingTop: UIConstant.smallContentOffset(),
                    paddingBottom: UIConstant.tinyContentOffset(),
                };
            }
        } else if (type === ChatMessageContent.TransactionComment) {
            cell = this.renderTransactionCommentCell();

            padding = {
                paddingTop: 0, // to move comment closer to the parent transaction bubble
                paddingBottom: UIConstant.smallContentOffset(),
            };
        } else if (type === ChatMessageContent.SimpleText) {
            cell = this.renderTextCell();

            padding = {
                paddingTop: firstFromChain ? UIConstant.smallContentOffset() : 0,
                paddingBottom: lastFromChain ? 0 : UIConstant.tinyContentOffset(),
            };
        } else if (type === ChatMessageContent.System || type === ChatMessageContent.Invite) {
            align = 'center';
            cell = this.renderSystemCell();

            if (firstFromChain) {
                padding = {
                    paddingTop: UIConstant.contentOffset(),
                    paddingBottom: UIConstant.smallContentOffset(),
                };
            } else {
                padding = {
                    paddingTop: UIConstant.smallContentOffset(),
                    paddingBottom: UIConstant.smallContentOffset(),
                };
            }
        } else if (type === ChatMessageContent.AttachmentImage) {
            cell = this.renderImageCell();
            testID = 'chat_message_image';

            if (!firstFromChain) {
                padding = {
                    paddingTop: UIConstant.tinyContentOffset(),
                    paddingBottom: 0,
                };
            }
        } else if (type === ChatMessageContent.Sticker) {
            cell = this.renderStickerCell();
            testID = 'chat_message_sticker';
        } else if (type === ChatMessageContent.AttachmentDocument) {
            cell = this.renderDocumentCell();
            testID = 'chat_message_document';

            if (!firstFromChain) {
                padding = {
                    paddingTop: UIConstant.tinyContentOffset(),
                    paddingBottom: 0,
                };
            }
        } else if (type === ChatMessageContent.ActionButton) {
            const direction = this.getActionDirection();
            cell = this.renderActionCell(direction);
        } else if (type === ChatMessageContent.LinkActionMessage) {
            cell = this.renderLinkActionMessageCell();
            testID = 'chat_message_link';
        } else {
            cell = this.renderInformationCell('Message/Cell type not supported.');
        }

        if (!testID) {
            if (data) {
                testID = `chat_message_${data.toString()}`;
            } else {
                testID = 'chat_message_empty';
            }
        }

        const position = { alignSelf: align, justifyContent: align };

        return (
            <View
                testID={testID}
                style={[
                    UIStyle.common.flex(),
                    padding,
                ]}
                onLayout={this.props.onLayout}
            >
                <View
                    style={[position, styles.container]}
                >
                    {cell}
                </View>
                {messageDetails && (
                    <UILabel
                        style={[styles.messageDetails, messageDetailsStyle]}
                        role={UILabel.Role.TinyRegular}
                        text={messageDetails}
                    />
                )}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    emptyChatCell: {
        marginVertical: UIConstant.smallContentOffset() / 2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'flex-start',
    },
    msgContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: UIConstant.borderRadius(),
    },
    wrapMsgContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    msgContainerInformation: {
        padding: 5,
        width: '100%',
        borderRadius: UIConstant.borderRadius(),
        backgroundColor: UIColor.warning(),
        justifyContent: 'center',
        alignItems: 'center',
    },
    msgContainerEmpty: {
        alignSelf: 'flex-start',
        borderRadius: UIConstant.borderRadius(),
        borderColor: UIColor.light(),
        borderWidth: 1,
        backgroundColor: UIColor.white(),
        paddingHorizontal: UIConstant.horizontalContentOffset(),
        paddingVertical: UIConstant.verticalContentOffset(),
        marginBottom: UIConstant.contentOffset(),
    },
    textCell: {
        textAlign: 'left',
        maxWidth: '100%',
    },
    stickerCell: {
        backgroundColor: 'transparent',
        paddingBottom: UIConstant.mediumContentOffset(),
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
    messageDetails: {
        paddingTop: UIConstant.tinyContentOffset(),
        letterSpacing: 0.5,
        textAlign: 'right',
        color: UIColor.grey(),
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
    dateSeparator: {
        flexShrink: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: UIColor.backgroundTertiary(),
        height: UIConstant.smallCellHeight(),
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
        borderRadius: UIConstant.smallCellHeight() / 2,
    },
    systemInfo: {
        flexShrink: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    sysText: {
        color: UIColor.grey(),
    },
    linkActionMessageContainer: {
        marginBottom: UIConstant.tinyContentOffset(),
    },
    actionLabel: {
        backgroundColor: UIColor.primaryPlus(),
    },
    actionLabelText: {
        color: UIColor.fa(),
    },
    absoluteDate: {
        position: 'absolute',
        right: UIConstant.horizontalContentOffset(),
        bottom: UIConstant.verticalContentOffset(),
    },
    dateWithBackground: {
        backgroundColor: UIColor.black(),
        opacity: 0.6,
        borderRadius: 10,
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    timeText: {
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: UIColor.textQuaternary(),
    },
    timeTextContainer: {
        paddingLeft: UIConstant.smallContentOffset(),
        paddingTop: UIConstant.verticalContentOffset() / 2,
        marginLeft: 'auto', // Need for correct positioning to right side in message cell
    },
    greenBubble: {
        backgroundColor: UIColor.green(),
    },
    blackBubble: {
        backgroundColor: UIColor.black(),
    },
    leftBottomCorner: {
        borderBottomLeftRadius: 0,
    },
    rightBottomCorner: {
        borderBottomRightRadius: 0,
    },
    leftTopCorner: {
        borderTopLeftRadius: 0,
    },
    rightTopCorner: {
        borderTopRightRadius: 0,
    },
    verticalSeparator: {
        marginTop: UIConstant.tinyContentOffset() / 2,
    },
    keyThin: {
        paddingLeft: UIConstant.smallContentOffset(),
        marginLeft: 'auto',
    },
});
