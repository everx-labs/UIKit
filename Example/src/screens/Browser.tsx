import * as React from 'react';
import { useWindowDimensions, StatusBar } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BigNumber from 'bignumber.js';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    InteractiveMessageType,
    UIBrowser,
    BrowserMessage,
    ValidationResultStatus,
    QRCodeScannerMessage,
    EncryptionBoxMessage,
    DateMessage,
    TimeMessage,
} from '@tonlabs/uikit.browser';
import type {
    AddressInputMessage,
    ConfirmMessage,
    MenuMessage,
    TerminalMessage,
    AmountInputMessage,
    SigningBoxMessage,
    TransactionConfirmationMessage,
} from '@tonlabs/uikit.browser';
import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import {
    useTheme,
    ColorVariants,
    UIBoxButton,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';
import {
    UICardSheet,
    UIBottomSheet,
    createStackNavigator,
    ScrollView,
} from '@tonlabs/uikit.navigation';

import { useBase64Image } from './hooks/useBase64Image';

const IMAGE_URL =
    'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-original.jpeg?alt=media&token=8907ad38-4d43-47c1-8f80-fd272e617440';

const BrowserStack = createStackNavigator();

type BrowserScreenRef = { toggleMenu(): void };

const BrowserScreen = React.forwardRef<BrowserScreenRef>((_props, ref) => {
    const theme = useTheme();

    const base64Image = useBase64Image(IMAGE_URL);

    const [messages, setMessages] = React.useState<BrowserMessage[]>([
        {
            key: `${Date.now()}-initial`,
            type: ChatMessageType.PlainText,
            status: MessageStatus.Received,
            text: 'This is browser!',
        },
    ]);
    const [isUsingSecCard, setUsingSecCard] = React.useState(false);
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

    const [menuVisible, setMenuVisible] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        toggleMenu: () => {
            setMenuVisible(!menuVisible);
        },
    }));

    const onPressUrl = React.useCallback(() => {
        console.log('url handled');
    }, []);
    const { height } = useWindowDimensions();

    return (
        <>
            <UIBrowser messages={messages} onPressUrl={onPressUrl} />
            <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                    <UIBottomSheet
                        visible={menuVisible}
                        onClose={() => {
                            setMenuVisible(false);
                        }}
                        style={{
                            backgroundColor:
                                theme[ColorVariants.BackgroundPrimary],
                            padding: 20,
                            paddingBottom: Math.max(
                                insets?.bottom || 0,
                                UIConstant.contentOffset(),
                            ),
                            borderRadius: 10,
                        }}
                    >
                        <ScrollView
                            style={{
                                height:
                                    height -
                                    (StatusBar.currentHeight ?? 0) -
                                    100,
                            }}
                        >
                            <UIBoxButton
                                title="Add Media image"
                                layout={{
                                    marginBottom: 10,
                                }}
                                onPress={() => {
                                    const message: BrowserMessage = {
                                        key: `${Date.now()}-media-image`,
                                        status: MessageStatus.Received,
                                        type: ChatMessageType.Media,
                                        data: base64Image,
                                    };
                                    setMessages([
                                        {
                                            ...message,
                                        },
                                        ...messages,
                                    ]);
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
                                        type: ChatMessageType.QRCode,
                                        data: 'You are reading a message received through a QR code',
                                    };
                                    setMessages([
                                        {
                                            ...message,
                                        },
                                        ...messages,
                                    ]);
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
                                                if (
                                                    text.length > 0 &&
                                                    text.length % 5 === 0
                                                ) {
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
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            parseData: (_data: any) => {
                                                return Promise.resolve('0:000');
                                            },
                                        },
                                        select: [
                                            {
                                                title: 'Accounts',
                                                data: new Array(20)
                                                    .fill(null)
                                                    .map((_i, index) => ({
                                                        address: `0:000${index}`,
                                                        balance: `12${index}`,
                                                        description:
                                                            'My Crystals',
                                                    })),
                                            },
                                        ],
                                        onSelect: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([
                                        {
                                            ...message,
                                        },
                                        ...messages,
                                    ]);
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
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
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
                                    setMessages([message, ...messages]);
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
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                        min: new BigNumber(
                                            '10.25',
                                        ).multipliedBy(10 ** 9),
                                        max: new BigNumber('100').multipliedBy(
                                            10 ** 9,
                                        ),
                                        // min: new BigNumber(
                                        //     '100000000000000000000000.1111111',
                                        // ),
                                        // max: new BigNumber(
                                        //     '10000000000000000000000000.1111111',
                                        // ),
                                        onSend: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                        onAddSigningBox: (
                                            privateKey: string,
                                        ) => {
                                            const newSigningBox = {
                                                id:
                                                    signingBoxes[
                                                        signingBoxes.length - 1
                                                    ].id + 1,
                                                title: 'Signature',
                                                publicKey: privateKey,
                                            };
                                            setSigningBoxes([
                                                ...signingBoxes,
                                                newSigningBox,
                                            ]);
                                            setMessages([
                                                {
                                                    ...message,
                                                    signingBoxes: [
                                                        ...signingBoxes,
                                                        newSigningBox,
                                                    ],
                                                },
                                                ...messages,
                                            ]);

                                            return Promise.resolve(
                                                newSigningBox,
                                            );
                                        },
                                        onUseSecurityCard: () => {
                                            setUsingSecCard(true);

                                            return new Promise((resolve) => {
                                                setTimeout(() => {
                                                    setUsingSecCard(false);
                                                    resolve(true);
                                                }, 1000);
                                            });
                                        },
                                        onSelect: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                        onAddEncryptionBox: (
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            _privateKey: string,
                                        ) => {
                                            const newEncryptionBox = {
                                                id:
                                                    encryptionBoxes[
                                                        encryptionBoxes.length -
                                                            1
                                                    ].id + 1,
                                                title: 'Cipher key',
                                            };
                                            setEncryptionBoxes([
                                                ...encryptionBoxes,
                                                newEncryptionBox,
                                            ]);
                                            setMessages([
                                                {
                                                    ...message,
                                                    encryptionBoxes: [
                                                        ...encryptionBoxes,
                                                        newEncryptionBox,
                                                    ],
                                                },
                                                ...messages,
                                            ]);

                                            return Promise.resolve(
                                                newEncryptionBox,
                                            );
                                        },
                                        onSelect: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
                                    setMenuVisible(false);
                                }}
                            />
                            <UIBoxButton
                                title="Add TransactionConfirmationMessage"
                                layout={{
                                    marginBottom: 10,
                                }}
                                onPress={() => {
                                    const message: TransactionConfirmationMessage =
                                        {
                                            key: `${Date.now()}-approve`,
                                            status: MessageStatus.Received,
                                            type: InteractiveMessageType.TransactionConfirmation,
                                            toAddress: '0:12300000006789',
                                            onAddressPress: () => {
                                                // nothing
                                            },
                                            recipientsCount: 255,
                                            totalAmount: (
                                                <UILabel>
                                                    <UILabel
                                                        role={
                                                            UILabelRoles.MonoText
                                                        }
                                                    >
                                                        0,000
                                                    </UILabel>
                                                    <UILabel
                                                        role={
                                                            UILabelRoles.MonoText
                                                        }
                                                        color={
                                                            UILabelColors.TextTertiary
                                                        }
                                                    >
                                                        .000 000 000
                                                    </UILabel>
                                                </UILabel>
                                            ),
                                            fees: (
                                                <UILabel>
                                                    <UILabel
                                                        role={
                                                            UILabelRoles.MonoText
                                                        }
                                                    >
                                                        0
                                                    </UILabel>
                                                    <UILabel
                                                        role={
                                                            UILabelRoles.MonoText
                                                        }
                                                        color={
                                                            UILabelColors.TextTertiary
                                                        }
                                                    >
                                                        .000 000 000
                                                    </UILabel>
                                                </UILabel>
                                            ),
                                            signature: {
                                                id: 1,
                                                title: 'My Surf',
                                                publicKey: '1c2f3b4a',
                                            },
                                            onApprove: (externalState: any) => {
                                                setMessages([
                                                    {
                                                        ...message,
                                                        externalState,
                                                    },
                                                    ...messages,
                                                ]);
                                            },
                                            onCancel: (externalState: any) => {
                                                setMessages([
                                                    {
                                                        ...message,
                                                        externalState,
                                                    },
                                                    ...messages,
                                                ]);
                                            },
                                        };
                                    setMessages([message, ...messages]);
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
                                        onScan: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        parseData: (_data: any) => {
                                            return Promise.resolve('0:000');
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        parseData: (_data: any) => {
                                            return Promise.resolve('0:000');
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                        minDate: new Date('07/01/2021'),
                                        onSelect: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
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
                                        minTime: new Date(0, 0, 0, 12, 15),
                                        maxTime: new Date(0, 0, 0, 13, 0),
                                        onSelect: (externalState: any) => {
                                            setMessages([
                                                {
                                                    ...message,
                                                    externalState,
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    };
                                    setMessages([message, ...messages]);
                                    setMenuVisible(false);
                                }}
                            />
                        </ScrollView>
                    </UIBottomSheet>
                )}
            </SafeAreaInsetsContext.Consumer>
            <UICardSheet
                visible={isUsingSecCard}
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    padding: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <UILabel>Pretending to using a security card...</UILabel>
            </UICardSheet>
        </>
    );
});

export const Browser = React.memo(() => {
    const screenRef = React.useRef<BrowserScreenRef>(null);
    return (
        <BrowserStack.Navigator>
            <BrowserStack.Screen
                name="BrowserScreen"
                options={{
                    // headerVisible: false,
                    title: 'Browser',
                    headerRightItems: [
                        {
                            label: 'Add',
                            onPress: () => {
                                screenRef.current?.toggleMenu();
                            },
                        },
                    ],
                }}
                initialParams={{
                    menuVisible: false,
                }}
            >
                {() => <BrowserScreen ref={screenRef} />}
            </BrowserStack.Screen>
        </BrowserStack.Navigator>
    );
});
