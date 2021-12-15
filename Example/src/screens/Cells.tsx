import React, { useState } from 'react';
import { View } from 'react-native';
import { UIImageCell } from '@tonlabs/uicast.cells';
import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const CONTENT = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/webpImage.webp?alt=media&token=0d308353-5332-483b-a5dd-0bbce2b5e4bc',
};

export function Cells() {
    const [loading, setLoading] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIImageCell">
                <View
                    style={{
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        paddingHorizontal: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <UIImageCell
                        image={CONTENT}
                        title="Title"
                        caption="Caption"
                        onPress={() => console.log('Tap')}
                        loading={loading}
                    />
                    <UIImageCell
                        image={UIAssets.icons.logo.tonlabsPrimary}
                        title="Title"
                        onPress={() => console.log('Tap')}
                        loading={loading}
                    />
                    <UIImageCell
                        image={CONTENT}
                        onPress={() => console.log('Tap')}
                        loading={loading}
                    />
                    <UIImageCell
                        image={UIAssets.icons.logo.tonlabsBlack}
                        title="Looooooong title"
                        caption="Looooooong caption"
                        onPress={() => console.log('Tap')}
                        loading={loading}
                    />
                    <UIImageCell
                        image={CONTENT}
                        title="Looooooooooooong super title"
                        onPress={() => console.log('Tap')}
                        loading={loading}
                    />
                    <UIImageCell
                        image={UIAssets.icons.brand.tonSymbol}
                        caption="Looooooooooooong super title"
                        onPress={() => console.log('Tap')}
                        loading={loading}
                    />
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

const CellsStack = createStackNavigator();

export function CellsScreen() {
    return (
        <CellsStack.Navigator>
            <CellsStack.Screen
                name="CellsWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Cells',
                }}
                component={Cells}
            />
        </CellsStack.Navigator>
    );
}
