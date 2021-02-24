import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import {
    InteractiveMessageType,
    UIBrowser,
    BrowserMessage,
} from '@tonlabs/uikit.browser';
import { ChatMessageType, MessageStatus } from '@tonlabs/uikit.chats';
import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

const BrowserStack = createStackNavigator();

const BrowserScreen = () => {
    const [messages, setMessages] = React.useState<BrowserMessage[]>([
        // {
        //     type: 'AddressInput',
        //     prompt: 'What wallet do you want to work with?',
        //     mainAddress: '0:000',
        //     input: {
        //         validateAddress: (text: string) => {
        //             if (text.length > 0 && text.length % 5 === 0) {
        //                 return Promise.resolve({
        //                     status: 'ERROR',
        //                     text: 'Oh no, the length is divided by 5',
        //                 });
        //             }
        //             return Promise.resolve({
        //                 status: 'NONE',
        //             });
        //         },
        //     },
        //     qrCode: {
        //         parseData: (data) => {
        //             return '0:000';
        //         },
        //     },
        //     onSelect: (selectedButtonString: string, address: string) => {
        //         setMessages([
        //             {
        //                 key: `${Date.now()}-address-input2`,
        //                 type: 'stm',
        //                 status: 'sent',
        //                 time: Date.now(),
        //                 sender: '0:000',
        //                 text: address,
        //             },
        //             {
        //                 key: `${Date.now()}-address-input1`,
        //                 type: 'stm',
        //                 status: 'sent',
        //                 time: Date.now(),
        //                 sender: '0:000',
        //                 text: selectedButtonString,
        //             },
        //             ...messages.slice(1),
        //         ]);
        //     },
        // },
        {
            type: InteractiveMessageType.Terminal,
            prompt: 'Type sth!',
            onSendText: (text) => {
                setMessages([
                    {
                        key: `${Date.now()}-terminal`,
                        type: ChatMessageType.PlainText,
                        status: MessageStatus.Sent,
                        text,
                    },
                    ...messages.slice(1),
                ]);
            },
        },
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
                    headerShown: false,
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
