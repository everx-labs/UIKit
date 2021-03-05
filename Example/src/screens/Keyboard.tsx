import * as React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';

import { UILabel } from '@tonlabs/uikit.hydrogen';
import {
    // @ts-ignore
    UIInputAccessoryView,
} from '@tonlabs/uikit.keyboard';

import { ExampleScreen } from '../components/ExampleScreen';

export function KeyboardScreen() {
    return (
        <>
            <ExampleScreen>
                <UILabel>Hi there!</UILabel>
                <TouchableOpacity>
                    <UILabel>Press</UILabel>
                </TouchableOpacity>
                <TouchableOpacity>
                    <UILabel>Press</UILabel>
                </TouchableOpacity>
                <TouchableOpacity>
                    <UILabel>Press</UILabel>
                </TouchableOpacity>
                <TouchableOpacity>
                    <UILabel>Press</UILabel>
                </TouchableOpacity>
            </ExampleScreen>
            <UIInputAccessoryView>
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
