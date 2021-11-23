import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { UICollectionCard } from '@tonlabs/uicast.cards';
import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
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
                        maxWidth: 900,
                        marginVertical: 20,
                        marginHorizontal: Platform.OS === 'web' ? 20 : 0,
                    }}
                >
                    <View
                        style={{
                            width: 183,
                            height: 183,
                        }}
                    >
                        <UICollectionCard
                            title="Grandbazar Collection"
                            badge={12}
                            onPress={() => {
                                console.log('Press');
                            }}
                            imageSourceList={[
                                {
                                    uri: IMAGE_URI,
                                },
                            ]}
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
