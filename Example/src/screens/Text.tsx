import * as React from 'react';
import { View } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIListHeader, UISectionHeader } from '@tonlabs/uikit.components';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const TextScreen = () => (
    <ExampleScreen>
        <ExampleSection title="UILabel">
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UILabel
                    testID="uiLabel_default"
                    color={UILabelColors.TextPrimary}
                    role={UILabelRoles.ParagraphText}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                </UILabel>
            </View>
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UILabel
                    testID="uiLabel_comment"
                    color={UILabelColors.TextSecondary}
                    role={UILabelRoles.ParagraphLabel}
                >
                    Comment: 12345678910aAqQlLyYzZ!@#$%^&*()👊🏻👻✊🏻
                </UILabel>
            </View>
        </ExampleSection>
        <ExampleSection title="UIListHeader">
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UIListHeader testID="uiListHeader_default" title="List header" />
            </View>
        </ExampleSection>
        <ExampleSection title="UISectionHeader">
            <View
                style={{
                    minWidth: 300,
                    paddingVertical: 20,
                }}
            >
                <UISectionHeader
                    testID="uiSectionHeader_default"
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
                    testID="uiSectionHeader_with_border_on_top"
                    title="Section header with border on top"
                    needBorder
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
