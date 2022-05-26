/* eslint-disable no-shadow */
import type { ImageSourcePropType, LayoutChangeEvent, ViewProps } from 'react-native';
import type BigNumber from 'bignumber.js';

import type { QRCodeError } from '@tonlabs/uikit.media';

import type {
    ActionButtonVariant,
    ChatMessageType,
    MediaMessageError,
    MessageStatus,
    TransactionType,
} from './constants';

/**
 * A string of the form: `data:<data type>;base64,<data in base64>`
 */
export type DataUrl = string;

export type OnLayoutCell = (key: string, e: LayoutChangeEvent) => void;

export type BubbleBaseT = {
    key: string;
    firstFromChain?: boolean;
    lastFromChain?: boolean;
    status: MessageStatus;
    onLayout?: ViewProps['onLayout'];
};

export type OnPressUrl = ((url: string, index?: number) => void | Promise<void>) | undefined;

export type OnLongPressText = ((text: string) => void | Promise<void>) | undefined;

export type PlainTextMessage = BubbleBaseT & {
    type: ChatMessageType.PlainText;
    text: string;
    actionText?: string;
    onTouchText?: () => void | Promise<void>;
};

export enum ActionButtonMessageIconPosition {
    Left = 'Left',
    Right = 'Right',
}

export type ActionButtonMessage = BubbleBaseT & {
    type: ChatMessageType.ActionButton;
    variant?: ActionButtonVariant;
    text: string;
    icon?: ImageSourcePropType;
    iconPosition?: ActionButtonMessageIconPosition;
    textMode?: 'ellipsize' | 'fit';
    disabled?: boolean;
    onPress?: () => void | Promise<void>;
};

// Props that required for proper chat rendering
type ChatMeta = {
    time: number;
    sender: string;
};

export type ChatPlainTextMessage = ChatMeta & PlainTextMessage;

export type SystemMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.System;
        text: string;
    };

export type TransactionComment = {
    text: string;
    encrypted: boolean;
};

export type TransactionMessage = BubbleBaseT &
    ChatMeta & {
        // ---
        time: number;
        sender: string;
        // ---
        type: ChatMessageType.Transaction;
        info: {
            type: TransactionType;
            amount: BigNumber; // mostly used for testID purposes
            balanceChange: string | React.ReactElement<any, any>;
            text?: string;
        };
        comment?: TransactionComment;
        actionText?: string;
        onPress?: () => void | Promise<void>;
    };

export type ImageMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.Image;
        // TODO: url???
        size: {
            width: number;
            height: number;
        };
    };

export type DocumentMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.Document;
        // TODO: url???
        docName?: string;
        fileSize?: number;
    };

export type StickerMessage = BubbleBaseT &
    ChatMeta & {
        type: ChatMessageType.Sticker;
        source: ImageSourcePropType;
    };

export type ChatActionButtonMessage = ChatMeta & ActionButtonMessage;

export type QRCodeMessage = BubbleBaseT & {
    type: ChatMessageType.QRCode;
    data: string;
    onError?: (error: QRCodeError) => void;
    onSuccess?: () => void;
    onPress?: (image: string) => void;
};

export type ChatQRCodeMessage = ChatMeta & QRCodeMessage;

export type MediaMessage = BubbleBaseT & {
    type: ChatMessageType.Media;
    data: DataUrl | null;
    preview: DataUrl | null;
    prompt?: string;
    onLoad?: () => void;
    onError?: (error: MediaMessageError) => void;
};

export type ChatMediaMessage = ChatMeta & MediaMessage;

export type ChatMessage =
    | ChatPlainTextMessage
    | ChatActionButtonMessage
    | ChatQRCodeMessage
    | ChatMediaMessage
    | SystemMessage
    | TransactionMessage
    | ImageMessage
    | DocumentMessage
    | StickerMessage;
