import * as React from 'react';
import BigNumber from 'bignumber.js';
import { View } from 'react-native';

import {
    UIMaterialTextView,
    UISeedPhraseTextView,
    UINumberTextView,
    UIAmountInput,
    UIAmountInputDecimalAspect,
    UIAmountInputRef,
    UISeedPhraseInput,
} from '@tonlabs/uikit.inputs';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UISearchBar } from '@tonlabs/uicast.bars';
import { UIAddressTextView } from '@tonlabs/uicast.address-text';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Inputs = () => {
    const amountPrecisionRef = React.useRef<UIAmountInputRef>(null);
    const mnemonicWords = ['report', 'village', 'slight'];
    const onChangeAmount = React.useCallback((amount: BigNumber | undefined) => {
        amountPrecisionRef.current?.changeAmount(amount, false);
    }, []);
    return (
        <ExampleScreen>
            <ExampleSection title="UISearchBar">
                <View style={{ maxWidth: 400, alignSelf: 'stretch' }}>
                    <UISearchBar />
                </View>
            </ExampleSection>
            <ExampleSection title="UISeedPhraseInput">
                <View style={{ maxWidth: 400, padding: 20, alignSelf: 'stretch' }}>
                    <UISeedPhraseInput
                        testID="uiNumberTextView_default"
                        totalWords={[3, 6]}
                        validatePhrase={async (_phrase, parts) => {
                            if (parts == null || (parts.length !== 3 && parts.length !== 6)) {
                                return false;
                                // return {
                                //     type: UISeedPhraseInputMessageType.Neutral,
                                //     message: 'Your neutral message',
                                // };
                            }
                            for (let i = 0; i < parts.length; i += 1) {
                                if (parts[i] !== mnemonicWords[i >= 3 ? i - 3 : i]) {
                                    return false;
                                    // return {
                                    //     type: UISeedPhraseInputMessageType.Error,
                                    //     message: 'Your error message',
                                    // };
                                }
                            }
                            return true;
                            // return {
                            //     type: UISeedPhraseInputMessageType.Success,
                            //     message: 'Your success message',
                            // };
                        }}
                        onSuccess={() => {
                            console.log('valid!');
                        }}
                        onSubmit={() => {
                            console.log('submit');
                        }}
                        placeholder={mnemonicWords.join(' ')}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UINumberTextView">
                <UINumberTextView testID="uiNumberTextView_default" placeholder="Put number" />
            </ExampleSection>
            <ExampleSection title="UIMaterialTextView">
                <View style={{ maxWidth: 400, padding: 20, alignSelf: 'stretch' }}>
                    <UIMaterialTextView
                        testID="uiMaterialTextView_without_label"
                        placeholder="Placeholder without Label"
                        helperText="Caption"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView testID="uiMaterialTextView_default" label="Label" />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_disabled"
                        label="Disabled"
                        editable={false}
                        helperText="Caption"
                    />
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_initial_value"
                        label="Label with initial value"
                        helperText="Caption"
                        defaultValue="Initial value"
                    >
                        <UIMaterialTextView.Action>
                            EVER
                            <UIImage source={UIAssets.icons.ui.unfoldShow} />
                        </UIMaterialTextView.Action>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_placeholder"
                        label="Label with placeholder"
                        helperText="Success"
                        success
                        placeholder="Works with folded label"
                    >
                        <UIMaterialTextView.Text>
                            <UIImage
                                source={UIAssets.icons.ui.camera}
                                style={{
                                    marginRight: 4,
                                }}
                            />
                            WEVER
                        </UIMaterialTextView.Text>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_icon"
                        label="Input with right icon"
                        helperText="Warning"
                        warning
                    >
                        <UIMaterialTextView.Icon
                            source={UIAssets.icons.ui.buttonClose}
                            tintColor={ColorVariants.IconSecondary}
                        />
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_icons"
                        label="Input with right icon"
                        helperText="Error"
                        error
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
                        helperText="Caption"
                    >
                        <UIMaterialTextView.Action>Action</UIMaterialTextView.Action>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_with_text"
                        label="Input with right text"
                        helperText="Caption"
                    >
                        <UIMaterialTextView.Text>Text</UIMaterialTextView.Text>
                    </UIMaterialTextView>
                    <View style={{ height: 20 }} />
                    <UIMaterialTextView
                        testID="uiMaterialTextView_multiline"
                        multiline
                        label="Input multiline"
                        helperText="Caption"
                        maxNumberOfLines={3}
                        defaultValue="Very long text that should be multiline and that is what we gonna check there"
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UISeedPhraseTextView">
                <View style={{ padding: 20, maxWidth: 400, alignSelf: 'stretch' }}>
                    <UISeedPhraseTextView
                        testID="uiSeedPhraseTextView_5_or_10"
                        words={mnemonicWords}
                        totalWords={[5, 10]}
                        validatePhrase={async (_phrase, parts) => {
                            if (parts == null) {
                                return false;
                            }
                            for (let i = 0; i < parts.length; i += 1) {
                                if (parts[i] !== mnemonicWords[i >= 5 ? i - 5 : i]) {
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
            <ExampleSection title="UIAddressInput">
                <View style={{ width: 300, paddingVertical: 20 }}>
                    <UIAddressTextView
                        testID="uiAddressInput_default"
                        label="Type address"
                        validateAddress={() => Promise.resolve(null)}
                        qrCode={{
                            parseData: () => {
                                return Promise.resolve(
                                    '0:00000000000000000000000000000000000000000000000000000000000',
                                );
                            },
                        }}
                    >
                        <UIMaterialTextView.Icon
                            source={UIAssets.icons.ui.buttonPlus}
                            tintColor={ColorVariants.TextAccent}
                        />
                    </UIAddressTextView>
                </View>
            </ExampleSection>
            <ExampleSection title="UIAmountInput">
                <View style={{ maxWidth: 400, padding: 20, alignSelf: 'stretch' }}>
                    <UIAmountInput
                        testID="uiMaterialTextView_amount"
                        placeholder="0.00"
                        label="Amount Currency"
                        message="Caption"
                        onChangeAmount={onChangeAmount}
                        defaultAmount={new BigNumber(123345.123567)}
                        decimalAspect={UIAmountInputDecimalAspect.Currency}
                    >
                        <UIAmountInput.Action>
                            EVER
                            <UIImage source={UIAssets.icons.ui.unfoldShow} />
                        </UIAmountInput.Action>
                    </UIAmountInput>
                    <View style={{ height: 20 }} />
                    <UIAmountInput
                        testID="uiMaterialTextView_amount"
                        placeholder="000"
                        label="Amount Integer"
                        message="Caption"
                        onChangeAmount={onChangeAmount}
                        decimalAspect={UIAmountInputDecimalAspect.Integer}
                    >
                        <UIAmountInput.Text>
                            <UIImage
                                source={UIAssets.icons.ui.camera}
                                style={{
                                    marginRight: 4,
                                }}
                            />
                            WEVER
                        </UIAmountInput.Text>
                    </UIAmountInput>
                    <View style={{ height: 20 }} />
                    <UIAmountInput
                        ref={amountPrecisionRef}
                        testID="uiMaterialTextView_amount"
                        placeholder="0.000"
                        label="Amount Precision"
                        message="9999.9999 is recommended"
                        onMessagePress={() => {
                            amountPrecisionRef.current?.changeAmount(
                                new BigNumber(9999.9999),
                                false,
                            );
                        }}
                        onChangeAmount={_value => null}
                        decimalAspect={UIAmountInputDecimalAspect.Precision}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
