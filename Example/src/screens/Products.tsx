import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { UIBottomBar } from '@tonlabs/uikit.navigation_legacy';
import {
    UIFeedback,
    UIPushFeedback,
    UIStubPage,
    UITokenCell,
} from '@tonlabs/uikit.legacy';

export const Products = () => (
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
            <Text>UIBottomBar</Text>
        </View>
        <View style={{ maxWidth: 500, height: 180, paddingVertical: 20 }}>
            <UIBottomBar
                leftText="Feedback"
                companyName="Wallet solutions OÜ"
                address="Jõe 2"
                postalCode="10151"
                location="Tallinn, Estonia"
                email="os@ton.space"
                phoneNumber="+372 7124030"
                copyRight="2018-2019 © TON Labs"
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
            <Text>UIFeedback</Text>
        </View>
        <View style={{ maxWidth: 500, paddingVertical: 20 }}>
            <UIFeedback />
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
            <Text>UIPushFeedback</Text>
        </View>
        <View style={{ maxWidth: 500, paddingVertical: 20 }}>
            <UIPushFeedback onPress={() => undefined} />
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
            <Text>UIStubPage</Text>
        </View>
        <View style={{ maxWidth: 500, paddingVertical: 20 }}>
            <UIStubPage title="labs." needBottomIcon={false} />
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
            <Text>UITokenCell</Text>
        </View>
        <View style={{ width: 300, paddingVertical: 20 }}>
            <UITokenCell title="GRAM" details="balance" balance="100.0000" />
        </View>
    </ScrollView>
);
