import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import { UIListHeader, UISectionHeader } from '@tonlabs/uikit.components';

export const TextScreen = () => (
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
            <Text>UILabel</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.ParagraphText}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </UILabel>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UILabel
                color={UILabelColors.TextSecondary}
                role={UILabelRoles.ParagraphLabel}
            >
                Comment: 12345678910aAqQlLyYzZ!@#$%^&*()👊🏻👻✊🏻
            </UILabel>
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
            <Text>UIListHeader</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIListHeader title="List header" />
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
            <Text>UISectionHeader</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UISectionHeader
                title="Section header"
                titleRight="Title on the right side" // This will be rendered on the right side of the header
                containerStyle={{ marginBottom: 16 }}
            />
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UISectionHeader
                title="Section header with border on top"
                needBorder
            />
        </View>
    </ScrollView>
);
