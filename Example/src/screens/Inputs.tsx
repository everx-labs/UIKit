import * as React from 'react';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { View } from 'react-native';

import {
    UIMaterialTextView,
    UISeedPhraseTextView,
    UINumberTextView,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import {
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
    UITextInput,
    UITransferInput,
    UIUploadFileInput,
} from '@tonlabs/uikit.components';
import { UIAssets } from '@tonlabs/uikit.assets';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

function getNumberFormatInfo() {
    const formatParser = /111(\D*)222(\D*)333(\D*)444/g;
    const parts = formatParser.exec((111222333.444).toLocaleString()) || [
        '',
        '',
        '',
        '.',
    ];
    return {
        grouping: parts[1],
        thousands: parts[2],
        decimal: parts[3],
        decimalGrouping: '\u2009',
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
    const localeDate = '07/06/1986';
    const formatParser = /(\d{1,4})(\D{1})(\d{1,4})\D{1}(\d{1,4})/g;
    const parts = formatParser.exec(localeDate) || ['', '7', '.', '6', '1986'];

    const separator = parts[2] || '.';
    const components = ['year', 'month', 'day'];
    const symbols = {
        year: 'YYYY',
        month: 'MM',
        day: 'DD',
    };

    const shortDateNumbers: number[] = [];
    const splitDate = localeDate.split(separator);
    splitDate.forEach((component) => shortDateNumbers.push(Number(component)));

    if (shortDateNumbers?.length === 3) {
        components[shortDateNumbers.indexOf(d)] = 'day';
        components[shortDateNumbers.indexOf(m)] = 'month';
        components[shortDateNumbers.indexOf(y)] = 'year';
    }

    // TODO: Need to find a better way to get the pattern.
    // @ts-ignore
    let localePattern = `${symbols[components[0]]}${separator}`;
    // @ts-ignore
    localePattern = `${localePattern}${symbols[components[1]]}`;
    // @ts-ignore
    localePattern = `${localePattern}${separator}${symbols[components[2]]}`;

    return {
        separator,
        localePattern,
        components,
    };
}

const localeInfo = {
    name: '',
    numbers: getNumberFormatInfo(),
    dates: getDateFormatInfo(),
};

export const Inputs = () => {
    const [amount, setAmount] = useState('');
    const [bankCardNumber, setBankCardNumber] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [date, setDate] = useState('');
    const [details, setDetails] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [number, setNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [search] = useState('');
    const mnemonicWords = [
        'report',
        'replenish',
        'meadow',
        'village',
        'slight',
    ];
    const [text, setText] = useState('test');
    const [transfer, setTransfer] = useState(new BigNumber(0));
    return (
        <ExampleScreen>
            <ExampleSection title="UINumberTextView">
                <UINumberTextView
                    testID="uiNumberTextView_default"
                    placeholder="Put number"
                />
            </ExampleSection>
            <ExampleSection title="UIMaterialTextView">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIMaterialTextView
                        testID="uiMaterialTextView_default"
                        label="Label"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_initial_value"
                        label="Label with initial value"
                        value={text}
                        onChangeText={setText}
                        helperText="Hint"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_placeholder"
                        label="Label with placeholder"
                        onChangeText={setText}
                        helperText="Hint"
                        placeholder="Works with folded label"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_icons"
                        label="Input with right icon"
                        helperText="Hint"
                    >
                        <UIMaterialTextView.Icon
                            source={UIAssets.icons.ui.buttonClose}
                            tintColor={ColorVariants.IconSecondary}
                        />
                    </UIMaterialTextView>
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_icons"
                        label="Input with right icon"
                        helperText="Hint"
                    >
                        <UIMaterialTextView.Icon
                            source={UIAssets.icons.ui.buttonPlus}
                            tintColor={ColorVariants.IconSecondary}
                        />
                        <UIMaterialTextView.Icon
                            source={UIAssets.icons.ui.buttonClose}
                            tintColor={ColorVariants.IconSecondary}
                        />
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_action"
                        label="Input with right action"
                        helperText="Hint"
                    >
                        <UIMaterialTextView.Action>
                            Action
                        </UIMaterialTextView.Action>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_action"
                        label="Input with right text"
                        helperText="Hint"
                    >
                        <UIMaterialTextView.Text>Text</UIMaterialTextView.Text>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_without_floating"
                        floating={false}
                        label="Label"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_without_placeholder"
                        floating={false}
                        label="Label with initial value"
                        value={text}
                        onChangeText={setText}
                        helperText="Hint"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_action"
                        floating={false}
                        label="Input with right action"
                        helperText="Hint"
                    >
                        <UIMaterialTextView.Action>
                            Action
                        </UIMaterialTextView.Action>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_action"
                        floating={false}
                        label="Input with right text"
                        helperText="Hint"
                    >
                        <UIMaterialTextView.Text>Text</UIMaterialTextView.Text>
                    </UIMaterialTextView>
                </View>
            </ExampleSection>
            <ExampleSection title="UISeedPhraseTextView">
                <View style={{ paddingVertical: 20, width: '50%' }}>
                    <UISeedPhraseTextView
                        testID="uiSeedPhraseTextView_5_or_10"
                        words={mnemonicWords}
                        totalWords={[5, 10]}
                        validatePhrase={async (_phrase, parts) => {
                            if (parts == null) {
                                return false;
                            }
                            for (let i = 0; i < parts.length; i += 1) {
                                if (
                                    parts[i] !==
                                    mnemonicWords[i >= 5 ? i - 5 : i]
                                ) {
                                    return false;
                                }
                            }
                            if (parts.length === 5 || parts.length === 10) {
                                return true;
                            }
                            return false;
                        }}
                        onSuccess={() => {
                            console.log('valid!');
                        }}
                        onSubmit={() => {
                            console.log('submit');
                        }}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIAmountInput">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIAmountInput
                        testID="uiAmountInput_default"
                        placeholder="Amount"
                        comment="Some comment here"
                        value={amount}
                        onChangeText={(newText: string) => setAmount(newText)}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIAmountInput
                        testID="uiAmountInput_with_trailing_value"
                        placeholder="Amount"
                        comment="Some comment here"
                        value={amount}
                        trailingValue="$"
                        onChangeText={(newText: string) => setAmount(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIBankCardNumberInput">
                <View style={{ paddingVertical: 20 }}>
                    {/* $FlowFixMe */}
                    <UIBankCardNumberInput
                        testID="uiBankCardNumberInput_default"
                        value={bankCardNumber}
                        onChangeText={(newText: string) =>
                            setBankCardNumber(newText)
                        }
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIContractAddressInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIContractAddressInput
                        testID="uiContractAddressInput_default"
                        value={contractAddress}
                        onChangeText={(newText: string) =>
                            setContractAddress(newText)
                        }
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIDateInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIDateInput
                        testId="uiDateInput_default"
                        value={date}
                        onChangeText={(newText: string) => setDate(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIDetailsInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIDetailsInput
                        testID="uiDetailsInput_default"
                        placeholder="Details"
                        comment="Some comment here"
                        value={details}
                        onChangeText={(newText: string) => setDetails(newText)}
                    />
                </View>
                <View style={{ paddingVertical: 20 }}>
                    <UIDetailsInput
                        testID="uiDetailsInput_multiline"
                        placeholder="Multiline details"
                        comment="Some comment here"
                        value={details}
                        onChangeText={(newText: string) => setDetails(newText)}
                        maxLines={3}
                        containerStyle={{ marginTop: 16 }}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIEmailInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIEmailInput
                        testID="uiEmailInput_default"
                        placeholder="Email"
                        comment="Some comment here"
                        value={email}
                        onChangeText={(newText: string) => setEmail(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UILinkInput">
                <View style={{ paddingVertical: 20 }}>
                    <UILinkInput
                        testID="uiLinkInput_default"
                        placeholder="Link"
                        comment="Some comment here"
                        value={link}
                        onChangeText={(newText: string) => setLink(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UINumberInput">
                <View style={{ paddingVertical: 20 }}>
                    <UINumberInput
                        testID="uiNumberInput_default"
                        placeholder="Number"
                        comment="Some comment here"
                        value={number}
                        onChangeText={(newText: string) => setNumber(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIPhoneInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIPhoneInput
                        testID="uiPhoneInput_default"
                        placeholder="Phone"
                        comment="Some comment here"
                        value={phone}
                        onChangeText={(newText: string) => setPhone(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIPinCodeInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIPinCodeInput
                        testID="uiPinCodeInput_default"
                        pinCodeLength={6}
                        pinTitle="Pin title"
                        pinDescription="Description"
                        pinCodeEnter={() => undefined}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UITextInput">
                <View style={{ paddingVertical: 20 }}>
                    <UITextInput
                        testID="uiTextInput_default"
                        value={search}
                        placeholder="Your text"
                        beginningTag="@"
                        onChangeText={(newText: string) => setText(newText)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UITransferInput">
                <View style={{ paddingVertical: 20 }}>
                    <UITransferInput
                        testID="uiTransferInput_default"
                        value={transfer}
                        placeholder="Your transfer"
                        maxDecimals={3}
                        onValueChange={(num: BigNumber) => setTransfer(num)}
                        localeInfo={localeInfo}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIUploadFileInput">
                <View style={{ paddingVertical: 20 }}>
                    <UIUploadFileInput
                        testID="uiUploadFileInput_default"
                        uploadText="Upload file"
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
