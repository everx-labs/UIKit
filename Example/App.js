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
import BigNumber from "bignumber.js";
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
    UIToggle,
    UIAmountInput,
    UIBankCardNumberInput,
    UIContractAddressInput,
    UIDateInput,
    UIDetailsInput,
    UIEmailInput,
    UILinkInput,
    UINumberInput,
    UIPhoneInput,
    UIPinCodeInput,
    UISearchBar,
    UISeedPhraseInput,
    UITextInput,
    UITransferInput,
    UIUploadFileInput,
    UIBadge,
    UIDot,
    UISeparator,
    UITag,
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
        <UIButton
            onPress={() => navigation.navigate("inputs")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Inputs"
        />
        <UIButton
            onPress={() => navigation.navigate("design")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Design"
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
    const [selectedToggle, setSelectedToggle] = useState(false);
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

function getNumberFormatInfo() {
    const formatParser = /111(\D*)222(\D*)333(\D*)444/g;
    const parts = formatParser.exec((111222333.444).toLocaleString()) || [
        "",
        "",
        "",
        ".",
    ];
    return {
        grouping: parts[1],
        thousands: parts[2],
        decimal: parts[3],
        decimalGrouping: "\u2009",
    };
}

function getDateFormatInfo() {
    const date = new Date(1986, 5, 7);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    // TODO: Uncomment once updated to RN0.59
    // const options = {
    //    year: 'numeric',
    //    month: '2-digit',
    //    day: 'numeric',
    // };
    // Not working for android due to RN using JavaScriptCore engine in non-debug mode
    // const localeDate = date.toLocaleDateString(undefined, options);
    const localeDate = "07/06/1986";
    const formatParser = /(\d{1,4})(\D{1})(\d{1,4})\D{1}(\d{1,4})/g;
    const parts = formatParser.exec(localeDate) || ["", "7", ".", "6", "1986"];

    const separator = parts[2] || ".";
    const components = ["year", "month", "day"];
    const symbols = {
        year: "YYYY",
        month: "MM",
        day: "DD",
    };

    const shortDateNumbers = [];
    const splitDate = localeDate.split(separator);
    splitDate.forEach((component) => shortDateNumbers.push(Number(component)));

    if (shortDateNumbers?.length === 3) {
        components[shortDateNumbers.indexOf(d)] = "day";
        components[shortDateNumbers.indexOf(m)] = "month";
        components[shortDateNumbers.indexOf(y)] = "year";
    }

    // TODO: Need to find a better way to get the pattern.
    let localePattern = `${symbols[components[0]]}${separator}`;
    localePattern = `${localePattern}${symbols[components[1]]}`;
    localePattern = `${localePattern}${separator}${symbols[components[2]]}`;

    return {
        separator,
        localePattern,
        components,
    };
}

let localeInfo = {
    name: "",
    numbers: getNumberFormatInfo(),
    dates: getDateFormatInfo(),
};

const Inputs = () => {
    const [amount, setAmount] = useState("");
    const [bankCardNumber, setBankCardNumber] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [date, setDate] = useState("");
    const [details, setDetails] = useState("");
    const [email, setEmail] = useState("");
    const [link, setLink] = useState("");
    const [number, setNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [search, setSearch] = useState("");
    const [seedPhrase, setSeedPhrase] = useState("");
    const mnemonicWords = ["report", "meadow", "village", "slight"];
    const [text, setText] = useState("");
    const [transfer, setTransfer] = useState(new BigNumber(0));
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
                <Text>UIAmountInput</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIAmountInput
                    placeholder="Amount"
                    comment="Some comment here"
                    value={amount}
                    onChangeText={(newText) => setAmount(newText)}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIAmountInput
                    placeholder="Amount"
                    comment="Some comment here"
                    value={amount}
                    trailingValue="$"
                    onChangeText={(newText) => setAmount(newText)}
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
                <Text>UIBankCardNumberInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIBankCardNumberInput
                    value={bankCardNumber}
                    onChangeText={(newText) => setBankCardNumber(newText)}
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
                <Text>UIContractAddressInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIContractAddressInput
                    value={contractAddress}
                    onChangeText={(newText) => setContractAddress(newText)}
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
                <Text>UIDateInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIDateInput
                    value={date}
                    onChangeText={(newText) => setDate(newText)}
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
                <Text>UIDetailsInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIDetailsInput
                    placeholder="Details"
                    comment="Some comment here"
                    value={details}
                    onChangeText={(newText) => setDetails(newText)}
                />
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIDetailsInput
                    placeholder="Multiline details"
                    comment="Some comment here"
                    value={details}
                    onChangeText={(newText) => setDetails(newText)}
                    maxLines={3}
                    containerStyle={{ marginTop: 16 }}
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
                <Text>UIEmailInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIEmailInput
                    placeholder="Email"
                    comment="Some comment here"
                    value={email}
                    onChangeText={(newText) => setEmail(newText)}
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
                <Text>UILinkInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UILinkInput
                    placeholder="Link"
                    comment="Some comment here"
                    value={link}
                    onChangeText={(newText) => setLink(newText)}
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
                <Text>UINumberInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UINumberInput
                    placeholder="Number"
                    comment="Some comment here"
                    value={number}
                    onChangeText={(newText) => setNumber(newText)}
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
                <Text>UIPhoneInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIPhoneInput
                    placeholder="Phone"
                    comment="Some comment here"
                    value={phone}
                    onChangeText={(newText) => setPhone(newText)}
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
                <Text>UIPinCodeInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIPinCodeInput
                    pinCodeLength={6}
                    pinTitle="Pin title"
                    pinDescription="Description"
                    pinCodeEnter={(pin) => {}}
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
                <Text>UISearchBar</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UISearchBar
                    value={search}
                    placeholder="Your search expression"
                    onChangeExpression={(newExpression) =>
                        setSearch(newExpression)
                    }
                />
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UISearchBar
                    value={search}
                    placeholder="Your search expression"
                    onChangeExpression={(newExpression) =>
                        setSearch(newExpression)
                    }
                    renderGlass
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
                <Text>UISeedPhraseInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UISeedPhraseInput
                    value={search}
                    value={seedPhrase}
                    onChangeText={(newText) => setSeedPhrase(newText)}
                    phraseToCheck={mnemonicWords.join(" - ")}
                    totalWords={12}
                    words={mnemonicWords}
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
                <Text>UITextInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UITextInput
                    value={search}
                    placeholder="Your text"
                    beginningTag="@"
                    value={text}
                    onChangeText={(newText) => setText(newText)}
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
                <Text>UITransferInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UITransferInput
                    value={transfer}
                    placeholder="Your transfer"
                    maxDecimals={3}
                    value={transfer}
                    onValueChange={(num) => setTransfer(num)}
                    localeInfo={localeInfo}
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
                <Text>UIUploadFileInput</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIUploadFileInput uploadText="Upload file" />
            </View>
        </ScrollView>
    );
};

const Design = () => (
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
            <Text>UIBadge</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIBadge badge={1} />
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
            <Text>UIDot</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDot />
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
            <Text>UISeparator</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UISeparator style={{ width: 300 }} />
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
            <Text>UITag</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITag title="Tag title" />
        </View>
    </ScrollView>
);

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
                    <SurfSplit.Screen name="inputs" component={Inputs} />
                    <SurfSplit.Screen name="design" component={Design} />
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
