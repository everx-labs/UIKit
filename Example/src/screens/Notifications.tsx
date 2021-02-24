import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
    UITextButton,
    UINotice,
    UINotificationBadge,
    UIToastMessage,
    UITooltip,
} from '@tonlabs/uikit.components';

export const Notifications = () => (
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
            <Text>UINotice</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show default notice with message only"
                onPress={() =>
                    UINotice.showMessage(
                        'System is going down at midnight tonight. We’ll notify you when it’s back up.',
                    )
                }
            />
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
            <Text>UINotificationBadge</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UINotificationBadge value={100} />
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
            <Text>UIToastMessage</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show default notice with message only"
                onPress={() =>
                    UIToastMessage.showMessage(
                        'System is going down at midnight tonight.',
                    )
                }
            />
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
            <Text>UITooltip</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITooltip message="Message one">
                <Text style={{ fontSize: 16 }}> Trigger 1</Text>
            </UITooltip>
            <UITooltip message="Message two with more text for two lines to see second option of layout.">
                <Text style={{ fontSize: 16 }}> Trigger 2</Text>
            </UITooltip>
            <UITooltip message="Message three is huge, with five lines of text wich contains more usefull information for all users and many-many bla-bla-bla to see maximum height of tooltip. You can add here some instructions.">
                <Text style={{ fontSize: 16 }}> Trigger 3</Text>
            </UITooltip>
            <UITextButton
                title="Show onMouse tooltip"
                onPress={() =>
                    UITooltip.showOnMouseForWeb('Message of onMouse tooltip')
                }
            />
            <UITextButton
                title="Hide onMouse tooltip"
                onPress={() => UITooltip.hideOnMouseForWeb()}
            />
        </View>
    </ScrollView>
);
