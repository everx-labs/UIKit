import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import {
    InteractiveMessageType,
    UIBrowser,
    BrowserMessage,
    ValidationResultStatus,
} from '@tonlabs/uikit.browser';
import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

const BrowserStack = createStackNavigator();

const BrowserScreen = () => {
    const [messages, setMessages] = React.useState<BrowserMessage[]>([
        {
            type: InteractiveMessageType.AddressInput,
            prompt: 'What wallet do you want to work with?',
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            onSelect: (selectedButtonString: string, address: string) => {
                setMessages([
                    {
                        key: `${Date.now()}-address-input2`,
                        type: ChatMessageType.PlainText,
                        status: MessageStatus.Sent,
                        text: address,
                    },
                    {
                        key: `${Date.now()}-address-input1`,
                        type: ChatMessageType.PlainText,
                        status: MessageStatus.Sent,
                        text: selectedButtonString,
                    },
                    ...messages.slice(1),
                ]);
            },
        },
        // {
        //     type: InteractiveMessageType.Menu,
        //     title: 'Choose:',
        //     onSelect: (handlerId: number) => {
        //         setMessages([
        //             {
        //                 key: `${Date.now()}-menu`,
        //                 type: ChatMessageType.PlainText,
        //                 status: MessageStatus.Sent,
        //                 text: `${handlerId} have been chosen`,
        //             },
        //             ...messages.slice(1),
        //         ]);
        //     },
        //     items: [
        //         {
        //             handlerId: 1,
        //             title: 'One',
        //         },
        //         {
        //             handlerId: 2,
        //             title: 'Two',
        //         },
        //         {
        //             handlerId: 3,
        //             title: 'Three',
        //         },
        //     ],
        // },
        // {
        //     type: InteractiveMessageType.Terminal,
        //     prompt: 'Type sth!',
        //     onSendText: (text: string) => {
        //         setMessages([
        //             {
        //                 key: `${Date.now()}-terminal`,
        //                 type: ChatMessageType.PlainText,
        //                 status: MessageStatus.Sent,
        //                 text,
        //             },
        //             ...messages.slice(1),
        //         ]);
        //     },
        // },
        {
            key: `${Date.now()}-initial`,
            type: ChatMessageType.PlainText,
            status: MessageStatus.Received,
            text: 'This is browser!',
        },
    ]);
    return <UIBrowser messages={messages} />;
};

export const Browser = () => {
    const theme = useTheme();
    return (
        <BrowserStack.Navigator>
            <BrowserStack.Screen
                name="BrowserScreen"
                options={{
                    // headerShown: false,
                    title: 'Browser',
                    cardStyle: {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                }}
                component={BrowserScreen}
            />
        </BrowserStack.Navigator>
    );
};
