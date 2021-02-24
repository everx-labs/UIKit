import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
    UITextButton,
    UIAlert,
    UIAlertView,
    UIDropdownAlert,
} from '@tonlabs/uikit.components';

export const Popups = () => (
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
            <Text>UIAlert</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show UIAlert"
                onPress={() =>
                    UIAlert.showAlert({
                        title: 'This is the title',
                        description: 'This is the alert description',
                        // Receives an array of button arrays
                        buttons: [
                            [
                                {
                                    title: 'Button Left',
                                    onPress: () => undefined,
                                },
                                {
                                    title: 'Button Right',
                                    onPress: () => undefined,
                                },
                            ],
                            [
                                {
                                    title: 'Single Button',
                                    onPress: () => undefined,
                                },
                            ],
                        ],
                    })
                }
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
            <Text>UIAlertView</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show UIAlertView"
                onPress={() =>
                    UIAlertView.showAlert('Title', 'Some message here', [
                        { title: 'Ok' },
                    ])
                }
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
            <Text>UIDropdownAlert</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show UIDropdownAlert"
                onPress={() =>
                    UIDropdownAlert.showNotification(
                        'This is a UIDropdownAlert',
                    )
                }
            />
        </View>
    </ScrollView>
);
