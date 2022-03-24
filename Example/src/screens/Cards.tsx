import React, { useState } from 'react';
import { View } from 'react-native';
import { UICollectionCard, UIMediaCard, MediaCardContent } from '@tonlabs/uicast.cards';
import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIMasonryList, MasonryItem } from '@tonlabs/uikit.scrolls';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

// const anotherVideo: MediaCardContent = {
//     contentType: 'Video',
//     source: {
//         uri: 'https://firebasestorage.googleapis.com/v0/b/lol-videos-8dc74.appspot.com/o/Blog_Images%2Fvideo%3A10142?alt=media&token=9f7734fa-f714-4838-bd65-8a4d594ec2ce',
//     },
// };

const CONTENT: MediaCardContent[] = [
    {
        id: '1',
        contentType: 'Video',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/Happy-surf.mp4?alt=media&token=ecb72009-5913-4537-b553-37ec41a99782',
        },
    },
    {
        id: '2',
        contentType: 'Image',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/jim-carrey-yes-sir.gif?alt=media&token=42bb8c1c-ffc7-429d-8838-0436410b1d74',
        },
    },
    {
        id: '3',
        contentType: 'Image',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
        },
    },
    {
        id: '4',
        contentType: 'Image',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/webpImage.webp?alt=media&token=0d308353-5332-483b-a5dd-0bbce2b5e4bc',
        },
    },
];

type Item = { index: number; title: string };

const getTitle = (id: string | undefined) => {
    switch (id) {
        case '1':
            return 'Happy surf cinema production present you the most popular video about happy dog';
        case '2':
            return 'Jim Carrey greets you!';
        case '3':
            return 'Choco';
        case '4':
            return 'Relaxation';
        default:
            return 'Empty card';
    }
};

const arrayLength = 5;
const data = new Array(arrayLength).fill(null).map((_, index): MasonryItem<Item> => {
    const title = getTitle(CONTENT[index]?.id);
    return {
        key: `${index}`,
        item: { index, title },
        aspectRatio: 0.5 + (index % arrayLength) / (arrayLength * 2),
    };
});

export function CardsScreen() {
    const [loading, setLoading] = useState(false);

    const renderItem = React.useCallback(
        ({ item, aspectRatio }: MasonryItem<Item>) => {
            if (item) {
                return (
                    <View style={{ flex: 1 }}>
                        <UIMediaCard
                            content={CONTENT[item.index]}
                            title={item.title}
                            loading={loading}
                            aspectRatio={aspectRatio}
                            onPress={() => console.log(item.index)}
                        />
                    </View>
                );
            }
            return null;
        },
        [loading],
    );

    return (
        <ExampleScreen>
            <ExampleSection title="UICollectionCard">
                <View
                    style={{ alignSelf: 'stretch', justifyContent: 'center', flexDirection: 'row' }}
                >
                    <View
                        style={{
                            flex: 1,
                            maxWidth: 500,
                            margin: 8,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, margin: 8 }}>
                                <UICollectionCard
                                    title="Grand Collection"
                                    badge="4"
                                    onPress={() => {
                                        console.log('Press 1');
                                    }}
                                    contentList={CONTENT}
                                    loading={loading}
                                />
                            </View>
                            <View style={{ flex: 1, margin: 8 }}>
                                <UICollectionCard
                                    title="Happy surf cinema production present you the most popular video about happy dog"
                                    badge={UIAssets.icons.ui.blankMiddle}
                                    onPress={() => {
                                        console.log('Press 2');
                                    }}
                                    contentList={[CONTENT[0]]}
                                    loading={loading}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, margin: 8 }}>
                                <UICollectionCard
                                    contentList={[]}
                                    title="Empty collection"
                                    badge={UIAssets.icons.ui.blankMiddle}
                                    onPress={() => {
                                        console.log('Press 3');
                                    }}
                                    loading={loading}
                                />
                            </View>
                            <View style={{ flex: 1, margin: 8 }} />
                        </View>
                    </View>
                </View>
                <UIBoxButton
                    title="Loading..."
                    onPress={() => setLoading(!loading)}
                    variant={loading ? UIBoxButtonVariant.Negative : UIBoxButtonVariant.Positive}
                />
            </ExampleSection>
            <ExampleSection title="UIMediaCard">
                <View
                    style={{ alignSelf: 'stretch', justifyContent: 'center', flexDirection: 'row' }}
                >
                    <View
                        style={{
                            alignSelf: 'stretch',
                            flex: 1,
                            maxWidth: 500,
                            margin: 8,
                        }}
                    >
                        <UIMasonryList data={data} numOfColumns={2} renderItem={renderItem} />
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
