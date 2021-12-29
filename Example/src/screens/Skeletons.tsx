import * as React from 'react';
import { View } from 'react-native';

import { UISkeleton } from '@tonlabs/uikit.layout';
import { UIBoxButton } from '@tonlabs/uikit.controls';

import { ExampleScreen } from '../components/ExampleScreen';
import { ExampleSection } from '../components/ExampleSection';

export function SkeletonsScreen() {
    const [isActive, setIsActive] = React.useState(true);
    return (
        <ExampleScreen>
            <ExampleSection title="UISkeleton">
                <View
                    testID="ui-skeleton"
                    style={{
                        maxWidth: 500,
                        width: '100%',
                        alignItems: 'stretch',
                        marginBottom: 50,
                    }}
                >
                    <UISkeleton show={isActive} style={{ alignSelf: 'center' }}>
                        <View
                            style={{ backgroundColor: 'rgba(255,0,0,.1)', width: 100, height: 100 }}
                        />
                    </UISkeleton>
                    <UISkeleton show={isActive} style={{ marginTop: 10 }}>
                        <View style={{ backgroundColor: 'rgba(255,0,0,.1)', height: 100 }} />
                    </UISkeleton>
                    <View style={{ flexDirection: 'row' }}>
                        <UISkeleton show={isActive} style={{ marginTop: 10, marginRight: 20 }}>
                            <View
                                style={{
                                    backgroundColor: 'rgba(255,0,0,.1)',
                                    width: 100,
                                    height: 100,
                                }}
                            />
                        </UISkeleton>
                        <View style={{ flex: 1 }}>
                            <UISkeleton show={isActive} style={{ marginTop: 10 }}>
                                <View style={{ backgroundColor: 'rgba(255,0,0,.1)', height: 30 }} />
                            </UISkeleton>
                            <UISkeleton show={isActive} style={{ marginTop: 10 }}>
                                <View style={{ backgroundColor: 'rgba(255,0,0,.1)', height: 30 }} />
                            </UISkeleton>
                            <UISkeleton show={isActive} style={{ marginTop: 10 }}>
                                <View style={{ backgroundColor: 'rgba(255,0,0,.1)', height: 30 }} />
                            </UISkeleton>
                        </View>
                    </View>
                </View>
                <UIBoxButton title="Toggle skeletons" onPress={() => setIsActive(!isActive)} />
            </ExampleSection>
        </ExampleScreen>
    );
}
