import * as React from 'react';
import { View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import { UIProfileInitials } from '@tonlabs/uikit.legacy';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Profile = () => (
    <ExampleScreen>
        <ExampleSection title="UIProfileInitials">
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UIProfileInitials
                    testID="uiProfileInitials_default"
                    containerStyle={[UIStyle.margin.bottomDefault(), UIStyle.margin.rightDefault()]}
                    id={1}
                    initials="AM"
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
