import * as React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import BigNumber from 'bignumber.js';

import {
    InteractiveMessageType,
    UIBrowser,
    BrowserMessage,
    ValidationResultStatus,
    QRCodeScannerMessage,
    EncryptionBoxMessage,
    DateMessage,
    TimeMessage,
    DateTimeMessage,
    CountryMessage,
    AddressInputMessage,
    ConfirmMessage,
    MenuMessage,
    TerminalMessage,
    AmountInputMessage,
    SigningBoxMessage,
    TransactionConfirmationMessage,
} from '@tonlabs/uistory.browser';
import { UIPopup, UICardSheet, UIFullscreenSheet } from '@tonlabs/uikit.popups';
import { uiLocalized } from '@tonlabs/localization';
import { ChatMessageType, MessageStatus } from '@tonlabs/uistory.chats';
import { UIBoxButton } from '@tonlabs/uikit.controls';
import { UICurrency } from '@tonlabs/uicast.numbers';
import { UILabel, ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { ScrollView } from '@tonlabs/uikit.scrolls';

import { View } from 'react-native';
import { useBase64Image } from './hooks/useBase64Image';
import { useStore, updateStore } from '../useStore';

const imageUrl = {
    original:
        'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-original.jpeg?alt=media&token=8907ad38-4d43-47c1-8f80-fd272e617440',
    medium: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-medium.jpeg?alt=media&token=8a2f5747-495e-4aae-a9d0-460f34b12717',
    small: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
};

function setMenuVisible(visible: boolean) {
    updateStore(() => ({ menuVisible: visible }));
}

function BrowserAddMenu({
    addMessage,
    setUsingSecCard,
    base64Image,
    base64PreviewImage,
}: {
    addMessage: (message: BrowserMessage) => void;
    setUsingSecCard: (using: boolean) => void;
    base64Image: string | null;
    base64PreviewImage: string | null;
}) {
    const [signingBoxes, setSigningBoxes] = React.useState([
        {
            id: 1,
            title: 'Sign with Surf',
            publicKey: '1c2f3b4a',
        },
        {
            id: 2,
            title: 'Governance key',
            publicKey: '2f3b4a',
        },
        {
            id: 3,
            title: 'Signature',
            publicKey: '3b4a',
        },
    ]);
    const [encryptionBoxes, setEncryptionBoxes] = React.useState([
        {
            id: 1,
            title: 'Use Surf keys',
        },
        {
            id: 2,
            title: 'Unknown',
        },
    ]);

    return (
        <ScrollView>
            <UIBoxButton
                title="Add Media image"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: BrowserMessage = {
                        key: `${Date.now()}-media-image`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.MediaOutput,
                        data: base64Image,
                        preview: base64PreviewImage,
                        prompt: 'Look at this cool picture!',
                        onOutput: status => {
                            console.log({ status });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add QRCode"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: BrowserMessage = {
                        key: `${Date.now()}-qr-code`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.QRCodeDraw,
                        prompt: `Scan the QR code on your phone's camera`,
                        data: 'You are reading a message received through a QR code',
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add AddressInput"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: AddressInputMessage = {
                        key: `${Date.now()}-address-input`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.AddressInput,
                        prompt: 'What wallet do you want to work with? example url: https://google.com',
                        mainAddress: '0:000',
                        input: {
                            validateAddress: (text: string) => {
                                if (text.length > 0 && text.length % 5 === 0) {
                                    return Promise.resolve({
                                        status: ValidationResultStatus.Error,
                                        text: 'Oh no, the length is divided by 5',
                                    });
                                }
                                return Promise.resolve({
                                    status: ValidationResultStatus.None,
                                });
                            },
                        },
                        qrCode: {
                            parseData: (_data: any) => {
                                return Promise.resolve('0:000');
                            },
                        },
                        select: [
                            {
                                title: 'Accounts',
                                data: new Array(20).fill(null).map((_i, index) => ({
                                    address: `0:000${index}`,
                                    balance: `12${index}`,
                                    description: 'My Crystals',
                                })),
                            },
                        ],
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add TerminalInput"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: TerminalMessage = {
                        key: `${Date.now()}-terminal-input`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.Terminal,
                        prompt: 'Type sth!',
                        onSend: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add Menu"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: MenuMessage = {
                        key: `${Date.now()}-menu`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.Menu,
                        title: 'Choose:',
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                        items: [
                            {
                                handlerId: 1,
                                title: 'One',
                            },
                            {
                                handlerId: 2,
                                title: 'Two',
                            },
                            {
                                handlerId: 3,
                                title: 'Three',
                            },
                            {
                                handlerId: 4,
                                title: 'Four',
                            },
                            {
                                handlerId: 5,
                                title: 'Five',
                            },
                            {
                                handlerId: 6,
                                title: 'Six',
                            },
                            {
                                handlerId: 7,
                                title: 'Seven',
                            },
                        ],
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add Confirm"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: ConfirmMessage = {
                        key: `${Date.now()}-confirm`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.Confirm,
                        prompt: 'Are you sure?',
                        onConfirm: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add AmountInput"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: AmountInputMessage = {
                        key: `${Date.now()}-amount`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.AmountInput,
                        prompt: 'Enter amount:',
                        decimals: 9,
                        min: new BigNumber('10.25').multipliedBy(10 ** 9),
                        max: new BigNumber('100').multipliedBy(10 ** 9),
                        // min: new BigNumber(
                        //     '100000000000000000000000.1111111',
                        // ),
                        // max: new BigNumber(
                        //     '10000000000000000000000000.1111111',
                        // ),
                        onSend: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add SigningBoxInput"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: SigningBoxMessage = {
                        key: `${Date.now()}-signing-box`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.SigningBox,
                        signingBoxes,
                        onAddSigningBox: (privateKey: string) => {
                            const newSigningBox = {
                                id: signingBoxes[signingBoxes.length - 1].id + 1,
                                title: 'Signature',
                                publicKey: privateKey,
                            };
                            setSigningBoxes([...signingBoxes, newSigningBox]);
                            addMessage({
                                ...message,
                                signingBoxes: [...signingBoxes, newSigningBox],
                            });

                            return Promise.resolve(newSigningBox);
                        },
                        onUseSecurityCard: () => {
                            setUsingSecCard(true);

                            return new Promise(resolve => {
                                setTimeout(() => {
                                    setUsingSecCard(false);
                                    resolve(true);
                                }, 1000);
                            });
                        },
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add EncryptionBoxInput"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: EncryptionBoxMessage = {
                        key: `${Date.now()}-encryption-box`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.EncryptionBox,
                        encryptionBoxes,
                        onAddEncryptionBox: (_privateKey: string) => {
                            const newEncryptionBox = {
                                id: encryptionBoxes[encryptionBoxes.length - 1].id + 1,
                                title: 'Cipher key',
                            };
                            setEncryptionBoxes([...encryptionBoxes, newEncryptionBox]);
                            addMessage({
                                ...message,
                                encryptionBoxes: [...encryptionBoxes, newEncryptionBox],
                            });

                            return Promise.resolve(newEncryptionBox);
                        },
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add TransactionConfirmationMessage"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: TransactionConfirmationMessage = {
                        key: `${Date.now()}-approve`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.TransactionConfirmation,
                        recipient:
                            '0:6225d2asdhksdf0wer6bef5891d76ab3c430ee3a127d10de459b3b3a844f4',
                        onRecipientPress: () => {
                            // nothing
                        },
                        action: 'ReturnDeposit',
                        amount: <UICurrency signChar="SURF">{new BigNumber(0.5)}</UICurrency>,
                        contractFee: (
                            <UILabel>
                                up to <UICurrency signChar="EVER">{new BigNumber(5)}</UICurrency>
                            </UILabel>
                        ),
                        networkFee: (
                            <UILabel>
                                ≈<UICurrency signChar="EVER">{new BigNumber(0.12)}</UICurrency>
                            </UILabel>
                        ),
                        signature: {
                            id: 1,
                            title: 'My Surf',
                            publicKey: '1c2f3b4a',
                        },
                        onApprove: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                        onCancel: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add QRCodeScannerMessage"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: QRCodeScannerMessage = {
                        key: `${Date.now()}-qr-code`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.QRCodeScanner,
                        prompt: 'You can scan any QR code',
                        onScan: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                        parseData: (_data: any) => {
                            return Promise.resolve('0:000');
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Add QRCodeScannerMessage with fast scan"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: QRCodeScannerMessage = {
                        key: `${Date.now()}-qr-code`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.QRCodeScanner,
                        fastScan: true,
                        onScan: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                        parseData: (_data: any) => {
                            return Promise.resolve('0:000');
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Choose date and time"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: DateTimeMessage = {
                        key: `${Date.now()}-datetime-picker`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.DateTime,
                        minDateTime: (() => {
                            const now = new Date();
                            return new Date(
                                now.getFullYear(),
                                now.getMonth() - 2,
                                now.getDate(),
                                12,
                                4,
                                0,
                            );
                        })(),
                        maxDateTime: (() => {
                            const now = new Date();
                            return new Date(
                                now.getFullYear(),
                                now.getMonth() + 2,
                                now.getDate(),
                                19,
                                1,
                                0,
                            );
                        })(),
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Choose date"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: DateMessage = {
                        key: `${Date.now()}-date-picker`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.Date,
                        minDate: (() => {
                            const now = new Date();
                            return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
                        })(),
                        maxDate: (() => {
                            const now = new Date();
                            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
                        })(),
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
            <UIBoxButton
                title="Choose time"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: TimeMessage = {
                        key: `${Date.now()}-time-picker`,
                        status: MessageStatus.Received,
                        type: InteractiveMessageType.Time,
                        minTime: (() => {
                            const now = new Date();
                            return new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate(),
                                12,
                                15,
                            );
                        })(),
                        maxTime: (() => {
                            const now = new Date();
                            return new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate(),
                                13,
                                0,
                            );
                        })(),
                        // isAmPmTime: false,
                        interval: 5,
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />

            <UIBoxButton
                title="Choose country"
                layout={{
                    marginBottom: 10,
                }}
                onPress={() => {
                    const message: CountryMessage = {
                        key: `${Date.now()}-country-picker`,
                        type: InteractiveMessageType.Country,
                        status: MessageStatus.Received,
                        onSelect: (externalState: any) => {
                            addMessage({
                                ...message,
                                externalState,
                            });
                        },
                    };
                    addMessage(message);
                    setMenuVisible(false);
                }}
            />
        </ScrollView>
    );
}

export function Browser() {
    const theme = useTheme();

    const [isNoticeVisible, setNoticeVisible] = React.useState(false);
    const [messages, setMessages] = React.useState<BrowserMessage[]>([
        {
            key: `${Date.now()}-initial`,
            type: ChatMessageType.PlainText,
            status: MessageStatus.Received,
            text: 'This is browser!',
        },
    ]);
    const [isUsingSecCard, setUsingSecCard] = React.useState(false);

    const menuVisible = useStore(({ menuVisible: _menuVisible }) => _menuVisible);

    const onPressUrl = React.useCallback(url => {
        console.log('url handled', url);
    }, []);

    const onLongPressText = React.useCallback(text => {
        Clipboard.setString(text);
        console.log('long press handled', text);
        setNoticeVisible(true);
    }, []);

    const hideNotice = React.useCallback(() => {
        setNoticeVisible(false);
    }, []);

    const base64Image = useBase64Image(imageUrl.medium);
    const base64PreviewImage = useBase64Image(imageUrl.small);

    return (
        <>
            <UIBrowser
                messages={messages}
                onPressUrl={onPressUrl}
                onLongPressText={onLongPressText}
            />
            <UIFullscreenSheet
                visible={menuVisible}
                onClose={() => {
                    setMenuVisible(false);
                }}
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    padding: 20,
                    borderRadius: 10,
                }}
            >
                <BrowserAddMenu
                    addMessage={message => {
                        setMessages([message, ...messages]);
                    }}
                    setUsingSecCard={setUsingSecCard}
                    base64Image={base64Image}
                    base64PreviewImage={base64PreviewImage}
                />
            </UIFullscreenSheet>
            <UICardSheet visible={isUsingSecCard}>
                <View
                    style={{
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <UILabel>Pretending to using a security card...</UILabel>
                </View>
            </UICardSheet>
            <UIPopup.Notice
                visible={isNoticeVisible}
                title={uiLocalized.MessageCopiedToClipboard}
                type={UIPopup.Notice.Type.BottomToast}
                color={UIPopup.Notice.Color.Primary}
                onClose={hideNotice}
            />
        </>
    );
}
