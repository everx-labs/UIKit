import * as React from 'react';

import type { OnHeightChange } from '@tonlabs/uikit.keyboard';

import {
    BrowserMessage,
    Input,
    InteractiveMessage,
    InteractiveMessageType,
    VisibleMessage,
} from './types';
import {
    TerminalState,
    terminalReducer,
    getTerminalInput,
} from './Inputs/terminal';
import {
    AddressInputState,
    AddressInputAction,
    addressInputReducer,
    getAddressInput,
    getAddressInputShared,
} from './Inputs/addressInput';
import { UIBrowserList } from './UIBrowserList';

type InteractiveMessagesState = {
    [InteractiveMessageType.Terminal]: TerminalState;
    [InteractiveMessageType.AddressInput]: AddressInputState;
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
        [InteractiveMessageType.Terminal]: terminalReducer(),
        [InteractiveMessageType.AddressInput]: addressInputReducer(
            state[InteractiveMessageType.AddressInput],
            action.payload,
        ),
    };
}

type GetInteractiveInput = (
    interactiveMessage: InteractiveMessage,
    state: InteractiveMessagesState[InteractiveMessage['type']],
    dispatch: (action: InteractiveMessageAction['payload']) => void,
    onHeightChange: OnHeightChange,
) => Input;

type GetInteractiveInputShared = (
    interactiveMessage: InteractiveMessage,
    state: InteractiveMessagesState[InteractiveMessage['type']],
    dispatch: (action: InteractiveMessageAction['payload']) => void,
) => React.ReactNode;

type InputFabric = {
    type: InteractiveMessageType;
    getInput: GetInteractiveInput;
    getInputShared?: GetInteractiveInputShared;
};

function useInteractiveMessages(
    allMessages: BrowserMessage[],
    onHeightChange: OnHeightChange,
    inputs: InputFabric[],
): {
    messages: VisibleMessage[];
    input: React.ReactNode;
} {
    const [interactiveMessage, ...rest] = allMessages;

    const [state, dispatch] = React.useReducer(interactiveMessagesReducer, {
        [InteractiveMessageType.Terminal]: {
            visible: true,
        },
        [InteractiveMessageType.AddressInput]: {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        },
    });

    // It's not an interactive message :)
    if (
        interactiveMessage == null ||
        Object.keys(InteractiveMessageType).indexOf(interactiveMessage.type) ===
            -1
    ) {
        return {
            messages: allMessages as VisibleMessage[],
            input: null,
        };
    }

    const inputsPrepared = inputs.reduce<{
        messages: VisibleMessage[];
        input: React.ReactNode;
        shared: React.ReactNode[];
    }>(
        (acc, { type, getInput, getInputShared }) => {
            if (type === interactiveMessage.type) {
                const { messages, input } = getInput(
                    interactiveMessage,
                    state[type],
                    (action) => {
                        dispatch({
                            messageType: type,
                            payload: action,
                        });
                    },
                    onHeightChange,
                );

                acc.messages = acc.messages.concat(messages);
                acc.input = input;
            }

            if (getInputShared != null) {
                const shared = getInputShared(
                    interactiveMessage as InteractiveMessage,
                    state[type],
                    (action) => {
                        dispatch({
                            messageType: type,
                            payload: action,
                        });
                    },
                );

                acc.shared.push(shared);
            }

            return acc;
        },
        {
            messages: [],
            input: null,
            shared: [],
        },
    );

    return {
        messages: [...inputsPrepared.messages, ...(rest as VisibleMessage[])],
        input: (
            <>
                {inputsPrepared.input}
                {inputsPrepared.shared}
            </>
        ),
    };
}

type UIBrowserProps = {
    messages: BrowserMessage[];
};

export function UIBrowser({ messages: passedMessages }: UIBrowserProps) {
    const [bottomInset, setBottomInset] = React.useState<number>(0);

    // @ts-ignore
    const inputs: InputFabric[] = React.useMemo(
        () => [
            {
                type: InteractiveMessageType.Terminal,
                getInput: getTerminalInput,
            } as InputFabric,
            {
                type: InteractiveMessageType.AddressInput,
                getInput: getAddressInput,
                getInputShared: getAddressInputShared,
            },
        ],
        [],
    );

    const { messages, input } = useInteractiveMessages(
        passedMessages,
        setBottomInset,
        inputs,
    );

    return (
        <>
            <UIBrowserList messages={messages} bottomInset={bottomInset} />
            {input}
        </>
    );
}
