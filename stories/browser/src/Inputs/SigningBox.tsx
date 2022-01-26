import * as React from 'react';
import { View } from 'react-native';

import {
    BubbleActionButton,
    BubbleSimplePlainText,
    ChatMessageType,
    MessageStatus,
} from '@tonlabs/uistory.chats';
import { uiLocalized } from '@tonlabs/localization';

import type { SigningBox as SigningBoxType, SigningBoxMessage } from '../types';
import { UIBoxPicker } from '../UIBoxPicker';
import { UIKeySheet } from '../UIKeySheet';

type SigningBoxInternalState = {
    keyInputVisible: boolean;
    pickerVisible: boolean;
    securityCard: boolean;
};

type SigningBoxAction = {
    type:
        | 'OPEN_KEY_INPUT'
        | 'CLOSE_KEY_INPUT'
        | 'OPEN_SIGNATURE_PICKER'
        | 'OPEN_SECURITY_CARD_PICKER'
        | 'CLOSE_PICKER';
};

function signingBoxReducer(state: SigningBoxInternalState, action: SigningBoxAction) {
    if (action.type === 'OPEN_KEY_INPUT') {
        return {
            ...state,
            keyInputVisible: true,
        };
    }
    if (action.type === 'CLOSE_KEY_INPUT') {
        return {
            ...state,
            keyInputVisible: false,
        };
    }
    if (action.type === 'OPEN_SIGNATURE_PICKER') {
        return {
            ...state,
            pickerVisible: true,
            securityCard: false,
        };
    }
    if (action.type === 'OPEN_SECURITY_CARD_PICKER') {
        return {
            ...state,
            pickerVisible: true,
            securityCard: true,
        };
    }
    if (action.type === 'CLOSE_PICKER') {
        return {
            ...state,
            pickerVisible: false,
            securityCard: false,
        };
    }

    return {
        keyInputVisible: false,
        pickerVisible: false,
        securityCard: false,
    };
}

export function SigningBox({ onLayout, ...message }: SigningBoxMessage) {
    const [state, dispatch] = React.useReducer(signingBoxReducer, {
        keyInputVisible: false,
        pickerVisible: false,
        securityCard: false,
    });

    const [signatures, setSignatures] = React.useState<SigningBoxType[]>([]);
    const [securityCards, setSecurityCards] = React.useState<SigningBoxType[]>([]);

    React.useEffect(() => {
        const [, ...restSigningBoxes] = message.signingBoxes;

        const signatureBoxes: SigningBoxType[] = [];
        const securityCardBoxes: SigningBoxType[] = [];

        restSigningBoxes.forEach((signingBox: SigningBoxType) => {
            if (signingBox.serialNumber) {
                securityCardBoxes.push(signingBox);
            } else {
                signatureBoxes.push(signingBox);
            }
        });

        setSignatures(signatureBoxes);
        setSecurityCards(securityCardBoxes);
    }, [message.signingBoxes]);

    const [mainSigningBox] = message.signingBoxes;

    const signatureAnswerText = React.useMemo(() => {
        if (message.externalState == null) {
            return '';
        }

        const { signingBox } = message.externalState;
        if (!signingBox) {
            return '';
        }

        if (!mainSigningBox) {
            return '';
        }

        if (signingBox.title === mainSigningBox.title) {
            return mainSigningBox.title;
        }

        if (signingBox.publicKey) {
            return `${signingBox.title} ${signingBox.publicKey.slice(0, 2)} ·· `;
        }

        return signingBox.title;
    }, [message, mainSigningBox]);

    if (message.externalState != null) {
        return (
            <View onLayout={onLayout}>
                <BubbleSimplePlainText
                    type={ChatMessageType.PlainText}
                    key="signing-box-bubble-prompt"
                    text={message.prompt || uiLocalized.Browser.SigningBox.Prompt}
                    status={MessageStatus.Received}
                    firstFromChain
                    lastFromChain
                />
                {message.externalState.chosenOption != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="signing-box-bubble-option-answer"
                        text={message.externalState.chosenOption}
                        status={MessageStatus.Sent}
                        firstFromChain
                        lastFromChain={message.externalState.signingBox == null}
                    />
                ) : null}
                {message.externalState.signingBox != null ? (
                    <BubbleSimplePlainText
                        type={ChatMessageType.PlainText}
                        key="signing-box-bubble-signature-answer"
                        text={signatureAnswerText}
                        status={MessageStatus.Sent}
                        firstFromChain={message.externalState.chosenOption == null}
                        lastFromChain
                    />
                ) : null}
            </View>
        );
    }

    return (
        <View onLayout={onLayout}>
            <BubbleSimplePlainText
                type={ChatMessageType.PlainText}
                key="signing-box-bubble-prompt"
                text={message.prompt || uiLocalized.Browser.SigningBox.Prompt}
                status={MessageStatus.Received}
                firstFromChain
                lastFromChain
            />
            {mainSigningBox != null ? (
                <BubbleActionButton
                    key="signing-box-bubble-main"
                    firstFromChain
                    type={ChatMessageType.ActionButton}
                    status={MessageStatus.Received}
                    text={mainSigningBox.title}
                    onPress={() => {
                        message.onSelect({
                            signingBox: mainSigningBox,
                        });
                    }}
                />
            ) : null}
            <BubbleActionButton
                type={ChatMessageType.ActionButton}
                key="signing-box-bubble-enter-key"
                status={MessageStatus.Received}
                text={uiLocalized.Browser.SigningBox.EnterKey}
                onPress={() => {
                    dispatch({
                        type: 'OPEN_KEY_INPUT',
                    });
                }}
                firstFromChain={message.signingBoxes.length === 0}
            />
            {signatures.length > 0 && (
                <BubbleActionButton
                    type={ChatMessageType.ActionButton}
                    key="signing-box-bubble-pick-signature"
                    status={MessageStatus.Received}
                    text={uiLocalized.Browser.SigningBox.PickSignature}
                    onPress={() => {
                        dispatch({
                            type: 'OPEN_SIGNATURE_PICKER',
                        });
                    }}
                    lastFromChain={!message.securityCardSupported}
                />
            )}
            {message.securityCardSupported && securityCards.length > 0 && (
                <BubbleActionButton
                    type={ChatMessageType.ActionButton}
                    key="signing-box-bubble-use-scard"
                    status={MessageStatus.Received}
                    text={uiLocalized.Browser.SigningBox.UseSecurityCard}
                    onPress={async () => {
                        if (securityCards.length === 1) {
                            // No need to show the picker, just select the first security card
                            message.onSelect({
                                chosenOption: uiLocalized.Browser.SigningBox.UseSecurityCard,
                                signingBox: securityCards[0],
                            });
                        } else {
                            dispatch({
                                type: 'OPEN_SECURITY_CARD_PICKER',
                            });
                        }

                        /**
                         * Comment the code bellow, we might want to return it later once we learn how
                         * to deal with several security card related signing boxes on a single usage!
                         *
                        const isSuccessful = await message.onUseSecurityCard();

                        if (!isSuccessful) {
                            return;
                        }

                        message.onSelect({
                            chosenOption:
                                uiLocalized.Browser.SigningBox.UseSecurityCard,
                        });
                        */
                    }}
                    lastFromChain
                />
            )}
            <UIBoxPicker
                visible={state.pickerVisible}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_PICKER',
                    });
                }}
                onAdd={
                    state.securityCard
                        ? undefined
                        : () => {
                              dispatch({
                                  type: 'OPEN_KEY_INPUT',
                              });
                          }
                }
                onSelect={signingBox => {
                    if (state.securityCard) {
                        message.onSelect({
                            chosenOption: uiLocalized.Browser.SigningBox.UseSecurityCard,
                            signingBox,
                        });
                    } else {
                        message.onSelect({
                            chosenOption: uiLocalized.Browser.SigningBox.PickSignature,
                            signingBox,
                        });
                    }

                    dispatch({
                        type: 'CLOSE_PICKER',
                    });
                }}
                boxes={state.securityCard ? securityCards : signatures}
                headerTitle={
                    state.securityCard
                        ? uiLocalized.Browser.SigningBox.SecurityCards
                        : uiLocalized.Browser.SigningBox.Signatures
                }
                addTitle={uiLocalized.Browser.SigningBox.AddSignature}
            />
            <UIKeySheet
                visible={state.keyInputVisible}
                onClose={() => {
                    dispatch({
                        type: 'CLOSE_KEY_INPUT',
                    });
                }}
                onKeyRetrieved={async (key: string) => {
                    const signingBox = await message.onAddSigningBox(key);

                    message.onSelect({
                        chosenOption: uiLocalized.Browser.SigningBox.EnterKey,
                        signingBox,
                    });

                    dispatch({
                        type: 'CLOSE_KEY_INPUT',
                    });
                }}
                label={uiLocalized.Browser.SigningBox.PrivateKey}
                buttonTitle={uiLocalized.Browser.SigningBox.Sign}
            />
        </View>
    );
}
