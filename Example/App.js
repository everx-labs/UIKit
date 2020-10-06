/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import "react-native-gesture-handler";
import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Button,
    SafeAreaView,
    ScrollView,
    Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { createSurfSplitNavigator } from "react-navigation-surf";
import {
    UIButton,
    UILayoutManager,
    UICheckboxItem,
    UIDetailsButton,
    UIDetailsCheckbox,
    UIDetailsRadio,
    UIDetailsToggle,
    UIImageButton,
    UILoadMoreButton,
    UIRadioButtonList,
    UIScaleButton,
    UITextButton,
} from "../UIKit";
import UIAssets from "../assets/UIAssets";

const SurfSplit = createSurfSplitNavigator();

const Main = ({ navigation }) => (
    <SafeAreaView>
        <Text style={styles.title}>Main</Text>
        <UIButton
            onPress={() => navigation.navigate("buttons")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Buttons"
        />
        <UIButton
            onPress={() => navigation.navigate("checkbox")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Checkbox"
        />
    </SafeAreaView>
);

const Buttons = ({ navigation }) => (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View
            style={{
                width: "96%",
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: "2%",
                marginTop: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,.1)",
            }}
        >
            <Text>UIButton</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Example" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Example" badge={2} />
        </View>
        <View
            style={{
                maxWidth: 300,
                paddingVertical: 20,
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <UIButton title="Large" buttonSize={UIButton.ButtonSize.Large} />
            <UIButton title="Medium" buttonSize={UIButton.ButtonSize.Medium} />
            <UIButton title="Small" buttonSize={UIButton.ButtonSize.Small} />
            <UIButton
                title="Default"
                buttonSize={UIButton.ButtonSize.Default}
            />
        </View>
        <View
            style={{
                maxWidth: 300,
                paddingVertical: 20,
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <UIButton
                title="Radius"
                buttonShape={UIButton.ButtonShape.Radius}
            />
            <UIButton
                title="Rounded"
                buttonShape={UIButton.ButtonShape.Rounded}
            />
            <UIButton title="Full" buttonShape={UIButton.ButtonShape.Full} />
            <UIButton
                title="Default"
                buttonShape={UIButton.ButtonShape.Default}
            />
        </View>
        <View
            style={{
                maxWidth: 300,
                paddingVertical: 20,
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <UIButton title="Full" buttonStyle={UIButton.ButtonStyle.Full} />
            <UIButton
                title="Border"
                buttonStyle={UIButton.ButtonStyle.Border}
            />
            <UIButton title="Link" buttonStyle={UIButton.ButtonStyle.Link} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Example" count="1" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Example" data="data" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Icon left" icon={UIAssets.icoArrowLeft()} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Icon right" iconR={UIAssets.icoArrowLeft()} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="With tooltip" tooltip="Hi there!" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton title="Disabled" disabled />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIButton showIndicator />
        </View>
        <View
            style={{
                width: "96%",
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: "2%",
                marginTop: 50,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,.1)",
            }}
        >
            <Text>UIDetailsButton</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDetailsButton title="Example" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDetailsButton title="Example" progress />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDetailsButton title="Example" details="details" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDetailsButton title="Example" secondDetails="second details" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDetailsButton
                title="Example"
                details="long second details title title title title title title title"
                truncDetails
            />
        </View>
        <View
            style={{
                width: "96%",
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: "2%",
                marginTop: 50,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,.1)",
            }}
        >
            <Text>UIImageButton</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageButton image={UIImageButton.Images.back} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageButton image={UIImageButton.Images.closePrimary} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageButton image={UIImageButton.Images.closeSecondary} />
        </View>
        <View
            style={{
                maxWidth: 300,
                paddingVertical: 20,
                backgroundColor: "black",
            }}
        >
            <UIImageButton
                image={UIImageButton.Images.closeDarkThemeSecondary}
            />
        </View>
        <View
            style={{
                maxWidth: 300,
                paddingVertical: 20,
                backgroundColor: "black",
            }}
        >
            <UIImageButton image={UIImageButton.Images.closeLight} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageButton image={UIImageButton.Images.menu} />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageButton image={UIImageButton.Images.menuContained} />
        </View>
        <View
            style={{
                width: "96%",
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: "2%",
                marginTop: 50,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,.1)",
            }}
        >
            <Text>UILoadMoreButton</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UILoadMoreButton label="Load more" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UILoadMoreButton label="Load more" isLoadingMore />
        </View>
        <View
            style={{
                width: "96%",
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: "2%",
                marginTop: 50,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,.1)",
            }}
        >
            <Text>UIScaleButton</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIScaleButton>
                <Text>Scale example</Text>
            </UIScaleButton>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIScaleButton scaleInFactor={2}>
                <Text>Scale example factor 2</Text>
            </UIScaleButton>
        </View>
        <View
            style={{
                width: "96%",
                paddingLeft: 40,
                paddingBottom: 10,
                marginHorizontal: "2%",
                marginTop: 50,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,.1)",
            }}
        >
            <Text>UITextButton</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton title="Text button" />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Text button with details"
                details="Some details"
            />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton disabled title="Disabled text button" />
        </View>
    </ScrollView>
);

const Checkbox = () => {
    const [selected, setSelected] = useState(false);
    const [selected2, setSelected2] = useState(false);
    const [selected3, setSelected3] = useState(false);
    const [selected4, setSelected4] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState(0);
    return (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <View
                style={{
                    width: "96%",
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: "2%",
                    marginTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,.1)",
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
                <UICheckboxItem editable onPress={() => {}} selected={true} />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UICheckboxItem onPress={() => {}} editable={false} />
            </View>
            <View
                style={{
                    width: "96%",
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: "2%",
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,.1)",
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
                    width: "96%",
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: "2%",
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,.1)",
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
                    width: "96%",
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: "2%",
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,.1)",
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
                    width: "96%",
                    paddingLeft: 40,
                    paddingBottom: 10,
                    marginHorizontal: "2%",
                    marginTop: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,.1)",
                }}
            >
                <Text>UIRadioButtonList</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIRadioButtonList
                    onSelect={(index) => setSelectedRadio(index)}
                    state={{
                        selected: selectedRadio,
                        radiobuttonList: [
                            { title: "first" },
                            { title: "second" },
                            { title: "third" },
                        ],
                    }}
                />
            </View>
        </ScrollView>
    );
};

// const Detail1Stack = createStackNavigator();
// const Detail1 = () => (
//     <Detail1Stack.Navigator initialRouteName="foo">
//         <Detail1Stack.Screen name="foo" component={Detail1Foo} />
//         <Detail1Stack.Screen name="bar" component={Detail1Bar} />
//     </Detail1Stack.Navigator>
// );

const Detail2 = () => (
    <SafeAreaView>
        <Text style={styles.title}>Detail 2</Text>
    </SafeAreaView>
);

const App: () => React$Node = () => {
    const navRef = React.useRef();
    useReduxDevToolsExtension(navRef);

    return (
        <>
            <NavigationContainer ref={navRef} linking={{ prefixes: ["/"] }}>
                <SurfSplit.Navigator
                    initialRouteName="buttons"
                    screenOptions={{
                        splitStyles: {
                            body: styles.body,
                            main: styles.main,
                            detail: styles.detail,
                        },
                    }}
                    mainWidth={900}
                >
                    <SurfSplit.Screen name="main" component={Main} />
                    <SurfSplit.Screen name="buttons" component={Buttons} />
                    <SurfSplit.Screen name="checkbox" component={Checkbox} />
                </SurfSplit.Navigator>
            </NavigationContainer>
            <UILayoutManager />
        </>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: "row",
        padding: 10,
    },
    main: {
        backgroundColor: "white",
        minWidth: 300,
        marginRight: 10,
        borderRadius: 5,
    },
    detail: {
        backgroundColor: "white",
        flex: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default App;
