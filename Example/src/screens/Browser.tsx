import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Route, useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import type BigNumber from 'bignumber.js';

import { UIConstant } from '@tonlabs/uikit.core';
import {
    InteractiveMessageType,
    UIBrowser,
    BrowserMessage,
    ValidationResultStatus,
    BrowserMessageType,
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
import { uiLocalized } from '@tonlabs/uikit.localization';

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
                                setMessages([
                                    {
                                        type:
                                            InteractiveMessageType.AddressInput,
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
                                                        description:
                                                            'My Crystals',
                                                    })),
                                            },
                                        ],
                                        onSelect: (
                                            selectedButtonString: string,
                                            address: string,
                                        ) => {
                                            setMessages([
                                                {
                                                    key: `${Date.now()}-address-input2`,
                                                    type:
                                                        ChatMessageType.PlainText,
                                                    status: MessageStatus.Sent,
                                                    text: address,
                                                },
                                                {
                                                    key: `${Date.now()}-address-input1`,
                                                    type:
                                                        ChatMessageType.PlainText,
                                                    status: MessageStatus.Sent,
                                                    text: selectedButtonString,
                                                },
                                                ...messages,
                                            ]);
                                        },
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
                                setMessages([
                                    {
                                        type: InteractiveMessageType.Terminal,
                                        prompt: 'Type sth!',
                                        onSendText: (text: string) => {
                                            setMessages([
                                                {
                                                    key: `${Date.now()}-terminal`,
                                                    type:
                                                        ChatMessageType.PlainText,
                                                    status: MessageStatus.Sent,
                                                    text,
                                                },
                                                ...messages,
                                            ]);
                                        },
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
                            title="Add Menu"
                            onPress={() => {
                                setMessages([
                                    {
                                        type: InteractiveMessageType.Menu,
                                        title: 'Choose:',
                                        onSelect: (handlerId: number) => {
                                            setMessages([
                                                {
                                                    key: `${Date.now()}-menu`,
                                                    type:
                                                        ChatMessageType.PlainText,
                                                    status: MessageStatus.Sent,
                                                    text: `${handlerId} have been chosen`,
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
                            title="Add Confirm"
                            onPress={() => {
                                setMessages([
                                    {
                                        type: InteractiveMessageType.Confirm,
                                        prompt: 'Are you sure?',
                                        onConfirm: (isConfirmed: boolean) => {
                                            setMessages([
                                                isConfirmed
                                                    ? {
                                                          key: `${Date.now()}`,
                                                          status:
                                                              MessageStatus.Sent,
                                                          type:
                                                              BrowserMessageType.ConfirmSuccessful,
                                                      }
                                                    : {
                                                          key: `${Date.now()}`,
                                                          status:
                                                              MessageStatus.Sent,
                                                          type:
                                                              BrowserMessageType.ConfirmDeclined,
                                                      },
                                                ...messages,
                                            ]);
                                        },
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
                            title="Add AmountInput"
                            onPress={() => {
                                setMessages([
                                    {
                                        type:
                                            InteractiveMessageType.AmountInput,
                                        prompt: 'Enter amount:',
                                        decimal: 9,
                                        min: 10 * 10 ** 9,
                                        max: 100 * 10 ** 9,
                                        onSendAmount: (amount: BigNumber) => {
                                            setMessages([
                                                {
                                                    key: `${Date.now()}-amount`,
                                                    type:
                                                        ChatMessageType.PlainText,
                                                    status: MessageStatus.Sent,
                                                    text: uiLocalized.amountToLocale(
                                                        amount.dividedBy(
                                                            10 ** 9,
                                                        ),
                                                    ),
                                                },
                                                ...messages,
                                            ]);
                                        },
                                    },
                                    ...messages,
                                ]);
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
