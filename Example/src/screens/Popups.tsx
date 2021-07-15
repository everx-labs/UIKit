import * as React from 'react';
import { View } from 'react-native';

import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { UILinkButton } from '@tonlabs/uikit.hydrogen';
import { UIAlertView, UIAlertViewActionType } from '@tonlabs/uikit.navigation';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Popups = () => {
    const [isUIAlertViewVisible, setIsUIAlertViewVisible] =
        React.useState(false);
    const getCallback = React.useCallback(
        (message: string) => () => {
            console.log(message);
            if (message.includes('Сancel')) {
                setIsUIAlertViewVisible(false);
            }
        },
        [],
    );
    return (
        <ExampleScreen>
            <ExampleSection title="UIAlertView">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        title="Show UIAlertView"
                        onPress={() => setIsUIAlertViewVisible(true)}
                    />
                    <UIAlertView
                        visible={isUIAlertViewVisible}
                        title="Please select your action"
                        note="You can select it later"
                    >
                        <UIAlertView.Action
                            type={UIAlertViewActionType.Neutral}
                            title="Neutral Action"
                            onPress={getCallback('Neutral Action')}
                        />
                        <UIAlertView.Action
                            type={UIAlertViewActionType.Negative}
                            title="Negative Action"
                            onPress={getCallback('Negative Action')}
                        />
                        <UIAlertView.Action
                            type={UIAlertViewActionType.Сancel}
                            title="Сancel Action"
                            onPress={getCallback('Сancel Action')}
                        />
                    </UIAlertView>
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
};
