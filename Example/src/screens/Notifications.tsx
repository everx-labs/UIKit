import * as React from 'react';
import { View } from 'react-native';

import { UINotice, UIToastMessage } from '@tonlabs/uikit.components';
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
    </ExampleScreen>
);
