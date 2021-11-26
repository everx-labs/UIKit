import React from 'react';
import { View } from 'react-native';
import { UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { UILink } from '@tonlabs/uicast.rows';
import { UIAssets } from '@tonlabs/uikit.assets';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const Rows = () => {
    const [loading, setLoading] = React.useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UILink">
                <View
                    style={{
                        width: '100%',
                        maxWidth: 400,
                        paddingHorizontal: 16,
                    }}
                >
                    <UILink
                        title="Title "
                        description="Description"
                        logo={UIAssets.icons.security.faceId}
                        loading={loading}
                        onPress={() => console.log('onPress')}
                    />
                    <UILink
                        title="Let's check out a very long header for this link that you can imagine"
                        description="Let's check out a very long description for this link that you can imagine"
                        logo={UIAssets.icons.security.faceId}
                        loading={loading}
                        onPress={() => console.log('onPress')}
                    />
                    <UIBoxButton
                        title="Loading..."
                        variant={
                            loading ? UIBoxButtonVariant.Negative : UIBoxButtonVariant.Positive
                        }
                        onPress={() => setLoading(!loading)}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};

const RowsStack = createStackNavigator();

export const RowsScreen = () => {
    return (
        <RowsStack.Navigator>
            <RowsStack.Screen
                name="RowsWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Rows',
                }}
                component={Rows}
            />
        </RowsStack.Navigator>
    );
};
