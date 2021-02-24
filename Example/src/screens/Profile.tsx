import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { UIStyle } from '@tonlabs/uikit.core';
import {
    UIProfileInitials,
    UIProfilePhoto,
    UIProfileView,
} from '@tonlabs/uikit.legacy';
import { UIAssets } from '@tonlabs/uikit.assets';

export const Profile = () => (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIProfileInitials</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIProfileInitials
                containerStyle={[
                    UIStyle.margin.bottomDefault(),
                    UIStyle.margin.rightDefault(),
                ]}
                id={1}
                initials="AM"
            />
        </View>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIProfilePhoto</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIProfilePhoto source={UIAssets.icons.security.faceId} />
        </View>
        <View
            style={{
                width: '96%',
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: '2%',
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
            }}
        >
            <Text>UIProfilePhoto</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIProfileView
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
    </ScrollView>
);
