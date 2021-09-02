import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { UICarouselView } from '@tonlabs/uikit.flask';
import { UIAssets }  from '@tonlabs/uikit.assets';
import {
    UIImage,
} from '@tonlabs/uikit.hydrogen';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const DATA = ['Hello', 'this', 'is', 'UICarouselView']

export const Carousel = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    
    const onChange = React.useCallback((index: number) => {
        const desiredIndex = (index + 1) % DATA.length
        if(activeIndex !== desiredIndex){
            setActiveIndex(desiredIndex);
        } else {
            setActiveIndex(index)
        }
    },[activeIndex])

    const onPageIndexChange = (index: number) => {
        console.log(index)
    }

    const component = (title: string, index: number) => (): React.ReactElement<View> => {
        return (
            <TouchableOpacity
                
                onPress={() => onChange(index)} 
                style={{height: '100%', justifyContent: 'space-between', padding: 20}}
            >
                <UIImage style={{height: 100}} source={UIAssets.images[404]}/>
                <Text style={{textAlign: 'center', fontSize: 30, color: '#000'}}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ExampleScreen>
            <ExampleSection title="UICarouselView">
                <View style={{ width: '100%', height: 400, paddingVertical: 20}}>
                    <UICarouselView.Container
                        activeIndex={activeIndex}
                        onPageIndexChange={onPageIndexChange}
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
