import * as React from 'react';
import { View, Text } from 'react-native';

import { UICarouselView } from '@tonlabs/uikit.flask';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const DATA = ['Hello', 'this', 'is', 'UICarouselView']

export const Carousel = () => {

    const component = (title: string) => (): React.ReactElement<View> => {
        return (
            <View style={{height: '100%', justifyContent: 'center', alignItems:'center'}}>
                <UIImage style={{height: 100, resizeMode: 'contain'}} source={UIAssets.images[404]}/>
                <Text style={{textAlign: 'center', fontSize: 30, color: '#000'}}>
                    {title}
                </Text>
            </View>
        );
    };

    return (
        <ExampleScreen>
            <ExampleSection title="UICarouselView">
                <View style={{ width: '100%', height: 400, paddingVertical: 20}}>
                    <UICarouselView.Container
                        initialIndex={2}
                    >   
                        {DATA.map(text => {
                            return <UICarouselView.Page
                                key={text}
                                component={component(text)}
                        />
                    })}
                    </UICarouselView.Container>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
