import * as React from 'react';
import { Text, View } from 'react-native';

import { UIBadge, UIDot, UISeparator, UITag } from '@tonlabs/uikit.components';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Design = () => (
    <ExampleScreen>
        <ExampleSection title="UIBadge">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBadge badge={1} />
            </View>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIDot</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDot />
            </View>
        </ExampleSection>
        <ExampleSection title="UISeparator">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UISeparator style={{ width: 300 }} />
            </View>
        </ExampleSection>
        <ExampleSection title="UITag">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITag title="Tag title" />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
