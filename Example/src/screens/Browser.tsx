import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Route, useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BigNumber from 'bignumber.js';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    InteractiveMessageType,
    UIBrowser,
    BrowserMessage,
    ValidationResultStatus,
} from '@tonlabs/uikit.browser';
import type {
    AddressInputMessage,
    ConfirmMessage,
    MenuMessage,
    TerminalMessage,
    AmountInputMessage,
    SigningBoxMessage,
} from '@tonlabs/uikit.browser';
import { UIButton } from '@tonlabs/uikit.components';
import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import {
    useTheme,
    ColorVariants,
    UIBottomSheet,
    UICardSheet,
    UILabel,
    UILabelColors,
} from '@tonlabs/uikit.hydrogen';

const BrowserStack = createStackNavigator();

const BrowserScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<Route<'browser', { menuVisible: boolean }>>();

    const theme = useTheme();

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

    const { menuVisible } = route.params;

    return (
        <>
            <UIBrowser messages={messages} />
            <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                    <UIBottomSheet
                        visible={
                            typeof menuVisible === 'string'
                                ? false
                                : menuVisible
                        }
                        onClose={() => {
                            navigation.setParams({
                                menuVisible: false,
                            });
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
                        <UIButton
                            title="Add AddressInput"
                            onPress={() => {
                                const message: AddressInputMessage = {
                                    key: `${Date.now()}-address-input`,
                                    status: MessageStatus.Received,
                                    type: InteractiveMessageType.AddressInput,
                                    prompt:
                                        'What wallet do you want to work with?',
                                    mainAddress: '0:000',
                                    input: {
                                        validateAddress: (text: string) => {
                                            if (
                                                text.length > 0 &&
                                                text.length % 5 === 0
                                            ) {
                                                return Promise.resolve({
                                                    status:
                                                        ValidationResultStatus.Error,
                                                    text:
                                                        'Oh no, the length is divided by 5',
                                                });
                                            }
                                            return Promise.resolve({
                                                status:
                                                    ValidationResultStatus.None,
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
                                                    description: 'My Crystals',
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
                                navigation.setParams({
                                    menuVisible: false,
                                });
                            }}
                            style={{
                                marginBottom: 10,
                            }}
                        />
                        <UIButton
                            title="Add TerminalInput"
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
                                navigation.setParams({
                                    menuVisible: false,
                                });
                            }}
                            style={{
                                marginBottom: 10,
                            }}
                        />
                        <UIButton
                            title="Add Menu"
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
                                    ],
                                };
                                setMessages([message, ...messages]);
                                navigation.setParams({
                                    menuVisible: false,
                                });
                            }}
                            style={{
                                marginBottom: 10,
                            }}
                        />
                        <UIButton
                            title="Add Confirm"
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
                                navigation.setParams({
                                    menuVisible: false,
                                });
                            }}
                            style={{
                                marginBottom: 10,
                            }}
                        />
                        <UIButton
                            title="Add AmountInput"
                            onPress={() => {
                                const message: AmountInputMessage = {
                                    key: `${Date.now()}-amount`,
                                    status: MessageStatus.Received,
                                    type: InteractiveMessageType.AmountInput,
                                    prompt: 'Enter amount:',
                                    decimals: 9,
                                    min: new BigNumber('10.25').multipliedBy(
                                        10 ** 9,
                                    ),
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
                                navigation.setParams({
                                    menuVisible: false,
                                });
                            }}
                            style={{
                                marginBottom: 10,
                            }}
                        />
                        <UIButton
                            title="Add SigningBoxInput"
                            onPress={() => {
                                const message: SigningBoxMessage = {
                                    key: `${Date.now()}-signing-box`,
                                    status: MessageStatus.Received,
                                    type: InteractiveMessageType.SigningBox,
                                    signingBoxes,
                                    onAddSigningBox: (privateKey: string) => {
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

                                        return Promise.resolve(newSigningBox);
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
                                navigation.setParams({
                                    menuVisible: false,
                                });
                            }}
                        />
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
};

export const Browser = () => {
    const theme = useTheme();
    return (
        <BrowserStack.Navigator>
            <BrowserStack.Screen
                name="BrowserScreen"
                options={({ navigation }) => ({
                    // headerShown: false,
                    title: 'Browser',
                    headerTitleStyle: {
                        color: theme[ColorVariants.TextPrimary],
                    },
                    headerStyle: {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                    cardStyle: {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                    headerRight: () => {
                        return (
                            <TouchableOpacity
                                style={{ marginRight: 16 }}
                                onPress={() => {
                                    navigation.setParams({
                                        menuVisible: true,
                                    });
                                }}
                            >
                                <UILabel color={UILabelColors.TextAccent}>
                                    Add
                                </UILabel>
                            </TouchableOpacity>
                        );
                    },
                })}
                component={BrowserScreen}
                initialParams={{
                    menuVisible: false,
                }}
            />
        </BrowserStack.Navigator>
    );
};
