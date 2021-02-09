import * as React from 'react';

import {
    UIChatList,
    ChatMessage,
    ChatMessageType,
    ChatMessageStatus,
    UIChatInput,
} from '@tonlabs/uikit.chats';
import type { OnHeightChange } from '@tonlabs/uikit.keyboard';
import { UIQRCodeScannerSheet } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import type { OnSendText, ValidateAddress } from './types';
import { UIAddressInput } from './UIAddressInput';

// eslint-disable-next-line no-shadow
enum InteractiveMessageType {
    Terminal = 'Terminal',
    AddressInput = 'AddressInput',
}

type AddressInputMessage = {
    type: InteractiveMessageType.AddressInput;
    onSelect: (selectedButtonText: string, address: string) => void;
    mainAddress: string;
    input: {
        validateAddress: ValidateAddress;
    };
    qrCode: {
        parseData: (data: any) => string;
    };
};

type TerminalMessage = {
    type: InteractiveMessageType.Terminal;
    onSendText: OnSendText;
};

type InteractiveMessage = TerminalMessage | AddressInputMessage;

type BrowserMessage = ChatMessage | InteractiveMessage;

type TerminalState = {
    visible: boolean;
};

function terminalReducer() {
    return {
        visible: true,
    };
}

type AddressInputState = {
    inputVisible: boolean;
    qrCodeVisible: boolean;
    addressSelectionVisible: boolean;
};

type AddressInputAction = {
    type:
        | 'OPEN_ADDRESS_INPUT'
        | 'OPEN_QR_CODE'
        | 'CLOSE_QR_CODE'
        | 'OPEN_ADDRESS_SELECTION'
        | 'CLOSE_ADDRESS_SELECTION';
};

function addressInputReducer(
    _state: AddressInputState,
    action: AddressInputAction,
) {
    if (action.type === 'OPEN_ADDRESS_INPUT') {
        return {
            inputVisible: true,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        };
    }
    if (action.type === 'OPEN_QR_CODE') {
        return {
            inputVisible: false,
            qrCodeVisible: true,
            addressSelectionVisible: false,
        };
    }
    if (action.type === 'CLOSE_QR_CODE') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        };
    }
    if (action.type === 'OPEN_ADDRESS_SELECTION') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: true,
        };
    }
    if (action.type === 'CLOSE_ADDRESS_SELECTION') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        };
    }
    return {
        inputVisible: false,
        qrCodeVisible: false,
        addressSelectionVisible: false,
    };
}

type InteractiveMessagesState = {
    terminal: TerminalState;
    addressInput: AddressInputState;
};

type InteractiveMessageAction = {
    messageType: InteractiveMessageType;
    payload: AddressInputAction;
};

function interactiveMessagesReducer(
    state: InteractiveMessagesState,
    action: InteractiveMessageAction,
) {
    return {
        terminal: terminalReducer(),
        addressInput: addressInputReducer(state.addressInput, action.payload),
    };
}

type Input = {
    messages: ChatMessage[];
    input: React.ReactNode;
    shared: React.ReactNode;
};

function useTerminal(
    message: BrowserMessage,
    onHeightChange: OnHeightChange,
    state: TerminalState,
): Input {
    if (message.type !== InteractiveMessageType.Terminal) {
        return {
            messages: [],
            input: null,
            shared: null,
        };
    }
    return {
        messages: [],
        input: state.visible && (
            <UIChatInput
                editable
                onSendText={message.onSendText}
                onSendMedia={() => undefined}
                onSendDocument={() => undefined}
                onHeightChange={onHeightChange}
            />
        ),
        shared: null,
    };
}

function useAddressInput(
    message: BrowserMessage,
    onHeightChange: OnHeightChange,
    state: AddressInputState,
    dispatch: (action: AddressInputAction) => void,
): Input {
    const qrCode = (
        <UIQRCodeScannerSheet
            visible={state.qrCodeVisible}
            onRead={(e: any) => {
                // @ts-ignore Unfortunatelly to keep animation smooth
                // have to put it outside of upper guard
                const m = message as AddressInputMessage;
                m.onSelect(
                    uiLocalized.Browser.ScanQR,
                    m.qrCode.parseData(e.data),
                );
            }}
            onClose={() => {
                dispatch({
                    type: 'CLOSE_QR_CODE',
                });
            }}
        />
    );

    if (message.type !== InteractiveMessageType.AddressInput) {
        return {
            messages: [],
            input: null,
            shared: qrCode,
        };
    }

    return {
        messages: [
            {
                type: ChatMessageType.ActionButton,
                text: uiLocalized.Browser.ScanQR,
                key: 'address-input-bubble-action-qr',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
                onPress: () => {
                    dispatch({
                        type: 'OPEN_QR_CODE',
                    });
                },
            },
            {
                type: ChatMessageType.ActionButton,
                text: uiLocalized.Browser.EnterManually,
                key: 'address-input-bubble-action-enter',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
                onPress: () => {
                    dispatch({
                        type: 'OPEN_ADDRESS_INPUT',
                    });
                },
            },
            // {
            //     type: ChatMessageType.ActionButton,
            //     text: uiLocalized.Browser.SelectAsset,
            //     key: 'address-input-bubble-select-assets',
            //     status: ChatMessageStatus.Received,
            //     time: Date.now(),
            //     sender: 'system',
            //     onPress: () => {
            //         dispatch({
            //             type: 'OPEN_ADDRESS_SELECTION',
            //         });
            //     },
            // },
            {
                type: ChatMessageType.ActionButton,
                text: uiLocalized.Browser.MainAccount,
                key: 'address-input-bubble-action-account',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
                onPress: () => {
                    message.onSelect(
                        uiLocalized.Browser.MainAccount,
                        message.mainAddress,
                    );
                },
            },
            {
                type: ChatMessageType.PlainText,
                text: 'What wallet do you want to work with?',
                key: 'address-input-bubble',
                status: ChatMessageStatus.Received,
                time: Date.now(),
                sender: 'system',
            },
        ],
        input: (
            <>
                {state.inputVisible && (
                    <UIAddressInput
                        onSendText={(addr) => {
                            message.onSelect(
                                uiLocalized.Browser.EnterManually,
                                addr,
                            );
                        }}
                        onHeightChange={onHeightChange}
                        validateAddress={message.input.validateAddress}
                    />
                )}
            </>
        ),
        shared: qrCode,
    };
}

function useInteractiveMessages(
    messages: BrowserMessage[],
    onHeightChange: OnHeightChange,
): {
    messages: ChatMessage[];
    input: React.ReactNode;
} {
    const [interactiveMessage, ...rest] = messages;

    const [state, dispatch] = React.useReducer(interactiveMessagesReducer, {
        terminal: {
            visible: false,
        },
        addressInput: {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        },
    });

    const terminal = useTerminal(
        interactiveMessage,
        onHeightChange,
        state.terminal,
    );

    const addressInput = useAddressInput(
        interactiveMessage,
        onHeightChange,
        state.addressInput,
        (action: AddressInputAction) =>
            dispatch({
                messageType: InteractiveMessageType.AddressInput,
                payload: action,
            }),
    );

    return {
        messages: [
            ...terminal.messages,
            ...addressInput.messages,
            ...(rest as ChatMessage[]),
        ],
        input: (
            <>
                {terminal.input}
                {terminal.shared}
                {addressInput.input}
                {addressInput.shared}
            </>
        ),
    };
}

type UIBrowserProps = {
    messages: BrowserMessage[];
};

export function UIBrowser({ messages: passedMessages }: UIBrowserProps) {
    const [bottomInset, setBottomInset] = React.useState<number>(0);

    const { messages, input } = useInteractiveMessages(
        passedMessages,
        setBottomInset,
    );

    return (
        <>
            <UIChatList
                areStickersVisible={false}
                onLoadEarlierMessages={() => undefined}
                canLoadMore={false}
                isLoadingMore={false}
                messages={messages}
                bottomInset={bottomInset}
            />
            {input}
        </>
    );
}
