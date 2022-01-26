/* eslint-disable no-alert */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UIConstant } from '@tonlabs/uikit.core';
import { UIPopover, UIPopoverMenu } from '@tonlabs/uikit.navigation_legacy';
import { UILargeTitleHeader } from '@tonlabs/uicast.bars';
import { UIQRCodeScannerSheet } from '@tonlabs/uicast.qr-code-scanner-sheet';
import {
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UIPageSheet,
    UIPopup,
    useIntrinsicSizeScrollView,
} from '@tonlabs/uikit.popups';
import { ScrollView } from '@tonlabs/uikit.scrolls';
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
                    padding: UIConstant.contentOffset(),
                    borderRadius: Platform.select({ web: 10, default: 10 }),
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

function LargeTitleSheetExample() {
    return (
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
                    borderRadius: 10,
                }}
            >
                <LargeTitleSheetExample />
            </UIFullscreenSheet>
        </>
    );
}

function FlexibleSizeBottomSheetContent({
    setSheetVisible,
}: {
    setSheetVisible: (val: boolean) => void;
}) {
    const [blocksCount, setBlocksCount] = React.useState(1);
    const { style: scrollIntrinsicStyle, onContentSizeChange } = useIntrinsicSizeScrollView();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: insets.bottom,
            }}
            // @ts-expect-error
            containerStyle={scrollIntrinsicStyle}
            onContentSizeChange={onContentSizeChange}
        >
            {new Array(blocksCount).fill(null).map((_, index) => (
                <View
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    style={{
                        height: 100,
                        marginBottom: 10,
                        borderRadius: 10,
                        backgroundColor: `rgba(255,0,0,${(index + 1) / 10})`,
                    }}
                />
            ))}
            <UIBoxButton
                title="increase"
                disabled={blocksCount > 9}
                layout={{ marginBottom: 10 }}
                onPress={() => {
                    setBlocksCount(Math.min(blocksCount + 1, 10));
                }}
            />
            <UIBoxButton
                disabled={blocksCount < 2}
                title="decrease"
                layout={{ marginBottom: 10 }}
                onPress={() => {
                    setBlocksCount(Math.max(blocksCount - 1, 0));
                }}
            />
            <UIBoxButton
                title="close"
                onPress={() => {
                    setSheetVisible(false);
                }}
            />
        </ScrollView>
    );
}

function FlexibleSizeBottomSheet() {
    const theme = useTheme();
    const [sheetVisible, setSheetVisible] = React.useState(false);

    return (
        <>
            <UILinkButton
                testID="show_flexible_uibottomsheet"
                title="Show flexible size UIBottomSheet"
                onPress={() => {
                    setSheetVisible(true);
                }}
            />
            <UIBottomSheet
                visible={sheetVisible}
                onClose={() => {
                    setSheetVisible(false);
                }}
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    paddingTop: 20,
                }}
                hasDefaultInset={false}
            >
                <FlexibleSizeBottomSheetContent setSheetVisible={setSheetVisible} />
            </UIBottomSheet>
        </>
    );
}

function PageWithLargeTitleSheet() {
    const theme = useTheme();
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <UILinkButton
                testID="show_page_with_largeTitleHeader"
                title="Show UIPageSheet with UILargeTitleHeader"
                onPress={() => {
                    setVisible(true);
                }}
            />
            <UIPageSheet
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                style={{
                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                    borderRadius: 10,
                }}
            >
                <LargeTitleSheetExample />
            </UIPageSheet>
        </>
    );
}

const getCallback = (message: string, setVisible: (visible: boolean) => void) => () => {
    console.log(message);
    if (message.includes('Cancel')) {
        setVisible(false);
    }
};

export const Menus = () => {
    const theme = useTheme();
    const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
    const [cardSheetVisible, setCardSheetVisible] = React.useState(false);
    const [cardSheet2Visible, setCardSheet2Visible] = React.useState(false);
    const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
    const [bottomSheetVisible2, setBottomSheetVisible2] = React.useState(false);
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
                    <UIBottomSheet
                        visible={bottomSheetVisible}
                        onClose={() => {
                            setBottomSheetVisible(false);
                        }}
                        style={{
                            backgroundColor: theme[ColorVariants.BackgroundPrimary],
                            padding: 20,
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
                    <UILinkButton
                        testID="show_uiBottomSheet_with_input"
                        title="Show UIBottomSheet with input"
                        onPress={() => {
                            setBottomSheetVisible2(true);
                        }}
                    />
                    <UIBottomSheet
                        visible={bottomSheetVisible2}
                        onClose={() => {
                            setBottomSheetVisible2(false);
                        }}
                        style={{
                            backgroundColor: theme[ColorVariants.BackgroundPrimary],
                            padding: 20,
                        }}
                    >
                        <UIMaterialTextView label="Write smth" />
                        <UIBoxButton
                            title="close"
                            onPress={() => {
                                setBottomSheetVisible2(false);
                            }}
                        />
                    </UIBottomSheet>
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
                    <FlexibleSizeBottomSheet />
                    <PageWithLargeTitleSheet />
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
