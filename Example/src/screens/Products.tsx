import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { UIDetailsToggle } from '@tonlabs/uikit.components';
import { UIPromoNotice } from '@tonlabs/uikit.flask';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Products = () => {
    const [displayPromoNotice, setDisplayPromoNotice] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIPromoNotice">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsToggle
                        testID="uiPromoNotice_display_toggle"
                        details="Display UIPromoNotice"
                        active={displayPromoNotice}
                        onPress={() => {
                            setDisplayPromoNotice(!displayPromoNotice)
                        }}
                        switcherPosition={UIDetailsToggle.Position.Left}
                    />
                </View>
                {
                    displayPromoNotice && (
                        <UIPromoNotice
                            appStoreUrl="https://www.apple.com/app-store/"
                            googlePlayUrl="https://play.google.com/store"
                        />
                    )
                }
            </ExampleSection>
        </ExampleScreen>
    );
};
