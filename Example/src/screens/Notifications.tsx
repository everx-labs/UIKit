import * as React from 'react';
import { Text, View } from 'react-native';

import {
    UINotice,
    UINotificationBadge,
    UIToastMessage,
    UITooltip,
} from '@tonlabs/uikit.components';
import { UILinkButton } from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Notifications = () => (
    <ExampleScreen>
        <ExampleSection title="UINotice">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UILinkButton
                    testID="show_default_uiNotice_message"
                    title="Show default notice with message only"
                    onPress={() =>
                        UINotice.showMessage(
                            'System is going down at midnight tonight. We’ll notify you when it’s back up.',
                        )
                    }
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UINotificationBadge">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UINotificationBadge testID="uiNotificationBadge_default"  value={100} />
            </View>
        </ExampleSection>
        <ExampleSection title="UIToastMessage">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UILinkButton
                    testID="show_default_uiToastMessageg"
                    title="Show default notice with message only"
                    onPress={() =>
                        UIToastMessage.showMessage(
                            'System is going down at midnight tonight.',
                        )
                    }
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UITooltip">
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
                <UILinkButton
                    title="Show onMouse tooltip"
                    onPress={() =>
                        UITooltip.showOnMouseForWeb(
                            'Message of onMouse tooltip',
                        )
                    }
                />
                <UILinkButton
                    title="Hide onMouse tooltip"
                    onPress={() => UITooltip.hideOnMouseForWeb()}
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
