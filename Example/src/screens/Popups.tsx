import * as React from 'react';
import { View } from 'react-native';

import { UIDropdownAlert } from '@tonlabs/uikit.components';
import { UILinkButton } from '@tonlabs/uikit.hydrogen';
import { UIAlertView } from '@tonlabs/uikit.navigation';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Popups = () => {
    const [isUIAlertViewVisible, setIsUIAlertViewVisible] =
        React.useState(false);
    const getCallback = React.useCallback(
        (message: string) => () => {
            console.log(message);
            setIsUIAlertViewVisible(false);
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
                        onRequestClose={() => setIsUIAlertViewVisible(false)}
                    >
                        <UIAlertView.Action
                            title="Neutral Action"
                            onPress={getCallback('Neutral Action')}
                            type="Neutral"
                        />
                        <UIAlertView.Action
                            title="Negative Action"
                            onPress={getCallback('Negative Action')}
                            type="Negative"
                        />
                        <UIAlertView.Action
                            title="Сancel Action"
                            onPress={getCallback('Сancel Action')}
                            type="Сancel"
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
