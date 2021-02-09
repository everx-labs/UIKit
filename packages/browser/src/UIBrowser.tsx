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
};

type AddressInputAction = {
    type: 'OPEN_ADDRESS_INPUT' | 'OPEN_QR_CODE' | 'CLOSE_QR_CODE';
};

function addressInputReducer(
    _state: AddressInputState,
    action: AddressInputAction,
) {
    if (action.type === 'OPEN_ADDRESS_INPUT') {
        return {
            inputVisible: true,
            qrCodeVisible: false,
        };
    }
    if (action.type === 'OPEN_QR_CODE') {
        return {
            inputVisible: false,
            qrCodeVisible: true,
        };
    }
    if (action.type === 'CLOSE_QR_CODE') {
        return {
            inputVisible: false,
            qrCodeVisible: false,
        };
    }
    return {
        inputVisible: false,
        qrCodeVisible: false,
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
        },
    });

    if (interactiveMessage.type === InteractiveMessageType.Terminal) {
        return {
            messages: rest as ChatMessage[],
            input: state.terminal.visible && (
                <UIChatInput
                    editable
                    onSendText={interactiveMessage.onSendText}
                    onSendMedia={() => undefined}
                    onSendDocument={() => undefined}
                    onHeightChange={onHeightChange}
                />
            ),
        };
    }

    if (interactiveMessage.type === InteractiveMessageType.AddressInput) {
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
                            messageType: InteractiveMessageType.AddressInput,
                            payload: {
                                type: 'OPEN_QR_CODE',
                            },
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
                            messageType: InteractiveMessageType.AddressInput,
                            payload: {
                                type: 'OPEN_ADDRESS_INPUT',
                            },
                        });
                    },
                },
                // {
                //     type: ChatMessageType.ActionButton,
                //     text: 'Select asset',
                //     key: 'address-input-bubble',
                //     status: ChatMessageStatus.Received,
                //     time: Date.now(),
                //     sender: 'system',
                // },
                {
                    type: ChatMessageType.ActionButton,
                    text: uiLocalized.Browser.MainAccount,
                    key: 'address-input-bubble-action-account',
                    status: ChatMessageStatus.Received,
                    time: Date.now(),
                    sender: 'system',
                    onPress: () => {
                        interactiveMessage.onSelect(
                            uiLocalized.Browser.MainAccount,
                            interactiveMessage.mainAddress,
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
                ...(rest as ChatMessage[]),
            ],
            input: (
                <>
                    {state.addressInput.inputVisible && (
                        <UIAddressInput
                            onSendText={(addr) => {
                                interactiveMessage.onSelect(
                                    uiLocalized.Browser.EnterManually,
                                    addr,
                                );
                            }}
                            onHeightChange={onHeightChange}
                            validateAddress={
                                interactiveMessage.input.validateAddress
                            }
                        />
                    )}
                </>
            ),
        };
    }

    return {
        messages: messages as ChatMessage[],
        input: (
            <>
                <UIQRCodeScannerSheet
                    visible={state.addressInput.qrCodeVisible}
                    onRead={(e) => {
                        // @ts-ignore Unfortunatelly to keep animation smooth
                        // have to put it outside of upper guard
                        const message = interactiveMessage as AddressInputMessage;
                        message.onSelect(
                            uiLocalized.Browser.ScanQR,
                            message.qrCode.parseData(e.data),
                        );
                    }}
                    onClose={() => {
                        dispatch({
                            messageType: InteractiveMessageType.AddressInput,
                            payload: {
                                type: 'CLOSE_QR_CODE',
                            },
                        });
                    }}
                />
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
