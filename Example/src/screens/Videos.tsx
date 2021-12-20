import * as React from 'react';
import { View } from 'react-native';
import { UIVideo } from '@tonlabs/uikit.media';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const VideosStack = createStackNavigator();

export const Videos = () => {
    return (
        <ExampleScreen>
            <ExampleSection title="UIVideo">
                <View
                    style={{
                        width: '100%',
                        height: 400,
                        alignItems: 'center',
                        paddingVertical: 20,
                    }}
                >
                    <UIVideo
                        uri="https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/Happy-surf.mp4?alt=media&token=ecb72009-5913-4537-b553-37ec41a99782"
                        controls
                        repeat
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};

export function VideosScreen() {
    return (
        <VideosStack.Navigator>
            <VideosStack.Screen
                name="UIVideosWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'UIVideos',
                }}
                component={Videos}
            />
        </VideosStack.Navigator>
    );
}
