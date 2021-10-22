import * as React from 'react';
import { FlatList, FlatListProps, ViewProps } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    CommonChatListProps,
    UICommonChatList,
    OnPressUrl,
    OnLongPressText,
} from '@tonlabs/uistory.chats';
import { BrowserMessage, InteractiveMessageType } from './types';
import { getFormattedList } from './getFormattedList';
import { AddressInput } from './Inputs/addressInput';
import { TerminalInput } from './Inputs/terminal';
import { MenuInput } from './Inputs/menu';
import { ConfirmInput } from './Inputs/confirm';
import { AmountInput } from './Inputs/amountInput';
import { SigningBox } from './Inputs/SigningBox';
import { TransactionConfirmation } from './Inputs/TransactionConfirmation';
import { QRCodeScanner } from './Inputs/qrCodeScanner';
import { EncryptionBox } from './Inputs/EncryptionBox';
import { DatePicker } from './Inputs/datePicker';
import { TimePicker } from './Inputs/timePicker';
import { DateTimePicker } from './Inputs/dateTimePicker';
import { CountryPicker } from './Inputs/countryPicker';
import { MediaOutput } from './MediaOutput';
import { QRCodeDraw } from './QRCodeDraw';

type UIBrowserListProps = {
    messages: BrowserMessage[];
    onPressUrl?: OnPressUrl;
    onLongPressText?: OnLongPressText;
    bottomInset?: number;
};

function flatListGetItemLayoutFabric({
    getItemHeight,
}: {
    getItemHeight: (rowData?: any, rowIndex?: number) => number;
}): Required<FlatListProps<BrowserMessage>>['getItemLayout'] {
    return (data, index) => {
        if (data == null) {
            return {
                length: 0,
                offset: 0,
                index,
            };
        }

        return {
            length: getItemHeight(data),
            offset: getItemHeight(data),
            index,
        };
    };
}

const renderBubble = () => (item: BrowserMessage, onLayout: ViewProps['onLayout']) => {
    if (item.type === ChatMessageType.PlainText) {
        return <BubbleSimplePlainText {...item} onLayout={onLayout} />;
    }
    if (item.type === ChatMessageType.ActionButton) {
        return <BubbleActionButton {...item} onLayout={onLayout} />;
    }

    if (item.type === InteractiveMessageType.AddressInput) {
        return <AddressInput {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.Terminal) {
        return <TerminalInput {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.Menu) {
        return <MenuInput {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.Confirm) {
        return <ConfirmInput {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.AmountInput) {
        return <AmountInput {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.SigningBox) {
        return <SigningBox {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.EncryptionBox) {
        return <EncryptionBox {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.TransactionConfirmation) {
        return <TransactionConfirmation {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.QRCodeScanner) {
        return <QRCodeScanner {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.Date) {
        return <DatePicker {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.Time) {
        return <TimePicker {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.DateTime) {
        return <DateTimePicker {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.MediaOutput) {
        return <MediaOutput {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.QRCodeDraw) {
        return <QRCodeDraw {...item} onLayout={onLayout} />;
    }
    if (item.type === InteractiveMessageType.Country) {
        return <CountryPicker {...item} onLayout={onLayout} />;
    }

    return null;
};

export const UIBrowserList = React.forwardRef<FlatList, UIBrowserListProps>(
    function UIBrowserListForwarded(
        { messages, onPressUrl, onLongPressText }: UIBrowserListProps,
        ref,
    ) {
        const formattedMessages = React.useMemo(() => getFormattedList(messages), [messages]);
        return (
            <UICommonChatList
                forwardRef={ref}
                nativeID="browserList"
                renderBubble={renderBubble()}
                getItemLayoutFabric={flatListGetItemLayoutFabric}
                onLongPressText={onLongPressText}
                onPressUrl={onPressUrl}
            >
                {(chatListProps: CommonChatListProps<BrowserMessage>) => (
                    <FlatList
                        testID="browser_container"
                        data={formattedMessages}
                        {...chatListProps}
                    />
                )}
            </UICommonChatList>
        );
    },
);
