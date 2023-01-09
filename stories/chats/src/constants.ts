/* eslint-disable no-useless-escape */
import { Platform } from 'react-native';

export const RegExpConstants = {
    protocol: /^https?:\/\//,
    url: /(https?:\/\/|www\.)[-а-яА-Яa-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-а-яА-Яa-zA-Z0-9@:%_\+.~#?&\/=]*[-а-яА-Яa-zA-Z0-9@:%_\+~#?&\/=])*/i,
};

export const UIConstant = {
    mediaImagePartOfScreen: Platform.select<number>({
        web: 3 / 12,
        default: 3 / 4,
    }),
    mediaImageMaxSizesAspectRatio: 9 / 16,
    animationScaleInFactor: 0.95,
};

// Semantically describe a bubble position
// By default:
// Sent is places on the right side
// Pending is also on the right
// Received - on the left
//
// This could be changed in some global config (not there yet).
export enum MessageStatus {
    Sent = 'sent',
    Pending = 'pending',
    Received = 'received',
    Aborted = 'aborted',
}

export enum ChatMessageType {
    PlainText = 'stm',
    System = 'sys',
    Transaction = 'trx',
    Image = 'aim',
    Document = 'doc',
    Sticker = 'stk',
    ActionButton = 'act',
    QRCode = 'QRCode',
    Media = 'Media',
}

export enum ActionButtonVariant {
    Neutral = 'Neutral',
    Negative = 'Negative',
    Positive = 'Positive',
}

export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}

export enum MediaMessageError {
    DataIsEmpty,
    NotSupportedDataFormat,
    InvalidData,
}
