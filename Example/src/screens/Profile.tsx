import * as React from 'react';
import { View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import {
    UIProfileInitials,
    UIProfilePhoto,
    UIProfileView,
} from '@tonlabs/uikit.legacy';
import { UIAssets } from '@tonlabs/uikit.assets';
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
                    containerStyle={[
                        UIStyle.margin.bottomDefault(),
                        UIStyle.margin.rightDefault(),
                    ]}
                    id={1}
                    initials="AM"
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIProfilePhoto">
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UIProfilePhoto testID="uiProfilePhoto_default" source={UIAssets.icons.security.faceId} />
            </View>
        </ExampleSection>
        <ExampleSection title="UIProfileView">
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UIProfileView
                    testID="uiProfileView_default"
                    editable
                    containerStyle={{ marginRight: 16 }}
                    photo={UIAssets.icons.security.faceId}
                    hasSecondName
                    name="John"
                    secondName="Doe"
                    namePlaceholder="Name"
                    secondNamePlaceholder="Second name"
                    details="Details"
                    autoCapitalize="words"
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
