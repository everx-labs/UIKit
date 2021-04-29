import * as React from 'react';
import { View } from 'react-native';

import { UILightweightChart } from '@tonlabs/uikit.components';
// import { default as UILightweightChart } from '../../../packages/components/src/UILightweightChart'; // @FIXME remove direct import
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Chart = () => (
    <ExampleScreen>
        <ExampleSection title="LightweightChart">
            <View style={{ width: 500, paddingVertical: 20, }}>
                <UILightweightChart
                    testID="uiActionImage_default"
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
