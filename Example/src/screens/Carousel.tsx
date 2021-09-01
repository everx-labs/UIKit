import * as React from 'react';
import { View, Text } from 'react-native';

import { UICarouselView } from '@tonlabs/uikit.flask';
import { UIAssets }  from '@tonlabs/uikit.assets';
import {
    UIImage,
    UIBoxButton,
    TouchableOpacity
} from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const DATA = ['Hello', 'this', 'is', 'UICarouselView']

export const Carousel = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    function onChange(nextIndex: number) {
        console.log("??")
        setActiveIndex(nextIndex);
    }

    const component = (title: string, index: number) => (): React.ReactElement<View> => {
        return (
            <TouchableOpacity onPress={() => onChange(index)} style={{flex: 1, justifyContent: 'space-between', padding: 20}}>
                <UIImage style={{height: 100}} source={UIAssets.images[404]}/>
                <Text style={{textAlign: 'center', fontSize: 30, color: '#000'}}>
                    {title}
                </Text>
                <UIBoxButton title='Click' onPress={() => console.log('click!')}/>
            </TouchableOpacity>
        );
    };

    return (
        <ExampleScreen>
            <ExampleSection title="UICarouselView">
                <View style={{ width: '100%', height: 400, paddingVertical: 20}}>
                    <UICarouselView.Container
                        onChange={onChange}
                        activeIndex={activeIndex}
                    >   
                        {DATA.map((text, index) => {
                            return <UICarouselView.Page
                                key={text}
                                component={component(text, index)}
                        />
                    })}
                    </UICarouselView.Container>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
