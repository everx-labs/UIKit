import * as React from 'react';
import { View, Text } from 'react-native';

import { UICarouselView } from '@tonlabs/uicast.carousel-view';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';
import { UISwitcher, UISwitcherVariant } from '@tonlabs/uikit.controls';
import { UILabel } from '@tonlabs/uikit.themes';
import {
    UIHighlights,
    UIHighlightCard,
    UIHighlightCardForm,
    UIHighlightCardTextLayout,
} from '@tonlabs/uicast.highlights';

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

    const [pagingEnabled, setPagingEnabled] = React.useState(false);

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
            <ExampleSection title="UIHighlights">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 600,
                        paddingVertical: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            marginBottom: 20,
                        }}
                    >
                        <UILabel>Paging enabled:</UILabel>
                        <UISwitcher
                            variant={UISwitcherVariant.Toggle}
                            active={pagingEnabled}
                            onPress={() => {
                                setPagingEnabled(!pagingEnabled);
                            }}
                        />
                    </View>
                    <UIHighlights
                        spaceBetween={8}
                        debug={false}
                        contentInset={{ left: 10 }}
                        pagingEnabled={pagingEnabled}
                    >
                        {new Array(10).fill(null).map((_, i) => {
                            if (i % 2 === 0) {
                                return (
                                    <UIHighlightCard
                                        form={UIHighlightCardForm.Horizontal}
                                        textLayout={UIHighlightCardTextLayout.Bottom}
                                        title="Title"
                                        caption="Caption"
                                        cover={{
                                            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
                                        }}
                                    />
                                );
                            }
                            return (
                                <UIHighlightCard
                                    height={192}
                                    form={UIHighlightCardForm.Vertical}
                                    textLayout={UIHighlightCardTextLayout.Top}
                                    title="Very very very loooooooooong title"
                                    caption="Very very very loooooooooong caption, like really very very very loooooooooong caption, I'm not kidding, it's very long"
                                    cover={{
                                        uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
                                    }}
                                />
                            );
                        })}
                    </UIHighlights>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
