import * as React from 'react';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
    UICheckboxItem,
    UIDetailsCheckbox,
    UIDetailsRadio,
    UIDetailsToggle,
    UIRadioButtonList,
    UIToggle,
} from '@tonlabs/uikit.components';

export const Checkbox = () => {
    const [selected, setSelected] = useState(false);
    const [selected2, setSelected2] = useState(false);
    const [selected3, setSelected3] = useState(false);
    const [selected4, setSelected4] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState(0);
    const [selectedToggle, setSelectedToggle] = useState(false);
    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UICheckboxItem</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UICheckboxItem
                    editable
                    onPress={() => {
                        setSelected(!selected);
                    }}
                    selected={selected}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UICheckboxItem editable onPress={() => undefined} selected />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UICheckboxItem onPress={() => undefined} editable={false} />
            </View>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIDetailsCheckbox</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsCheckbox
                    details="Example checkbox"
                    comments="with comment"
                    active={selected2}
                    onPress={() => setSelected2(!selected2)}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsCheckbox
                    details="Example checkbox"
                    comments="with comment"
                    active={selected2}
                    onPress={() => setSelected2(!selected2)}
                    switcherPosition={UIDetailsCheckbox.Position.Left}
                />
            </View>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIDetailsRadio</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsRadio
                    details="Example radio"
                    comments="with comment"
                    active={selected3}
                    onPress={() => setSelected3(!selected3)}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsRadio
                    details="Example radio"
                    comments="with comment"
                    active={selected3}
                    onPress={() => setSelected3(!selected3)}
                    switcherPosition={UIDetailsRadio.Position.Left}
                />
            </View>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIDetailsToggle</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsToggle
                    details="Example toggle"
                    comments="with comment"
                    active={selected4}
                    onPress={() => setSelected4(!selected4)}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsToggle
                    details="Example toggle"
                    comments="with comment"
                    active={selected4}
                    onPress={() => setSelected4(!selected4)}
                    colored
                    switcherPosition={UIDetailsToggle.Position.Left}
                />
            </View>
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIRadioButtonList</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIRadioButtonList
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
            <View
                style={{
                    width: '96%',
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: '2%',
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,.1)',
                }}
            >
                <Text>UIToggle</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIToggle
                    active={selectedToggle}
                    onPress={() => setSelectedToggle(!selectedToggle)}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIToggle
                    colored
                    containerStyle={{ marginLeft: 16 }}
                    active={selectedToggle}
                    onPress={() => setSelectedToggle(!selectedToggle)}
                />
            </View>
        </ScrollView>
    );
};
