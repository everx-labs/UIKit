import * as React from 'react';
import { View } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
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
    </ExampleScreen>
);
