/* eslint-disable no-alert */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { Platform, StatusBar, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIPopover, UIPopoverMenu } from '@tonlabs/uikit.navigation_legacy';
import { UILargeTitleHeader } from '@tonlabs/uicast.bars';
import { UIQRCodeScannerSheet } from '@tonlabs/uicast.qr-code-scanner-sheet';
import { UICardSheet, UIBottomSheet, UIFullscreenSheet } from '@tonlabs/uikit.popups';
import { ScrollView } from '@tonlabs/uikit.scrolls';
import { UIPopup } from '@tonlabs/uikit.popups';
import { UIMaterialTextView } from '@tonlabs/uikit.inputs';
import { UIBoxButton, UILinkButton } from '@tonlabs/uikit.controls';
import { UILabel, ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIPinCode, UIPinCodeBiometryType } from '@tonlabs/uicast.pin-code';
import { UICountryPicker } from '@tonlabs/uicast.country-picker';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

function PinCodeMenu() {
    const theme = useTheme();
    const [isVisible, setVisible] = React.useState(false);
    const insets = useSafeAreaInsets();
    const [attempts, setAttempts] = React.useState(5);

    return (
        <>
            <UILinkButton
                testID="show_lockscreen"
                title="Show LockScreen"
                onPress={() => {
                    setVisible(true);
                }}
            />
            <UIFullscreenSheet
                visible={isVisible}
                hasOpenAnimation={false}
                forId="lockScreen"
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    paddingBottom: Math.max(insets?.bottom || 0, UIConstant.contentOffset()),
                    borderRadius: Platform.select({ web: 10, default: 0 }),
                }}
            >
                <UIPinCode
                    label="PIN code"
                    description="Correct"
                    disabled={attempts === 0}
                    isBiometryEnabled
                    biometryType={UIPinCodeBiometryType.Face}
                    getPasscodeWithBiometry={() => {
                        return Promise.resolve('123123');
                    }}
                    onEnter={(pin: string) => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                if (pin === '123123') {
                                    setAttempts(5);
                                    resolve({
                                        valid: true,
                                        description: 'Looks good!',
                                    });
                                } else {
                                    setAttempts(attempts - 1);
                                    resolve({
                                        valid: false,
                                        description: 'Sth wrong!',
                                    });
                                }
                            }, 500);
                        });
                    }}
                    onSuccess={() => {
                        setVisible(false);
                    }}
                />
            </UIFullscreenSheet>
        </>
    );
}

export const actionSheet = React.createRef<typeof UIPopup.ActionSheet>();

function BigBottomSheet() {
    const theme = useTheme();
    const [bigBottomSheetVisible, setBigBottomSheetVisible] = React.useState(false);
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    return (
        <>
            <UILinkButton
                testID="show_big_uiBottomSheet"
                title="Show Big UIBottomSheet"
                onPress={() => {
                    setBigBottomSheetVisible(true);
                }}
            />
            <UIBottomSheet
                visible={bigBottomSheetVisible}
                onClose={() => {
                    setBigBottomSheetVisible(false);
                }}
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    // padding: 20,
                    paddingBottom: Math.max(insets?.bottom || 0, UIConstant.contentOffset()),
                    borderRadius: 10,
                }}
            >
                <View
                    style={{
                        height: 100,
                    }}
                />
                <ScrollView
                    style={{
                        height:
                            height -
                            (StatusBar.currentHeight ?? 0) -
                            insets.top -
                            Math.max(insets?.bottom ?? 0, UIConstant.contentOffset()) -
                            100,
                    }}
                >
                    <UILabel>Hello!</UILabel>
                    {new Array(9)
                        .fill(null)
                        .map((_el, i) => (i + 1) / 10)
                        .map(opacity => (
                            <View
                                key={opacity}
                                style={{
                                    height: 100,
                                    backgroundColor: `rgba(255,0,0,${opacity})`,
                                }}
                            />
                        ))}
                </ScrollView>
            </UIBottomSheet>
        </>
    );
}

function BigBottomLargeTitleSheet() {
    const theme = useTheme();
    const [bigBottomSheetVisible, setBigBottomSheetVisible] = React.useState(false);
    return (
        <>
            <UILinkButton
                testID="show_big_uiBottomSheet_largeTitleHeader"
                title="Show Big UIBottomSheet with UILargeTitleHeader"
                onPress={() => {
                    setBigBottomSheetVisible(true);
                }}
            />
            <UIFullscreenSheet
                visible={bigBottomSheetVisible}
                onClose={() => {
                    setBigBottomSheetVisible(false);
                }}
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    borderRadius: Platform.select({ web: 10, default: 10 }),
                    overflow: 'hidden',
                }}
            >
                <UILargeTitleHeader title="Very long title">
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                    >
                        <UILabel>Hello!</UILabel>
                        {new Array(9)
                            .fill(null)
                            .map((_el, i) => (i + 1) / 10)
                            .map(opacity => (
                                <View
                                    key={opacity}
                                    style={{
                                        height: 100,
                                        backgroundColor: `rgba(255,0,0,${opacity})`,
                                    }}
                                />
                            ))}
                    </ScrollView>
                </UILargeTitleHeader>
            </UIFullscreenSheet>
        </>
    );
}

const getCallback = (message: string, setVisible: (visible: boolean) => void) => () => {
    console.log(message);
    if (message.includes('Сancel')) {
        setVisible(false);
    }
};

export const Menus = () => {
    const theme = useTheme();
    const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
    const [cardSheetVisible, setCardSheetVisible] = React.useState(false);
    const [cardSheet2Visible, setCardSheet2Visible] = React.useState(false);
    const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
    const [countryPickerVisible, setCountryPickerVisible] = React.useState(false);

    const [qrVisible, setQrVisible] = React.useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIActionSheet">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="show_actionSheet"
                        title="Show ActionSheet"
                        onPress={() => setActionSheetVisible(true)}
                    />
                    <UIPopup.ActionSheet
                        visible={actionSheetVisible}
                        note="A short description of the actions goes here."
                    >
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Disabled}
                            title="Disabled Action"
                            onPress={getCallback('Disabled Action', setActionSheetVisible)}
                        />
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Neutral}
                            title="Neutral Action"
                            onPress={getCallback('Neutral Action', setActionSheetVisible)}
                        />
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Negative}
                            title="Negative Action"
                            onPress={getCallback('Negative Action', setActionSheetVisible)}
                        />
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Cancel}
                            title="Cancel Action"
                            onPress={getCallback('Cancel Action', setActionSheetVisible)}
                        />
                    </UIPopup.ActionSheet>
                </View>
            </ExampleSection>
            <ExampleSection title="UICountryPicker">
                <View style={{ paddingVertical: 20 }}>
                    <UIBoxButton title="tap" onPress={() => setCountryPickerVisible(true)} />
                    <UICountryPicker
                        visible={countryPickerVisible}
                        onSelect={countryCode => {
                            console.log(countryCode);
                            setCountryPickerVisible(false);
                        }}
                        onClose={() => setCountryPickerVisible(false)}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UICardSheet">
                <View style={{ paddingVertical: 20 }}>
                    <UILinkButton
                        testID="show_uiCardSheet"
                        title="Show UICardSheet"
                        onPress={() => {
                            setCardSheetVisible(true);
                        }}
                    />
                    <UICardSheet
                        visible={cardSheetVisible}
                        onClose={() => {
                            setCardSheetVisible(false);
                        }}
                        style={{
                            backgroundColor: theme[ColorVariants.BackgroundPrimary],
                            padding: 20,
                            borderRadius: 10,
                        }}
                    >
                        <UILabel>Hi there!</UILabel>
                        <UIBoxButton
                            title="close"
                            onPress={() => {
                                setCardSheetVisible(false);
                            }}
                        />
                    </UICardSheet>
                    <UILinkButton
                        testID="show_uiCardSheet_with_input"
                        title="Show UICardSheet with input"
                        onPress={() => {
                            setCardSheet2Visible(true);
                        }}
                    />
                    <UICardSheet
                        visible={cardSheet2Visible}
                        onClose={() => {
                            setCardSheet2Visible(false);
                        }}
                        style={{
                            backgroundColor: theme[ColorVariants.BackgroundPrimary],
                            padding: 20,
                            borderRadius: 10,
                        }}
                    >
                        <UIMaterialTextView label="Write smth" />
                        <UIBoxButton
                            title="close"
                            onPress={() => {
                                setCardSheet2Visible(false);
                            }}
                        />
                    </UICardSheet>
                    <UILinkButton
                        testID="show_uiBottomSheet"
                        title="Show UIBottomSheet"
                        onPress={() => {
                            setBottomSheetVisible(true);
                        }}
                    />
                    <SafeAreaInsetsContext.Consumer>
                        {insets => (
                            <UIBottomSheet
                                visible={bottomSheetVisible}
                                onClose={() => {
                                    setBottomSheetVisible(false);
                                }}
                                style={{
                                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                                    padding: 20,
                                    paddingBottom: Math.max(
                                        insets?.bottom || 0,
                                        UIConstant.contentOffset(),
                                    ),
                                    borderRadius: 10,
                                }}
                            >
                                <UILabel>Hi there!</UILabel>
                                <UIBoxButton
                                    title="close"
                                    onPress={() => {
                                        setBottomSheetVisible(false);
                                    }}
                                />
                            </UIBottomSheet>
                        )}
                    </SafeAreaInsetsContext.Consumer>
                    <BigBottomSheet />
                    <UILinkButton
                        testID="show_uiQRCodeScannerSheet"
                        title="Show UIQRcodeScannerSheet"
                        onPress={() => {
                            setQrVisible(true);
                        }}
                    />
                    <UIQRCodeScannerSheet
                        visible={qrVisible}
                        onClose={() => {
                            setQrVisible(false);
                        }}
                        onRead={() => {
                            setQrVisible(false);
                        }}
                    />
                    <PinCodeMenu />
                    <BigBottomLargeTitleSheet />
                </View>
            </ExampleSection>
            <ExampleSection title="UIPopover">
                <View style={{ paddingVertical: 20 }}>
                    <UIPopover placement="top" component={<Text>This is a popover</Text>}>
                        <UILinkButton testID="show_uiPopover" title="Show UIPopover" />
                    </UIPopover>
                </View>
            </ExampleSection>
            <ExampleSection title="UIPopoverMenu">
                <View style={{ paddingVertical: 20 }}>
                    <UIPopoverMenu
                        placement="top"
                        menuItemsList={[
                            {
                                title: 'Item 1',
                                onPress: () => alert('Action 1 was called'),
                            },
                            {
                                title: 'Item 2',
                                onPress: () => alert('Action 2 was called'),
                            },
                        ]}
                    >
                        <UILinkButton title="Show UIPopoverMenu" />
                    </UIPopoverMenu>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
