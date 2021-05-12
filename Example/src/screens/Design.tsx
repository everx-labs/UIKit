import * as React from 'react';
import { Platform, Text, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIBadge, UIDot, UISeparator, UITag } from '@tonlabs/uikit.components';
import {
    ColorVariants,
    UIBlurView,
    UIImage,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Design = () => (
    <ExampleScreen>
        <ExampleSection title="UIBadge">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBadge testID="uiBadge_count_1" badge={1} />
            </View>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIDot</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDot testID="uiDot_default"/>
            </View>
        </ExampleSection>
        <ExampleSection title="UISeparator">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UISeparator testID="uiSeparator_default" style={{ width: 300 }} />
            </View>
        </ExampleSection>
        <ExampleSection title="UITag">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITag testID="uiTag_default" title="Tag title" />
            </View>
        </ExampleSection>
        <ExampleSection title="UIBlurView">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <View style={{ width: 300, height: 200, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        Platform.OS === 'web' ? (
                            <UIImage source={UIAssets.images[404]} />
                        ) : (
                            <UIImage
                                source={UIAssets.icons.ui.camera}
                                tintColor={ColorVariants.TextAccent}
                            />
                        )
                    }
                    <UIBlurView
                        style={{
                            marginHorizontal: 16,
                            padding: 16,
                            borderRadius: 12,
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.TitleMedium}
                        >
                            Earn 5.0 % a year just for holding crystals
                        </UILabel>
                        <UILabel
                            color={UILabelColors.TextPrimary}
                            role={UILabelRoles.ParagraphNote}
                            style={{ marginTop: 8 }}
                        >
                            Delegate tokens to Smart Contracts and enjoy your rewards every day
                        </UILabel>
                    </UIBlurView>
                </View>
            </View>
        </ExampleSection>
    </ExampleScreen>
);
