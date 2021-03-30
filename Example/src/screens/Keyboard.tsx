import * as React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    AppRegistry,
    Keyboard,
    KeyboardEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILabel, useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';
import {
    // @ts-ignore
    UIInputAccessoryView,
} from '@tonlabs/uikit.keyboard';
import { useStickers } from '@tonlabs/uikit.stickers';

import { ExampleScreen } from '../components/ExampleScreen';

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

export function KeyboardScreen() {
    const insets = useSafeAreaInsets();
    const inverted = true;
    const cStickers = useStickers(stickers, () => undefined);
    const theme = useTheme();
    const cKeyboard = React.useMemo(
        () => ({
            moduleName: cStickers.kbID,
            component: cStickers.component,
            initialProps: cStickers.props,
            backgroundColor: theme[ColorVariants.BackgroundSecondary],
        }),
        [cStickers, theme],
    );
    const [customKeyboard, setCustomKeyboard] = React.useState<
        typeof cKeyboard | null
    >(null);
    const cKeyboardRef = React.useRef<typeof cKeyboard | null>(null);

    React.useEffect(() => {
        const callback = ({ duration }: KeyboardEvent) => {
            if (cKeyboardRef.current == null) {
                return;
            }

            setTimeout(() => {
                setCustomKeyboard(null);
            }, duration);
        };
        Keyboard.addListener('keyboardWillHide', callback);

        return () => {
            Keyboard.removeListener('keyboardWillHide', callback);
        };
    }, []);

    const inputRef = React.useRef<TextInput>(null);

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
                    ...(inverted
                        ? { paddingBottom: insets.top }
                        : { paddingTop: insets.bottom }),
                }}
            >
                <UILabel style={inverted ? styles.verticallyInverted : null}>
                    Hi there!
                </UILabel>
                {new Array(30)
                    .fill(null)
                    .map((_i, j) => j)
                    .map((i) => {
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
                customKeyboardView={customKeyboard}
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
                        onFocus={() => {
                            setCustomKeyboard(null);
                            cKeyboardRef.current = null;

                            // setTimeout(() => {
                            //     inputRef.current?.focus();
                            // }, 100);
                            // setTimeout(() => {
                            //     inputRef.current?.focus();
                            // }, 200);
                            // setTimeout(() => {
                            //     inputRef.current?.focus();
                            // }, 300);
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            inputRef.current?.blur();
                            setCustomKeyboard(
                                customKeyboard == null ? cKeyboard : null,
                            );
                            cKeyboardRef.current =
                                customKeyboard == null ? cKeyboard : null;
                        }}
                    >
                        <UILabel>Press</UILabel>
                    </TouchableOpacity>
                </View>
            </UIInputAccessoryView>
        </>
    );
}

AppRegistry.registerComponent('TestCustomKeyboard', () => () => (
    <View style={{ flex: 1, backgroundColor: 'rgba(0, 255, 0, .5)' }} />
));

const styles = StyleSheet.create({
    verticallyInverted: {
        transform: [{ scaleY: -1 }],
    },
});
