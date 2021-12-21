import React, { useState } from 'react';
import { View } from 'react-native';
import { UICollectionCard, UIMediaCard, MediaCardContent } from '@tonlabs/uicast.cards';
import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
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
        contentType: 'Video',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/Happy-surf.mp4?alt=media&token=ecb72009-5913-4537-b553-37ec41a99782',
        },
    },
    {
        contentType: 'Image',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/jim-carrey-yes-sir.gif?alt=media&token=42bb8c1c-ffc7-429d-8838-0436410b1d74',
        },
    },
    {
        contentType: 'Image',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
        },
    },
    {
        contentType: 'Image',
        source: {
            uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/webpImage.webp?alt=media&token=0d308353-5332-483b-a5dd-0bbce2b5e4bc',
        },
    },
];

export function Cards() {
    const [loading, setLoading] = useState(false);
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
                                    badge="1"
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
                            flexDirection: 'row',
                            maxWidth: 500,
                            margin: 8,
                        }}
                    >
                        <View style={{ flex: 1, margin: 8 }}>
                            <UIMediaCard
                                content={CONTENT[0]}
                                title="Happy surf cinema production present you the most popular video about happy dog"
                                onPress={() => {
                                    console.log('Press 1');
                                }}
                                loading={loading}
                            />
                        </View>
                        <View style={{ flex: 1, margin: 8 }}>
                            <UIMediaCard
                                content={CONTENT[2]}
                                title="Choco"
                                onPress={() => {
                                    console.log('Press 2');
                                }}
                                loading={loading}
                            />
                        </View>
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

const CardsStack = createStackNavigator();

export function CardsScreen() {
    return (
        <CardsStack.Navigator>
            <CardsStack.Screen
                name="CardsWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Cards',
                }}
                component={Cards}
            />
        </CardsStack.Navigator>
    );
}
