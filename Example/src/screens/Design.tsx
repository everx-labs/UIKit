import * as React from 'react';
import { Platform, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIBlurView, UIImage } from '@tonlabs/uikit.hydrogen';
import { UILabel, UILabelColors, UILabelRoles, ColorVariants } from '@tonlabs/uikit.themes';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Design = () => (
    <ExampleScreen>
        <ExampleSection title="UIBlurView">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <View
                    style={{
                        width: 300,
                        height: 200,
                        padding: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {Platform.OS === 'web' ? (
                        <UIImage source={UIAssets.images[404]} />
                    ) : (
                        <UIImage
                            source={UIAssets.icons.ui.camera}
                            tintColor={ColorVariants.TextAccent}
                        />
                    )}
                    <UIBlurView
                        testID="uiBlurView"
                        style={{
                            marginHorizontal: 16,
                            padding: 16,
                            borderRadius: 12,
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.TitleMedium}>
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
