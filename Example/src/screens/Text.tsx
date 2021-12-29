import * as React from 'react';
import { View } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UIExpandableText } from '@tonlabs/uicast.texts';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const TextStack = createStackNavigator();

export const Text = () => {
    return (
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
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
            <ExampleSection title="UIExpandableText">
                <View
                    style={{
                        minWidth: 300,
                        paddingVertical: 20,
                    }}
                >
                    <UIExpandableText
                        testID="uiLabel_default"
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.ParagraphText}
                        numberOfLines={3}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </UIExpandableText>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};

export function TextScreen() {
    return (
        <TextStack.Navigator>
            <TextStack.Screen
                name="UITextWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'UIText',
                }}
                component={Text}
            />
        </TextStack.Navigator>
    );
}
