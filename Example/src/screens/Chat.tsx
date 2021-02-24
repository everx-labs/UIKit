import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BigNumber from 'bignumber.js';

import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';
import { UIChatInput, UIChatList } from '@tonlabs/uikit.chats';
import { useStickers } from '@tonlabs/uikit.stickers';

const initialMessages = [
    {
        type: 'stm',
        status: 'received',
        time: Math.floor(Date.now() - 4 * 60 * 1000),
        sender: '0:000',
        text: 'This one is from me',
    },
    {
        type: 'stm',
        status: 'received',
        time: Math.floor(Date.now() - 5 * 60 * 1000),
        sender: '0:123',
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
        type: 'stm',
        status: 'sent',
        time: Math.floor(Date.now() - 4 * 60 * 1000),
        sender: '0:000',
        text: 'This one is from me',
    },
    {
        type: 'stm',
        status: 'sent',
        time: Math.floor(Date.now() - 5 * 60 * 1000),
        sender: '0:123',
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
        type: 'act',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        textMode: 'fit',
    },
    {
        type: 'act',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        textMode: 'fit',
    },
    {
        type: 'act',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        textMode: 'ellipsize',
    },
    {
        type: 'act',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        textMode: 'ellipsize',
    },
    {
        type: 'act',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        text: 'This is action',
    },
    {
        type: 'act',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        text: 'This is action',
    },
    {
        type: 'stk',
        status: 'pending',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        source: {
            uri:
                'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
        },
    },
    {
        type: 'stk',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        source: {
            uri:
                'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
        },
    },
    {
        type: 'stk',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:123',
        source: {
            uri:
                'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
        },
    },
    {
        type: 'sys',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000), // TODO: is this mandatory field for system message?
        sender: '0:000', // TODO: is this mandatory field for system message?
        text: 'This is a system message',
    },
    {
        type: 'trx',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'income',
            amount: new BigNumber(1),
            balanceChange: '1.000',
        },
        comment: {
            text: 'Pocket money 😅🎉🤔😂🙏😔',
            // text: 'Pocket money 😅🎉🤔😂🙏😔😮👆👍❤️😍☺️😊😘😭😩',
            encrypted: true,
        },
        onPress() {
            console.log('hey');
        },
    },
    {
        type: 'trx',
        status: 'aborted',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'expense',
            amount: new BigNumber(1),
        },
        comment: {
            text: 'Pocket money',
        },
        onPress() {
            console.log('hey');
        },
    },
    {
        type: 'trx',
        status: 'aborted',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'income',
            amount: new BigNumber(1),
        },
    },
    {
        type: 'trx',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'expense',
            amount: new BigNumber(1),
            text: 'Sent',
        },
        comment: {
            text: 'Some money',
            encrypted: true,
        },
    },
    {
        type: 'trx',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'expense',
            amount: new BigNumber(1),
            text: 'Sent',
        },
    },
    {
        type: 'trx',
        status: 'sent',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'income',
            amount: new BigNumber(9999.123456789),
            text: 'Received',
        },
    },
    {
        type: 'trx',
        status: 'received',
        time: Math.floor(Date.now() - 1 * 60 * 1000),
        sender: '0:000',
        info: {
            type: 'income',
            amount: new BigNumber(1),
            text: 'Received',
        },
        comment: {
            text: 'Take it',
            encrypted: true,
        },
    },
    {
        type: 'stm',
        status: 'aborted',
        time: Math.floor(Date.now() - 5 * 60 * 1000),
        sender: '0:123',
        text: "I'm aborted one!",
    },
    // ...new Array(100).fill(null).reduce((acc, n, i) => {
    //     acc.push({
    //         type: 'stm',
    //         status: 'pending',
    //         time: Math.floor(Date.now() - 1 * 60 * 1000),
    //         sender: '0:000',
    //         text: 'This one is in process of sending...',
    //     });
    //     acc.push({
    //         type: 'stm',
    //         status: 'received',
    //         time: Math.floor(Date.now() - 2 * 60 * 1000),
    //         sender: '0:123',
    //         text: 'How r u?',
    //     });
    //     acc.push({
    //         type: 'stm',
    //         status: 'sent',
    //         time: Math.floor(Date.now() - 4 * 60 * 1000),
    //         sender: '0:000',
    //         text: 'This one is from me',
    //     });
    //     acc.push({
    //         type: 'stm',
    //         status: 'received',
    //         time: Math.floor(Date.now() - 5 * 60 * 1000),
    //         sender: '0:123',
    //         text:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //     });
    //     acc.push({
    //         type: 'stm',
    //         status: 'received',
    //         time: Math.floor(Date.now() - 5 * 60 * 1000),
    //         sender: '0:123',
    //         text: 'Hi there!',
    //     });
    //     acc.push({
    //         type: 'stm',
    //         status: 'received',
    //         time: new Date('10 06 2020 10:00').getTime(),
    //         sender: '0:123',
    //         text: 'Hi from past!',
    //     });
    //     return acc;
    // }, []),
].map((m: any, i: number) => {
    // eslint-disable-next-line no-param-reassign
    m.key = i;
    return m;
});

const stickers = new Array(10).fill(null).map((_a, i) => ({
    id: `test${i}`,
    date: Date.now(),
    description: '',
    name: 'test',
    stickers: new Array(4).fill(null).map((_b, j) => ({
        name: `crown${j}`,
        url:
            'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
    })),
}));

// const shortcuts = [
//     {
//         title: "I'm a danger shortcut!",
//         onPress: () => console.log('shortcut pressed!'),
//         isDanger: true,
//     },
//     {
//         title: "I'm a shortcut!",
//         onPress: () => console.log('shortcut pressed!'),
//     },
// ];

const ChatStack = createStackNavigator();

const ChatWindowScreen = () => {
    const [bottomInset, setBottomInset] = React.useState<number>(0);
    const [messages, setMessages] = React.useState(initialMessages);
    const onLoadEarlierMessages = React.useCallback(() => undefined, []);
    const onSendMedia = React.useCallback(() => undefined, []);
    const onSendDocument = React.useCallback(() => undefined, []);
    const onItemSelected = React.useCallback(
        (_id, stk) => {
            setMessages([
                {
                    key: `${Date.now()}stk`,
                    type: 'stk',
                    status: 'sent',
                    time: Date.now(),
                    sender: '0:000',
                    source: {
                        uri: stk.url,
                    },
                },
                ...messages,
            ]);
        },
        [messages, setMessages],
    );
    const stickersKeyboard = useStickers(stickers, onItemSelected);

    return (
        <>
            <UIChatList
                onLoadEarlierMessages={onLoadEarlierMessages}
                canLoadMore
                isLoadingMore={false}
                isCustomKeyboardVisible={false}
                messages={messages}
                bottomInset={bottomInset}
            />
            <UIChatInput
                editable
                onSendText={(text) => {
                    setMessages([
                        {
                            key: `${Date.now()}1`,
                            type: 'stm',
                            status: 'sent',
                            time: Date.now(),
                            sender: '0:000',
                            text,
                        },
                        // {
                        //     key: `${Date.now()}2`,
                        //     type: 'stm',
                        //     status: 'sent',
                        //     time: Date.now(),
                        //     sender: '0:000',
                        //     text,
                        // },
                        // {
                        //     key: `${Date.now()}3`,
                        //     type: 'stm',
                        //     status: 'sent',
                        //     time: Date.now(),
                        //     sender: '0:000',
                        //     text,
                        // },
                        ...messages,
                    ]);
                }}
                onSendMedia={onSendMedia}
                onSendDocument={onSendDocument}
                onHeightChange={setBottomInset}
                customKeyboard={stickersKeyboard}
            />
        </>
    );
};

export const Chat = () => {
    const theme = useTheme();
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen
                name="ChatWindow"
                options={{
                    headerShown: false,
                    title: 'Chat',
                    cardStyle: {
                        backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    },
                }}
                component={ChatWindowScreen}
            />
        </ChatStack.Navigator>
    );
};
