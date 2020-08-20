// @flow
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Platform,
    Animated,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';

import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { LayoutEvent, Layout } from 'react-native/Libraries/Types/CoreEventTypes';

import UIPureComponent from '../../UIPureComponent';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UILocalized, { formatTime } from '../../../helpers/UILocalized';
import UILabel from '../../text/UILabel';

import UIShareManager from '../../../helpers/UIShareManager';

import UIChatImageCell from './UIChatImageCell';
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
}

type State = {
    layout: Layout,
}

const styles = StyleSheet.create({
    row: {
        marginVertical: UIConstant.smallContentOffset() / 2,
    },
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
        justifyContent: 'flex-end',
        borderRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.horizontalContentOffset(),
        paddingVertical: UIConstant.verticalContentOffset(),
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
    msgSending: {
        alignItems: 'flex-end',
        backgroundColor: UIColor.backgroundQuinary(),
    },
    msgReceived: {
        alignItems: 'flex-start',
        backgroundColor: UIColor.fa(),
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
        backgroundColor: UIColor.overlay40(),
        height: UIConstant.smallCellHeight(),
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
    dateText: {
        color: UIColor.secondary(),
    },
    timeText: {
        textAlign: 'right',
        alignSelf: 'flex-end',
        paddingLeft: UIConstant.smallContentOffset(),
        paddingTop: UIConstant.verticalContentOffset() / 2,
        color: UIColor.textQuaternary(),
    },
    greenBubble: {
        backgroundColor: UIColor.green(),
    },
    blackBubble: {
        backgroundColor: UIColor.blackLight(),
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
});

export default class UIChatMessageCell extends UIPureComponent<Props, State> {
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

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            layout: {
                width: 0,
                height: 0,
                x: 0,
                y: 0,
            },
        };
    }

    animatedBubble = new Animated.Value(1);
    bubbleScaleAnimation(scaleIn: boolean = false) {
        Animated.spring(this.animatedBubble, {
            toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }

    onLayout(e: LayoutEvent) {
        const { layout } = e.nativeEvent;
        this.setStateSafely({ layout });
    }

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

    getLayout(): Layout {
        return this.state.layout;
    }

    getActionDirection(): TypeOfActionDirection {
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
        isSticker: boolean = false,
    ): React$Element<any> {
        const { additionalInfo } = this.props;

        const bg = isSticker ? { backgroundColor: 'transparent' } : null;
        const userName = isSticker ? null : this.renderName();

        let rounded = {};

        if (additionalInfo?.lastFromChain) {
            rounded = this.isReceived
                ? styles.leftBottomCorner
                : styles.rightBottomCorner;
        }

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
            <Animated.View style={[styles.wrapMsgContainer, animation]}>
                {this.renderAvatar()}
                <View
                    style={[
                        styles.msgContainer,
                        !isText && UIStyle.common.flexColumn(),
                        style,
                        rounded,
                        bg,
                    ]}
                >
                    {userName}
                    {children}
                    {this.renderTime()}
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

    renderTime() {
        // Calculate the testID prop
        let testID;
        const { data } = this.props;
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
        return (
            <Text
                testID={testID}
                style={[UIFont.tinyRegular(), styles.timeText]}
            >
                {msgTime}
            </Text>
        );
    }

    renderDateSeparator() {
        const { data } = this.props;
        return (
            <View style={styles.dateSeparator}>
                <Text style={[UIFont.tinyRegular(), styles.dateText]}>
                    {data}
                </Text>
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
            ? styles.leftBottomCorner
            : styles.rightBottomCorner;
        return (
            <View style={[
                styles.msgContainer,
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
            this.wrapInMessageContainer(<UIChatImageCell
                image={data}
                parentLayout={this.getLayout()}
                additionalInfo={additionalInfo}
            />)
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

    renderTransactionCell() {
        const {
            additionalInfo, data, status, onTouchTransaction, isReceived,
        } = this.props;
        const onTransactionPress = onTouchTransaction
            ? this.onTransactionPress
            : null;
        return (
            <UIChatTransactionCell
                message={data}
                status={status}
                isReceived={isReceived}
                additionalInfo={additionalInfo}
                onPress={onTransactionPress}
            />
        );
    }

    renderTransactionCommentCell() {
        const { additionalInfo } = this.props;
        const rounded = this.isReceived
            ? styles.leftTopCorner
            : styles.rightTopCorner;
        const background = this.isReceived
            ? styles.greenBubble
            : styles.blackBubble;
        return (
            <View style={[
                styles.msgContainer,
                rounded,
                background,
            ]}
            >
                <Text
                    testID={`transaction_comment_${additionalInfo?.message.info.text || ''}`}
                    style={[styles.actionLabelText, UIFont.smallRegular(), styles.textCell]}
                >
                    {additionalInfo?.message.info.text || ''}
                </Text>
            </View>
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

        const currentMargin = (UIConstant.tinyContentOffset() / 2);
        let cell = null;
        let testID = '';

        let margin = null;
        let align = this.isReceived ? 'flex-start' : 'flex-end';
        if (additionalInfo?.lastFromChain) {
            margin = { marginBottom: UIConstant.normalContentOffset() - currentMargin };
        }

        if (type === ChatMessageContent.DateSeparator) {
            align = 'center';
            cell = this.renderDateSeparator();
            margin = { marginVertical: UIConstant.normalContentOffset() - currentMargin };
        } else if (type === ChatMessageContent.SystemInfo) {
            align = 'center';
            cell = this.renderSystemInfo();
            margin = { marginVertical: UIConstant.normalContentOffset() - currentMargin };
        } else if (type === ChatMessageContent.ActionLabel) {
            cell = this.renderActionLabel();
        } else if (type === ChatMessageContent.EmptyChat) {
            align = 'flex-start';
            cell = this.renderEmptyChatCell();
        } else if (type === ChatMessageContent.TransactionInChat) {
            cell = this.renderTransactionCell();
            margin = { marginVertical: UIConstant.normalContentOffset() - currentMargin };
            testID = `chat_message_${data?.info?.trx?.amount || 'trx'}`;
        } else if (type === ChatMessageContent.TransactionComment) {
            // hack to move comment closer to the parent transaction bubble
            margin = { marginTop: -UIConstant.tinyContentOffset() };
            cell = this.renderTransactionCommentCell();
        } else if (type === ChatMessageContent.SimpleText) {
            cell = this.renderTextCell();
        } else if (type === ChatMessageContent.System || type === ChatMessageContent.Invite) {
            align = 'center';
            cell = this.renderSystemCell();
            margin = { marginVertical: UIConstant.normalContentOffset() - currentMargin };
        } else if (type === ChatMessageContent.AttachmentImage) {
            cell = this.renderImageCell();
            testID = 'chat_message_image';
        } else if (type === ChatMessageContent.AttachmentDocument) {
            cell = this.renderDocumentCell();
            testID = 'chat_message_document';
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
                    styles.row,
                    margin,
                ]}
            >
                <View
                    style={[position, styles.container]}
                    onLayout={e => this.onLayout(e)}
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
