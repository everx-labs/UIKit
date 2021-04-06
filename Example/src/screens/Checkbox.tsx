import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import {
    UICheckboxItem,
    UIDetailsCheckbox,
    UIDetailsRadio,
    UIDetailsToggle,
    UIRadioButtonList,
    UIToggle,
} from '@tonlabs/uikit.components';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Checkbox = () => {
    const [selected, setSelected] = useState(false);
    const [selected2, setSelected2] = useState(false);
    const [selected3, setSelected3] = useState(false);
    const [selected4, setSelected4] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState(0);
    const [selectedToggle, setSelectedToggle] = useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UICheckboxItem">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UICheckboxItem
                        testID="uiCheckboxItem_editable"
                        editable
                        onPress={() => {
                            setSelected(!selected);
                        }}
                        selected={selected}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UICheckboxItem
                        testID="uiCheckboxItem_selected_state"
                        editable
                        onPress={() => undefined}
                        selected
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UICheckboxItem
                        testID="uiCheckboxItem_disabled_state"
                        onPress={() => undefined}
                        editable={false}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIDetailsCheckbox">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsCheckbox
                        testID="uiDetailsCheckbox_comment_left"
                        details="Example checkbox"
                        comments="with comment"
                        active={selected2}
                        onPress={() => setSelected2(!selected2)}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsCheckbox
                        testID="uiDetailsCheckbox_comment_right"
                        details="Example checkbox"
                        comments="with comment"
                        active={selected2}
                        onPress={() => setSelected2(!selected2)}
                        switcherPosition={UIDetailsCheckbox.Position.Left}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIDetailsRadio">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsRadio
                        testID="uiDetailsRadio_comment_left"
                        details="Example radio"
                        comments="with comment"
                        active={selected3}
                        onPress={() => setSelected3(!selected3)}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsRadio
                        testID="uiDetailsRadio_comment_right"
                        details="Example radio"
                        comments="with comment"
                        active={selected3}
                        onPress={() => setSelected3(!selected3)}
                        switcherPosition={UIDetailsRadio.Position.Left}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIDetailsToggle">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsToggle
                        testID="uiDetailsToggle_comment_left"
                        details="Example toggle"
                        comments="with comment"
                        active={selected4}
                        onPress={() => setSelected4(!selected4)}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIDetailsToggle
                        testID="uiDetailsToggle_comment_right"
                        details="Example toggle"
                        comments="with comment"
                        active={selected4}
                        onPress={() => setSelected4(!selected4)}
                        colored
                        switcherPosition={UIDetailsToggle.Position.Left}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIRadioButtonList">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIRadioButtonList
                        testID="uiRadioButtonList_default"
                        onSelect={(index: number) => setSelectedRadio(index)}
                        state={{
                            selected: selectedRadio,
                            radiobuttonList: [
                                { title: 'first' },
                                { title: 'second' },
                                { title: 'third' },
                            ],
                        }}
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
