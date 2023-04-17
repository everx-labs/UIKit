/* eslint-disable no-alert */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILargeTitleHeader } from '@tonlabs/uicast.bars';
import { UIQRCodeScannerSheet } from '@tonlabs/uicast.qr-code-scanner-sheet';
import {
    UICardSheet,
    UIBottomSheet,
    UIFullscreenSheet,
    UIModalSheet,
    UIPopup,
    UIActionSheetContainerChildType,
    useIntrinsicSizeScrollView,
} from '@tonlabs/uikit.popups';
import { ScrollView } from '@tonlabs/uikit.scrolls';
import { UIMaterialTextView } from '@tonlabs/uikit.inputs';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIBoxButton, UILinkButton } from '@tonlabs/uikit.controls';
import { UILabel, ColorVariants, useTheme, TypographyVariants } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIPinCode, UIPinCodeBiometryType } from '@tonlabs/uicast.pin-code';
import { UICountryPicker } from '@tonlabs/uicast.country-picker';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const onPress = () => {
    console.log('Action');
};

const customActionList: UIActionSheetContainerChildType[] = [
    <UIPopup.ActionSheet.CustomAction key="1">
        <UIPopup.ActionSheet.PrimaryColumn>
            <UIPopup.ActionSheet.ActionCell onPress={onPress} title="Action" />
        </UIPopup.ActionSheet.PrimaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="2">
        <UIPopup.ActionSheet.PrimaryColumn>
            <UIPopup.ActionSheet.ActionCell title="Section" />
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.TextCell>Text</UIPopup.ActionSheet.TextCell>
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="3">
        <UIPopup.ActionSheet.PrimaryColumn>
            <UIPopup.ActionSheet.TextCell>Text</UIPopup.ActionSheet.TextCell>
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.ActionCell title="Action" onPress={onPress} />
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="4">
        <UIPopup.ActionSheet.PrimaryColumn onPress={onPress} negative>
            <UIPopup.ActionSheet.ActionCell title="Negative" />
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.NumberCell>{1234567890}</UIPopup.ActionSheet.NumberCell>
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="5">
        <UIPopup.ActionSheet.PrimaryColumn onPress={onPress}>
            <UIPopup.ActionSheet.ActionCell title="Action" />
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} onPress={onPress} />
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="6">
        <UIPopup.ActionSheet.PrimaryColumn>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} />
            <UIPopup.ActionSheet.ActionCell title="Section" />
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.TextCell>Text</UIPopup.ActionSheet.TextCell>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} disabled />
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="7">
        <UIPopup.ActionSheet.PrimaryColumn>
            <UIPopup.ActionSheet.IconCell
                source={UIAssets.icons.ui.camera}
                tintColor={ColorVariants.TextAccent}
            />
            <UIPopup.ActionSheet.TextCell>Text</UIPopup.ActionSheet.TextCell>
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.ActionCell title="Action" onPress={onPress} />
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} onPress={onPress} />
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="8">
        <UIPopup.ActionSheet.PrimaryColumn onPress={onPress} negative>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} />
            <UIPopup.ActionSheet.ActionCell title="Negative" />
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.NumberCell>{1234567890}</UIPopup.ActionSheet.NumberCell>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} onPress={onPress} />
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,

    <UIPopup.ActionSheet.CustomAction key="9">
        <UIPopup.ActionSheet.PrimaryColumn onPress={onPress}>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} />
            <UIPopup.ActionSheet.ActionCell title="Action" />
        </UIPopup.ActionSheet.PrimaryColumn>
        <UIPopup.ActionSheet.SecondaryColumn>
            <UIPopup.ActionSheet.IconCell source={UIAssets.icons.ui.camera} onPress={onPress} />
            <UIPopup.ActionSheet.IconCell
                source={UIAssets.icons.ui.camera}
                onPress={onPress}
                tintColor={ColorVariants.TextAccent}
            />
        </UIPopup.ActionSheet.SecondaryColumn>
    </UIPopup.ActionSheet.CustomAction>,
];

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
                    paddingVertical: UILayoutConstant.contentInsetVerticalX4,
                    paddingHorizontal: UILayoutConstant.contentOffset,
                    borderRadius: Platform.select({ web: 10, default: 10 }),
                }}
            >
                <UIPinCode
                    label="PIN code"
                    description="Correct"
                    disabled={attempts === 0}
                    biometryType={UIPinCodeBiometryType.Face}
                    passcodeBiometryProvider={() => {
                        return Promise.resolve('123123');
                    }}
                    validate={(pin: string) => {
                        return new Promise<{ valid: boolean; description: string }>(resolve => {
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

function ModalWithLargeTitleSheet() {
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <UILinkButton
                testID="show_modal_largeTitleHeader"
                title="Show Modal with UILargeTitleHeader"
                onPress={() => {
                    setVisible(true);
                }}
            />
            <UIModalSheet
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                maxMobileWidth={900}
            >
                <LargeTitleSheetExample />
            </UIModalSheet>
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
                hasDefaultInset={false}
            >
                <FlexibleSizeBottomSheetContent setSheetVisible={setSheetVisible} />
            </UIBottomSheet>
        </>
    );
}

export function Menus() {
    const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
    const [cardSheetVisible, setCardSheetVisible] = React.useState(false);
    const [cardSheet2Visible, setCardSheet2Visible] = React.useState(false);
    const [bottomSheetVisible, setBottomSheetVisible] = React.useState(false);
    const [bottomSheetVisible2, setBottomSheetVisible2] = React.useState(false);
    const [countryPickerVisible, setCountryPickerVisible] = React.useState(false);
    const [isUIMenuVisible, setIsUIMenuVisible] = React.useState(false);

    const menuTriggerRef = React.useRef<TouchableOpacity>(null);
    const [isUIAlertViewVisible, setIsUIAlertViewVisible] = React.useState(false);

    const [visibleActionStartIndex, setVisibleActionStartIndex] = React.useState<number>(0);

    const getActionSheetCallback = React.useCallback(
        (message: string) => () => {
            console.log(message);
            if (message.includes('Cancel')) {
                setActionSheetVisible(false);
            }
            setVisibleActionStartIndex(prev => {
                if (prev > customActionList.length - 4) {
                    return 0;
                }
                return prev + 3;
            });
        },
        [],
    );
    const getAlertCallback = React.useCallback(
        (message: string) => () => {
            console.log(message);
            if (message.includes('Cancel')) {
                setIsUIAlertViewVisible(false);
            }
        },
        [],
    );

    const getMenuCallback = React.useCallback(
        (message: string) => () => {
            console.log(message);
            setIsUIMenuVisible(false);
        },
        [],
    );

    const [qrVisible, setQrVisible] = React.useState(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIAlertView">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        title="Show UIAlertView"
                        onPress={() => setIsUIAlertViewVisible(true)}
                    />
                    <UIPopup.AlertView
                        visible={isUIAlertViewVisible}
                        title="Please select your action"
                        note="You can select it later"
                        icon={{
                            source: UIAssets.icons.ui.search,
                            tintColor: ColorVariants.TextAccent,
                        }}
                    >
                        <UIPopup.AlertView.Action
                            type={UIPopup.AlertView.Action.Type.Neutral}
                            title="Neutral Action"
                            onPress={getAlertCallback('Neutral Action')}
                        />
                        <UIPopup.AlertView.Action
                            type={UIPopup.AlertView.Action.Type.Negative}
                            title="Negative Action"
                            onPress={getAlertCallback('Negative Action')}
                        />
                        <UIPopup.AlertView.Action
                            type={UIPopup.AlertView.Action.Type.Cancel}
                            title="Cancel Action"
                            onPress={getAlertCallback('Cancel Action')}
                        />
                    </UIPopup.AlertView>
                </View>
            </ExampleSection>
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
                        {customActionList.slice(
                            visibleActionStartIndex,
                            visibleActionStartIndex + 3,
                        )}
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Disabled}
                            title="Disabled Action"
                            onPress={getActionSheetCallback('Disabled Action')}
                        />
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Neutral}
                            title="Neutral Action"
                            onPress={getActionSheetCallback('Neutral Action')}
                        />
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Negative}
                            title="Negative Action"
                            onPress={getActionSheetCallback('Negative Action')}
                        />
                        <UIPopup.ActionSheet.Action
                            type={UIPopup.ActionSheet.Action.Type.Cancel}
                            title="Cancel Action"
                            onPress={getActionSheetCallback('Cancel Action')}
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
                    >
                        <View
                            style={{
                                paddingBottom: UILayoutConstant.contentOffset,
                                paddingHorizontal: UILayoutConstant.contentOffset,
                            }}
                        >
                            <UILabel>Hi there!</UILabel>
                            <UIBoxButton
                                title="close"
                                onPress={() => {
                                    setCardSheetVisible(false);
                                }}
                            />
                        </View>
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
                    >
                        <View
                            style={{
                                paddingBottom: UILayoutConstant.contentOffset,
                                paddingHorizontal: UILayoutConstant.contentOffset,
                            }}
                        >
                            <UIMaterialTextView label="Write smth" />
                            <UIBoxButton
                                title="close"
                                onPress={() => {
                                    setCardSheet2Visible(false);
                                }}
                            />
                        </View>
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
                    >
                        <View
                            style={{
                                paddingHorizontal: UILayoutConstant.contentOffset,
                            }}
                        >
                            <UILabel>Hi there!</UILabel>
                            <UIBoxButton
                                title="close"
                                onPress={() => {
                                    setBottomSheetVisible(false);
                                }}
                            />
                        </View>
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
                    >
                        <View
                            style={{
                                paddingHorizontal: UILayoutConstant.contentOffset,
                            }}
                        >
                            <UIMaterialTextView label="Write smth" />
                            <UIBoxButton
                                title="close"
                                onPress={() => {
                                    setBottomSheetVisible2(false);
                                }}
                            />
                        </View>
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
                    <FlexibleSizeBottomSheet />
                    <ModalWithLargeTitleSheet />
                </View>
            </ExampleSection>
            <ExampleSection title="UIMenu">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <TouchableOpacity ref={menuTriggerRef} onPress={() => setIsUIMenuVisible(true)}>
                        <UILabel color={ColorVariants.TextAccent} role={TypographyVariants.Action}>
                            Show UIMenu
                        </UILabel>
                    </TouchableOpacity>

                    <UIPopup.Menu
                        visible={isUIMenuVisible}
                        triggerRef={menuTriggerRef}
                        onClose={() => setIsUIMenuVisible(false)}
                    >
                        <UIPopup.Menu.CustomAction key="9">
                            <UIPopup.Menu.PrimaryColumn onPress={getMenuCallback('PrimaryColumn')}>
                                <UIPopup.Menu.IconCell source={UIAssets.icons.ui.camera} />
                                <UIPopup.Menu.ActionCell title="Let's try Long Action with many icons in the action." />
                            </UIPopup.Menu.PrimaryColumn>
                            <UIPopup.Menu.SecondaryColumn>
                                <UIPopup.Menu.IconCell
                                    source={UIAssets.icons.ui.camera}
                                    onPress={getMenuCallback('First IconCell')}
                                />
                                <UIPopup.Menu.IconCell
                                    source={UIAssets.icons.ui.camera}
                                    onPress={getMenuCallback('Second IconCell')}
                                    tintColor={ColorVariants.TextAccent}
                                />
                            </UIPopup.Menu.SecondaryColumn>
                        </UIPopup.Menu.CustomAction>
                        <UIPopup.Menu.Action
                            type={UIPopup.Menu.Action.Type.Neutral}
                            title="Neutral Action also can be long and it can be multiline. Let's see how it works."
                            onPress={getMenuCallback('Neutral Action')}
                        />
                        <UIPopup.Menu.Action
                            type={UIPopup.Menu.Action.Type.Negative}
                            title="Negative Action"
                            onPress={getMenuCallback('Negative Action')}
                        />
                        <UIPopup.Menu.Action
                            type={UIPopup.Menu.Action.Type.Disabled}
                            title="Disabled Action"
                            onPress={getMenuCallback('Disabled Action')}
                        />
                    </UIPopup.Menu>
                </View>
            </ExampleSection>
            <ExampleSection title="UITooltip">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPopup.Tooltip message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
                        <UILabel color={ColorVariants.TextAccent} role={TypographyVariants.Action}>
                            Show UITooltip
                        </UILabel>
                    </UIPopup.Tooltip>
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
