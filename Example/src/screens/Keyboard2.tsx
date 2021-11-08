import * as React from 'react';
import { View, TextInput, ScrollView } from 'react-native';

import { useKeyboardBottomInset } from '@tonlabs/uicast.keyboard';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export function KeyboardScreen2() {
    const bottom = useKeyboardBottomInset();

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: -1 * bottom.value,
                },
            ],
        };
    });

    return (
        <View style={{ flex: 1, position: 'relative', marginTop: 50 }}>
            <ScrollView keyboardDismissMode="interactive">
                <View style={{ height: 1000 }} />
            </ScrollView>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        height: 100,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,0,0,.1)',
                    },
                    style,
                ]}
            >
                <TextInput placeholder="Tap me" />
            </Animated.View>
        </View>
    );
}
