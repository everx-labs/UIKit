import * as React from 'react';
import { View } from 'react-native';

import {
    UIAlert,
    UIAlertView,
    UIDropdownAlert,
} from '@tonlabs/uikit.components';
import { UILinkButton } from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Popups = () => (
    <ExampleScreen>
        <ExampleSection title="UIAlert">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UILinkButton
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
        </ExampleSection>
        <ExampleSection title="UIAlertView">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UILinkButton
                    title="Show UIAlertView"
                    onPress={() =>
                        UIAlertView.showAlert('Title', 'Some message here', [
                            { title: 'Ok' },
                        ])
                    }
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIDropdownAlert">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UILinkButton
                    title="Show UIDropdownAlert"
                    onPress={() =>
                        UIDropdownAlert.showNotification(
                            'This is a UIDropdownAlert',
                        )
                    }
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
