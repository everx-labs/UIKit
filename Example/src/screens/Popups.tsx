import * as React from 'react';
import { View } from 'react-native';

import { UILinkButton } from '@tonlabs/uikit.controls';
import { UIPopup } from '@tonlabs/uikit.popups';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Popups = () => {
    const [isUIAlertViewVisible, setIsUIAlertViewVisible] = React.useState(false);
    const getCallback = React.useCallback(
        (message: string) => () => {
            console.log(message);
            if (message.includes('Cancel')) {
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
                    <UIPopup.AlertView
                        visible={isUIAlertViewVisible}
                        title="Please select your action"
                        note="You can select it later"
                    >
                        <UIPopup.AlertView.Action
                            type={UIPopup.AlertView.Action.Type.Neutral}
                            title="Neutral Action"
                            onPress={getCallback('Neutral Action')}
                        />
                        <UIPopup.AlertView.Action
                            type={UIPopup.AlertView.Action.Type.Negative}
                            title="Negative Action"
                            onPress={getCallback('Negative Action')}
                        />
                        <UIPopup.AlertView.Action
                            type={UIPopup.AlertView.Action.Type.Cancel}
                            title="Cancel Action"
                            onPress={getCallback('Cancel Action')}
                        />
                    </UIPopup.AlertView>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
