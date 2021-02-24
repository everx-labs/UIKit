import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { UIBadge, UIDot, UISeparator, UITag } from '@tonlabs/uikit.components';

export const Design = () => (
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
            <Text>UIBadge</Text>
        </View>
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
            <Text>UISeparator</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UISeparator style={{ width: 300 }} />
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
            <Text>UITag</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITag title="Tag title" />
        </View>
    </ScrollView>
);
