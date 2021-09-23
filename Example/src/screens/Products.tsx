import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { UIPromoNotice } from '@tonlabs/uicast.promo-notice';
import { TouchableOpacity, UISwitcher, UISwitcherVariant } from '@tonlabs/uikit.controls';
import { UILabel } from '@tonlabs/uikit.themes';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Products = () => {
    const [displayPromoNotice, setDisplayPromoNotice] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIPromoNotice">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            width: 300,
                            justifyContent: 'space-between',
                        }}
                        onPress={() => {
                            setDisplayPromoNotice(!displayPromoNotice);
                        }}
                    >
                        <UILabel>Display UIPromoNotice</UILabel>
                        <UISwitcher
                            testID={`uiPromoNotice_display_toggle`}
                            variant={UISwitcherVariant.Toggle}
                            active={displayPromoNotice}
                        />
                    </TouchableOpacity>
                </View>
                {displayPromoNotice && (
                    <UIPromoNotice
                        appStoreUrl="https://www.apple.com/app-store/"
                        googlePlayUrl="https://play.google.com/store"
                    />
                )}
            </ExampleSection>
        </ExampleScreen>
    );
};
