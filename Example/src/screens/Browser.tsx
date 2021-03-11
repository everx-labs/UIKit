import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Route, useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
} from '@tonlabs/uikit.browser';
import { UIButton } from '@tonlabs/uikit.components';
import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import {
    useTheme,
    ColorVariants,
    UIBottomSheet,
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
                                    onSelect: (state: any) => {
                                        setMessages([
                                            {
                                                ...message,
                                                externalState: {
                                                    ...state,
                                                    answer: `${state.chosenHandlerId} was chosen`,
                                                },
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
                                    min: 10 * 10 ** 9,
                                    max: 100 * 10 ** 9,
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
                        />
                    </UIBottomSheet>
                )}
            </SafeAreaInsetsContext.Consumer>
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
