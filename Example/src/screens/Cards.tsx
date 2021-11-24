import React, { useState } from 'react';
import { View } from 'react-native';
import { UICollectionCard } from '@tonlabs/uicast.cards';
import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const IMAGE_URI =
    'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e';

export function Cards() {
    const [loading, setLoading] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="Cards">
                <View
                    style={{
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        maxWidth: 600,
                        margin: 8,
                    }}
                >
                    <View style={{ flex: 1, margin: 8 }}>
                        <UICollectionCard
                            title="Grandbazar Collection"
                            badge={1}
                            onPress={() => {
                                console.log('Press 1');
                            }}
                            imageSourceList={[{ uri: IMAGE_URI }]}
                            loading={loading}
                        />
                    </View>
                    <View style={{ flex: 1, margin: 8 }}>
                        <UICollectionCard
                            title="Dota2 Pixel Art Heroes"
                            badge={
                                <UIImage
                                    source={UIAssets.icons.ui.blankMiddle}
                                    style={{
                                        width: 24,
                                        height: 24,
                                    }}
                                />
                            }
                            onPress={() => {
                                console.log('Press 2');
                            }}
                            loading={loading}
                        />
                    </View>
                </View>
                <UIBoxButton
                    title="Loading..."
                    onPress={() => setLoading(!loading)}
                    variant={loading ? UIBoxButtonVariant.Negative : UIBoxButtonVariant.Positive}
                />
            </ExampleSection>
        </ExampleScreen>
    );
}
