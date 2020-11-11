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
    SafeAreaView,
    ScrollView,
    Platform,
} from "react-native";
import BigNumber from "bignumber.js";
// $FlowFixMe
import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from '@react-navigation/stack';
// $FlowFixMe
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
// $FlowFixMe
import { createSurfSplitNavigator } from "react-navigation-surf";

import { UIColor, UIStyle } from "@uikit/core";
import {
    UIButton,
    UILayoutManager,
    UICheckboxItem,
    UIDetailsCheckbox,
    UIDetailsRadio,
    UIDetailsToggle,
    UIDetailsTable,
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
    UIActionImage,
    UIImage,
    UIImageButton,
    UIGrid,
    UIGridColumn,
    UISlider,
    UIStepBar,
    UITabView,
    UINotice,
    UINotificationBadge,
    UIToastMessage,
    UITooltip,
    UIAlert,
    UIAlertView,
    UIDropdownAlert,
    UIBackgroundView,
    UILabel,
    UIListHeader,
    UISectionHeader,
} from "@uikit/components";
import {
    UICountryPicker,
    UIImageView,
    UIActionSheet,
    UICustomSheet,
    UIPopover,
    UIPopoverBackground,
    UIPopoverMenu,
} from "@uikit/navigation";
import {
    UIBottomBar,
    UIDetailsButton,
    UIFeedback,
    UIPushFeedback,
    UIStubPage,
    UITokenCell,
    UIProfileInitials,
    UIProfilePhoto,
    UIProfileView,
} from "@uikit/legacy";
import UIAssets from "@uikit/assets";
import { UIChatList } from "@tonlabs/uikit.chats";

if (Platform.OS === "web") {
    // Head Element
    const headElement = document.getElementsByTagName("head")[0];

    // Import PTRootUIWeb
    const ptRootFontBold = headElement.appendChild(
        document.createElement("link")
    );
    ptRootFontBold.setAttribute(
        "href",
        "https://tonlabs.io/fonts/PT%20Root%20UI_Bold.css"
    );
    ptRootFontBold.setAttribute("rel", "stylesheet");
    const ptRootFontLight = headElement.appendChild(
        document.createElement("link")
    );
    ptRootFontLight.setAttribute(
        "href",
        "https://tonlabs.io/fonts/PT%20Root%20UI_Light.css"
    );
    ptRootFontLight.setAttribute("rel", "stylesheet");
    const ptRootFontMedium = headElement.appendChild(
        document.createElement("link")
    );
    ptRootFontMedium.setAttribute(
        "href",
        "https://tonlabs.io/fonts/PT%20Root%20UI_Medium.css"
    );
    ptRootFontMedium.setAttribute("rel", "stylesheet");
    const ptRootFontRegular = headElement.appendChild(
        document.createElement("link")
    );
    ptRootFontRegular.setAttribute(
        "href",
        "https://tonlabs.io/fonts/PT%20Root%20UI_Regular.css"
    );
    ptRootFontRegular.setAttribute("rel", "stylesheet");
}

const SurfSplit = createSurfSplitNavigator();

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
                <UICheckboxItem editable onPress={() => {}} selected />
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

const localeInfo = {
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
                {/* $FlowFixMe */}
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

const Images = () => (
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
            <Text>UIActionImage</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIActionImage
                iconEnabled={UIAssets.keyThinDark}
                iconDisabled={UIAssets.keyThinGrey}
                iconHovered={UIAssets.keyThinWhite}
            />
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIActionImage
                iconEnabled={UIAssets.keyThinDark}
                iconDisabled={UIAssets.keyThinGrey}
                iconHovered={UIAssets.keyThinWhite}
                disabled
            />
        </View>
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
            <Text>UIImage</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            {/* $FlowFixMe */}
            <UIImage source={UIAssets.keyThinDark} />
        </View>
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
            <Text>UIImageView (press it)</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIImageView
                photoStyle={{ width: 100, height: 100 }}
                source={UIAssets.keyThinDark}
                editable
            />
        </View>
    </ScrollView>
);

const Layouts = () => (
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
            <Text>UIDetailsTable</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIDetailsTable
                detailsList={[
                    {
                        caption: "row 1",
                        value: "value 1",
                    },
                    {
                        caption: "row 2",
                        value: "value 2",
                        type: UIDetailsTable.CellType.Success,
                    },
                    {
                        caption: "row 3",
                        value: "value 3",
                        type: UIDetailsTable.CellType.Action,
                    },
                    {
                        caption: "row 4",
                        value: "value 4",
                        type: UIDetailsTable.CellType.Accent,
                    },
                    {
                        caption: "row 5",
                        value: "7,900,404 (98.8 %)",
                        type: UIDetailsTable.CellType.NumberPercent,
                    },
                ]}
            />
        </View>
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
            <Text>UIGrid</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIGrid type={UIGrid.Type.C6} style={styles.grid}>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={3}
                >
                    <UIButton
                        title="3 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.warning() }}
                    medium={3}
                >
                    <UIButton
                        title="3 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
            </UIGrid>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIGrid type={UIGrid.Type.C8} style={styles.grid}>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.warning() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={2}
                >
                    <UIButton
                        title="2 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.warning() }}
                    medium={4}
                >
                    <UIButton
                        title="4 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.warning() }}
                    medium={3}
                >
                    <UIButton
                        title="3 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.warning() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
            </UIGrid>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UIGrid
                type={UIGrid.Type.C12}
                style={styles.grid}
                gutter={4}
                rowGutter={8}
            >
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={4}
                >
                    <UIButton
                        title="4 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={4}
                >
                    <UIButton
                        title="4 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={4}
                >
                    <UIButton
                        title="4 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
                <UIGridColumn
                    style={{ backgroundColor: UIColor.success() }}
                    medium={1}
                >
                    <UIButton
                        title="1 cells"
                        buttonStyle={UIButton.ButtonStyle.Border}
                    />
                </UIGridColumn>
            </UIGrid>
        </View>
    </ScrollView>
);

const actionSheet = React.createRef<UIActionSheet>();
const customSheet = React.createRef<UICustomSheet>();

const Menus = () => {
    const [activeIndex, setActiveIndex] = useState(0);
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
                <Text>UIActionSheet</Text>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITextButton
                    title="Show ActionSheet"
                    onPress={() => {
                        if (actionSheet.current) {
                            actionSheet.current.show(
                                [
                                    {
                                        title: "Item 1",
                                        onPress: () =>
                                            alert("Action 1 was called"),
                                    },
                                    {
                                        title: "Item 2",
                                        onPress: () =>
                                            alert("Action 2 was called"),
                                    },
                                ],
                                true
                            );
                        }
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
                <Text>UICountryPicker</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UITextButton
                    title="Show UICountryPicker"
                    onPress={() => UICountryPicker.show({})}
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
                <Text>UICustomSheet</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UITextButton
                    title="Show UICustomSheet"
                    onPress={() => {
                        if (customSheet.current) {
                            customSheet.current.show();
                        }
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
                <Text>UIPopover</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIPopover
                    placement="top"
                    component={<Text>This is a popover</Text>}
                >
                    <UITextButton title="Show UIPopover" />
                </UIPopover>
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
                <Text>UIPopoverMenu</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIPopoverMenu
                    placement="top"
                    menuItemsList={[
                        {
                            title: "Item 1",
                            onPress: () => alert("Action 1 was called"),
                        },
                        {
                            title: "Item 2",
                            onPress: () => alert("Action 2 was called"),
                        },
                    ]}
                >
                    <UITextButton title="Show UIPopoverMenu" />
                </UIPopoverMenu>
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
                <Text>UISlider</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UISlider
                    itemsList={[
                        {
                            title: "Card 1",
                            details: "details",
                        },
                        {
                            title: "Card 2",
                            details: "details",
                        },
                        {
                            title: "Card 3",
                            details: "details",
                        },
                        {
                            title: "Card 4",
                            details: "details",
                        },
                        {
                            title: "Card 5",
                            details: "details",
                        },
                    ]}
                    itemRenderer={({ title, details }) => (
                        <View
                            key={`slider-item-${title}-${details}`}
                            style={{ width: 200, height: 200 }}
                        >
                            <Text>{title}</Text>
                            <Text>{details}</Text>
                        </View>
                    )}
                    itemWidth={256}
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
                <Text>UIStepBar</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UIStepBar
                    itemsList={["Item 1", "Item 2", "Item 3", "Item 4"]}
                    activeIndex={activeIndex}
                    onPress={(i) => setActiveIndex(i)}
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
                <Text>UITabView</Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
                <UITabView
                    width={95}
                    pages={[
                        {
                            title: "Left",
                            component: <Text>Some left content</Text>,
                        },
                        {
                            title: "Center",
                            component: <Text>Some center content</Text>,
                        },
                        {
                            title: "Right",
                            component: <Text>Some right content</Text>,
                        },
                    ]}
                />
            </View>
        </ScrollView>
    );
};

const Notifications = () => (
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
            <Text>UINotice</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show default notice with message only"
                onPress={() =>
                    UINotice.showMessage(
                        "System is going down at midnight tonight. We’ll notify you when it’s back up."
                    )
                }
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
            <Text>UINotificationBadge</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UINotificationBadge value={100} />
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
            <Text>UIToastMessage</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show default notice with message only"
                onPress={() =>
                    UIToastMessage.showMessage(
                        "System is going down at midnight tonight."
                    )
                }
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
            <Text>UITooltip</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITooltip message="Message one">
                <Text style={{ fontSize: 16 }}> Trigger 1</Text>
            </UITooltip>
            <UITooltip message="Message two with more text for two lines to see second option of layout.">
                <Text style={{ fontSize: 16 }}> Trigger 2</Text>
            </UITooltip>
            <UITooltip message="Message three is huge, with five lines of text wich contains more usefull information for all users and many-many bla-bla-bla to see maximum height of tooltip. You can add here some instructions.">
                <Text style={{ fontSize: 16 }}> Trigger 3</Text>
            </UITooltip>
            <UITextButton
                title="Show onMouse tooltip"
                onPress={() =>
                    UITooltip.showOnMouseForWeb("Message of onMouse tooltip")
                }
            />
            <UITextButton
                title="Hide onMouse tooltip"
                onPress={() => UITooltip.hideOnMouseForWeb()}
            />
        </View>
    </ScrollView>
);

const Popups = () => (
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
            <Text>UIAlert</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show UIAlert"
                onPress={() =>
                    UIAlert.showAlert({
                        title: "This is the title",
                        description: "This is the alert description",
                        // Receives an array of button arrays
                        buttons: [
                            [
                                { title: "Button Left", onPress: () => {} },
                                { title: "Button Right", onPress: () => {} },
                            ],
                            [{ title: "Single Button", onPress: () => {} }],
                        ],
                    })
                }
            />
        </View>
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
            <Text>UIAlertView</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show UIAlertView"
                onPress={() =>
                    UIAlertView.showAlert("Title", "Some message here", [
                        { title: "Ok" },
                    ])
                }
            />
        </View>
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
            <Text>UIDropdownAlert</Text>
        </View>
        <View style={{ maxWidth: 300, paddingVertical: 20 }}>
            <UITextButton
                title="Show UIDropdownAlert"
                onPress={() =>
                    UIDropdownAlert.showNotification(
                        "This is a UIDropdownAlert"
                    )
                }
            />
        </View>
    </ScrollView>
);

const Products = () => (
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
            <Text>UIBackgroundView</Text>
        </View>
        <View
            style={{
                width: 300,
                height: 300,
                paddingVertical: 20,
                position: "relative",
            }}
        >
            <UIBackgroundView
                screenWidth={300}
                presetName={UIBackgroundView.PresetNames.Secondary}
            />
        </View>
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
            <Text>UIBottomBar</Text>
        </View>
        <View style={{ maxWidth: 500, height: 180, paddingVertical: 20 }}>
            <UIBottomBar
                leftText="Feedback"
                companyName="Wallet solutions OÜ"
                address="Jõe 2"
                postalCode="10151"
                location="Tallinn, Estonia"
                email="os@ton.space"
                phoneNumber="+372 7124030"
                copyRight="2018-2019 © TON Labs"
            />
        </View>
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
            <Text>UIFeedback</Text>
        </View>
        <View style={{ maxWidth: 500, paddingVertical: 20 }}>
            <UIFeedback />
        </View>
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
            <Text>UIPushFeedback</Text>
        </View>
        <View style={{ maxWidth: 500, paddingVertical: 20 }}>
            <UIPushFeedback onPress={() => {}} />
        </View>
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
            <Text>UIStubPage</Text>
        </View>
        <View style={{ maxWidth: 500, paddingVertical: 20 }}>
            <UIStubPage
                title="labs."
                needBottomIcon={false}
                presetName={UIBackgroundView.PresetNames.Action}
            />
        </View>
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
            <Text>UITokenCell</Text>
        </View>
        <View style={{ width: 300, paddingVertical: 20 }}>
            <UITokenCell title="GRAM" details="balance" balance="100.0000" />
        </View>
    </ScrollView>
);

const Profile = () => (
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
            <Text>UIProfileInitials</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIProfileInitials
                containerStyle={[
                    UIStyle.Margin.bottomDefault(),
                    UIStyle.Margin.rightDefault(),
                ]}
                id={1}
                initials="AM"
            />
        </View>
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
            <Text>UIProfilePhoto</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIProfilePhoto source={UIAssets.faceId} />
        </View>
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
            <Text>UIProfilePhoto</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIProfileView
                editable
                containerStyle={{ marginRight: 16 }}
                photo={UIAssets.faceId}
                hasSecondName
                name="John"
                secondName="Doe"
                namePlaceholder="Name"
                secondNamePlaceholder="Second name"
                details="Details"
                autoCapitalize="words"
            />
        </View>
    </ScrollView>
);

const TextScreen = () => (
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
            <Text>UILabel</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UILabel
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                role={UILabel.Role.Description}
            />
        </View>
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
            <Text>UIListHeader</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UIListHeader title="List header" />
        </View>
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
            <Text>UISectionHeader</Text>
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UISectionHeader
                title="Section header"
                titleRight="Title on the right side" // This will be rendered on the right side of the header
                containerStyle={{ marginBottom: 16 }}
            />
        </View>
        <View
            style={{
                minWidth: 300,
                paddingVertical: 20,
            }}
        >
            <UISectionHeader
                title="Section header with border on top"
                needBorder
            />
        </View>
    </ScrollView>
);

const Chat = () => (
    <UIChatList
        areStickersVisible={false}
        onLoadEarlierMessages={() => {}}
        canLoadMore={true}
        isLoadingMore={false}
        messages={[
            {
                type: "stk",
                status: "pending",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                source: {
                    uri:
                        "https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928",
                },
            },
            {
                type: "stk",
                status: "sent",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                source: {
                    uri:
                        "https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928",
                },
            },
            {
                type: "stk",
                status: "received",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:123",
                source: {
                    uri:
                        "https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928",
                },
            },
            {
                type: "sys",
                status: "sent",
                time: Math.floor(Date.now() - 1 * 60 * 1000), // TODO: is this mandatory field for system message?
                sender: "0:000", // TODO: is this mandatory field for system message?
                text: "This is a system message",
            },
            {
                type: "trx",
                status: "sent",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                info: {
                    type: "aborted",
                    amount: new BigNumber(1),
                },
                comment: {
                    text: "Pocket money",
                },
                onPress() {
                    console.log("hey");
                },
            },
            {
                type: "trx",
                status: "received",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                info: {
                    type: "aborted",
                    amount: new BigNumber(1),
                },
            },
            {
                type: "trx",
                status: "sent",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                info: {
                    type: "expense",
                    amount: new BigNumber(1),
                    text: "Sent",
                },
                comment: {
                    text: "Some money",
                    encrypted: true,
                },
            },
            {
                type: "trx",
                status: "received",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                info: {
                    type: "expense",
                    amount: new BigNumber(1),
                    text: "Sent",
                },
            },
            {
                type: "trx",
                status: "sent",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                info: {
                    type: "income",
                    amount: new BigNumber(9999.123456789),
                    text: "Received",
                },
            },
            {
                type: "trx",
                status: "received",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                info: {
                    type: "income",
                    amount: new BigNumber(1),
                    text: "Received",
                },
                comment: {
                    text: "Take it",
                    encrypted: true,
                },
            },
            {
                type: "stm",
                status: "sending",
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: "0:000",
                text: "This one is in process of sending...",
            },
            {
                type: "stm",
                status: "received",
                time: Math.floor(Date.now() - 2 * 60 * 1000),
                sender: "0:123",
                text: "How r u?",
            },
            {
                type: "stm",
                status: "sent",
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: "0:000",
                text: "This one is from me",
            },
            {
                type: "stm",
                status: "received",
                time: Math.floor(Date.now() - 5 * 60 * 1000),
                sender: "0:123",
                text:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                type: "stm",
                status: "received",
                time: Math.floor(Date.now() - 5 * 60 * 1000),
                sender: "0:123",
                text: "Hi there!",
            },
            {
                type: "stm",
                status: "received",
                time: new Date("10 06 2020 10:00").getTime(),
                sender: "0:123",
                text: "Hi from past!",
            },
        ].map((m: any, i: number) => ((m.key = i), m))}
    />
);

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
        <UIButton
            onPress={() => navigation.navigate("images")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Images"
        />
        <UIButton
            onPress={() => navigation.navigate("layouts")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Layouts"
        />
        <UIButton
            onPress={() => navigation.navigate("menus")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Menus"
        />
        <UIButton
            onPress={() => navigation.navigate("notifications")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Notifications"
        />
        <UIButton
            onPress={() => navigation.navigate("popups")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Popups"
        />
        <UIButton
            onPress={() => navigation.navigate("products")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Products"
        />
        <UIButton
            onPress={() => navigation.navigate("profile")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Profile"
        />
        <UIButton
            onPress={() => navigation.navigate("text")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Text"
        />
        <UIButton
            onPress={() => navigation.navigate("chat")}
            buttonStyle={UIButton.ButtonStyle.Link}
            title="Chat"
        />
    </SafeAreaView>
);

const App: () => React$Node = () => {
    const navRef = React.useRef();
    useReduxDevToolsExtension(navRef);

    const main = (
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
                    <SurfSplit.Screen name="images" component={Images} />
                    <SurfSplit.Screen name="layouts" component={Layouts} />
                    <SurfSplit.Screen name="menus" component={Menus} />
                    <SurfSplit.Screen
                        name="notifications"
                        component={Notifications}
                    />
                    <SurfSplit.Screen name="popups" component={Popups} />
                    <SurfSplit.Screen name="products" component={Products} />
                    <SurfSplit.Screen name="profile" component={Profile} />
                    <SurfSplit.Screen name="text" component={TextScreen} />
                    <SurfSplit.Screen name="chat" component={Chat} />
                </SurfSplit.Navigator>
            </NavigationContainer>
            <UILayoutManager />
            <UIActionSheet ref={actionSheet} masterSheet={false} />
            <UIActionSheet />
            <UICountryPicker navigation={navRef.current} isShared />
            <UICustomSheet
                ref={customSheet}
                masterSheet={false}
                component={
                    <>
                        <Text>This is custom sheet!</Text>
                        <UIButton
                            title="close"
                            onPress={() => {
                                if (customSheet.current) {
                                    customSheet.current.hide();
                                }
                            }}
                        />
                    </>
                }
            />
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <UINotice />
            </View>
            <UIAlert />
            <UIAlertView />
            <UIDropdownAlert />
        </>
    );

    if (Platform.OS !== "web") {
        return main;
    }

    return <UIPopoverBackground>{main}</UIPopoverBackground>;
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
