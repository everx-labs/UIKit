import * as React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILabel } from '@tonlabs/uikit.themes';
import { UIInputAccessoryView, useCustomKeyboard } from '@tonlabs/uicast.keyboard';
import { useStickers } from '@tonlabs/uistory.stickers';

import { ExampleScreen } from '../components/ExampleScreen';

const stickers = new Array(10).fill(null).map((_a, i) => ({
    id: `test${i}`,
    date: Date.now(),
    description: '',
    name: 'test',
    stickers: new Array(4).fill(null).map((_b, j) => ({
        name: `crown${j}`,
        url: 'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
    })),
}));

export function KeyboardScreen() {
    const insets = useSafeAreaInsets();
    const inverted = false;

    const inputRef = React.useRef<TextInput>(null);
    const cStickers = useStickers(stickers, (/* sticker */) => {
        return true;
    });
    const { customKeyboardView, dismiss, toggle } = useCustomKeyboard(inputRef, cStickers);

    return (
        <>
            <ExampleScreen
                nativeID="keyboardScreenScrollView"
                keyboardDismissMode="interactive"
                style={inverted ? styles.verticallyInverted : null}
                // @ts-ignore
                inverted={inverted}
                // style={{
                //     backgroundColor: 'blue',
                // }}
                contentContainerStyle={{
                    backgroundColor: 'rgba(0,0,255,.2)',
                    alignItems: 'center',
                    ...(inverted ? { paddingBottom: insets.top } : { paddingTop: insets.bottom }),
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        inputRef.current?.focus();
                    }}
                >
                    <UILabel>Press</UILabel>
                </TouchableOpacity>
                <UILabel style={inverted ? styles.verticallyInverted : null}>Hi there!</UILabel>
                {new Array(30)
                    .fill(null)
                    .map((_i, j) => j)
                    .map(i => {
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    { paddingVertical: 10 },
                                    inverted ? styles.verticallyInverted : null,
                                ]}
                            >
                                <UILabel>Press {i}</UILabel>
                            </TouchableOpacity>
                        );
                    })}
            </ExampleScreen>
            <UIInputAccessoryView
                managedScrollViewNativeID="keyboardScreenScrollView"
                customKeyboardView={customKeyboardView}
            >
                <View
                    style={{
                        height: 100,
                        width: '100%',
                        backgroundColor: 'rgba(255,0,0,.3)',
                        padding: 20,
                    }}
                >
                    <TextInput
                        ref={inputRef}
                        autoCompleteType="off"
                        autoCorrect={false}
                        nativeID="test-input-for-keyboard"
                        style={{ flex: 1, backgroundColor: 'red' }}
                        placeholder="Type here"
                        onFocus={dismiss}
                        onBlur={() => console.log("why I'm blured?")}
                    />
                    <TouchableOpacity onPress={toggle}>
                        <UILabel>Press</UILabel>
                    </TouchableOpacity>
                </View>
            </UIInputAccessoryView>
        </>
    );
}

const styles = StyleSheet.create({
    verticallyInverted: {
        transform: [{ scaleY: -1 }],
    },
});
