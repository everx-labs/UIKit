import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { UIDetailsToggle } from '@tonlabs/uikit.components';
import { UIPromoNotice } from '@tonlabs/uikit.flask';
import { UIBottomBar } from '@tonlabs/uikit.navigation_legacy';
import {
    UIFeedback,
    UIPushFeedback,
    UIStubPage,
} from '@tonlabs/uikit.legacy';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Products = () => {
    const [displayPromoNotice, setDisplayPromoNotice] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIBottomBar">
                <View style={{ maxWidth: 500, height: 180, paddingVertical: 20 }}>
                    <UIBottomBar
                        testID="uiBottomBar_info"
                        leftText="Feedback"
                        companyName="Wallet solutions OÜ"
                        address="Jõe 2"
                        postalCode="10151"
                        location="Tallinn, Estonia"
                        email="os@ton.space"
                        phoneNumber="+372 7124030"
                        copyRight="2018-2019 © TON Labs"
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIFeedback">
                <View style={{ maxWidth: 500, paddingVertical: 20 }}>
                    <UIFeedback testID="uiFeedback_default" />
                </View>
            </ExampleSection>
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
            <ExampleSection title="UIPushFeedback">
                <View style={{ maxWidth: 500, paddingVertical: 20 }}>
                    <UIPushFeedback testID="uiPushFeedback_message" onPress={() => undefined} />
                </View>
            </ExampleSection>
            <ExampleSection title="UIStubPage">
                <View style={{ maxWidth: 500, paddingVertical: 20 }}>
                    <UIStubPage testID="uiStubPage_default" title="labs." needBottomIcon={false} />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
