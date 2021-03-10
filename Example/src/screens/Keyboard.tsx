import * as React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILabel } from '@tonlabs/uikit.hydrogen';
import {
    // @ts-ignore
    UIInputAccessoryView,
} from '@tonlabs/uikit.keyboard';

import { ExampleScreen } from '../components/ExampleScreen';

export function KeyboardScreen() {
    const insets = useSafeAreaInsets();
    const inverted = true;
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
            <UIInputAccessoryView managedScrollViewNativeID="keyboardScreenScrollView">
                <View
                    style={{
                        height: 100,
                        width: '100%',
                        backgroundColor: 'rgba(255,0,0,.3)',
                        padding: 20,
                    }}
                >
                    <TextInput
                        style={{ flex: 1, backgroundColor: 'red' }}
                        placeholder="Type here"
                    />
                    <TouchableOpacity>
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
