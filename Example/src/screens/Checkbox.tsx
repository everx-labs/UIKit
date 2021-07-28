import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { UIDetailsToggle, UIToggle } from '@tonlabs/uikit.components';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Checkbox = () => {
    const [selected, setSelected] = useState(false);
    const [selectedToggle, setSelectedToggle] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIDetailsToggle">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsToggle
                        testID="uiDetailsToggle_comment_left"
                        details="Example toggle"
                        comments="with comment"
                        active={selected}
                        onPress={() => setSelected(!selected)}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsToggle
                        testID="uiDetailsToggle_comment_right"
                        details="Example toggle"
                        comments="with comment"
                        active={selected}
                        onPress={() => setSelected(!selected)}
                        colored
                        switcherPosition={UIDetailsToggle.Position.Left}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIToggle">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIToggle
                        testID="uiToggle_default"
                        active={selectedToggle}
                        onPress={() => setSelectedToggle(!selectedToggle)}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIToggle
                        testID="uiToggle_colored"
                        colored
                        containerStyle={{ marginLeft: 16 }}
                        active={selectedToggle}
                        onPress={() => setSelectedToggle(!selectedToggle)}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
