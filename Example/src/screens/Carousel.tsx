import * as React from 'react';
import { View, Text } from 'react-native';

import { UICarouselView } from '@tonlabs/uicast.carousel-view';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const DATA = ['Hello', 'this', 'is', 'UICarouselView'];

export function CarouselScreen() {
    const onPageIndexChange = (index: number) => {
        console.log('page changed', index);
    };

    const component = (title: string) => (): React.ReactElement<View> => {
        return (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <UIImage
                    style={{ height: 100, width: '100%', resizeMode: 'contain' }}
                    source={UIAssets.images[404]}
                />
                <Text style={{ textAlign: 'center', fontSize: 30, color: '#000' }}>{title}</Text>
            </View>
        );
    };

    return (
        <ExampleScreen>
            <ExampleSection title="UICarouselView">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 600,
                        height: 220,
                        paddingVertical: 20,
                    }}
                >
                    <UICarouselView.Container
                        initialIndex={0}
                        onPageIndexChange={onPageIndexChange}
                    >
                        {DATA.map(text => {
                            return <UICarouselView.Page key={text} component={component(text)} />;
                        })}
                    </UICarouselView.Container>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
