import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { TouchableOpacity, UISwitcher, UISwitcherVariant } from '@tonlabs/uikit.controls';
import { UILabel } from '@tonlabs/uikit.themes';

import { UIPromoNotice } from '@tonlabs/uicast.promo-notice';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export function Products() {
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
                            testID="uiPromoNotice_display_toggle"
                            variant={UISwitcherVariant.Toggle}
                            active={displayPromoNotice}
                        />
                    </TouchableOpacity>
                </View>

                {displayPromoNotice && (
                    <UIPromoNotice
                        visible={displayPromoNotice}
                        icon={UIAssets.icons.brand.surfSymbol}
                    >
                        <UILabel>Test Promo Notice Content</UILabel>
                    </UIPromoNotice>
                )}
            </ExampleSection>
        </ExampleScreen>
    );
}
