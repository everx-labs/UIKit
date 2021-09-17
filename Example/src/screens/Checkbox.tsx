import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { UILabel, UISwitcher, UISwitcherVariant } from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Checkbox = () => {
    const [switcherSelected, setSwitcherSelected] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UISwitcher">
                <View
                    style={{
                        width: 100,
                        paddingVertical: 20,
                        alignItems: 'stretch',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <UILabel>Radio:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Radio}
                            active={switcherSelected}
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <UILabel>Check:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Check}
                            active={switcherSelected}
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <UILabel>Select:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Select}
                            active={switcherSelected}
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <UILabel>Toggle:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Toggle}
                            active={switcherSelected}
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                </View>
            </ExampleSection>
            <ExampleSection title="UISwitcher disabled ">
                <View
                    style={{
                        width: 100,
                        paddingVertical: 20,
                        alignItems: 'stretch',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <UILabel>Radio:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Radio}
                            active={switcherSelected}
                            disabled
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <UILabel>Check:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Check}
                            active={switcherSelected}
                            disabled
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <UILabel>Select:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Select}
                            active={switcherSelected}
                            disabled
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <UILabel>Toggle:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Toggle}
                            active={switcherSelected}
                            disabled
                            onPress={() => {
                                console.log('onPress', switcherSelected);
                                setSwitcherSelected(prev => !prev);
                            }}
                        />
                    </View>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
