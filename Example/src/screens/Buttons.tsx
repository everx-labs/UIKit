import * as React from 'react';
import { Text, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIButton, UIImageButton, UIScaleButton, UITextButton } from '@tonlabs/uikit.components';
import {
    UIBoxButton,
    UIBoxButtonIconPosition,
    UIBoxButtonType,
    UIBoxButtonVariant,
    UIMsgButton,
    UIMsgButtonCornerPosition,
    UIMsgButtonIconPosition,
    UIMsgButtonType,
    UIMsgButtonVariant,
} from '@tonlabs/uikit.hydrogen';
import { createStackNavigator } from '@tonlabs/uikit.navigation';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const Buttons = () => (
    <ExampleScreen>
        <ExampleSection title="UIBoxButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_primary_default"
                    title="Primary"
                    onPress={() => console.log('Pressed UIBoxButton primary')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_primary_negative"
                    title="Primary negative"
                    variant={UIBoxButtonVariant.Negative}
                    onPress={() => {
                        // empty
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_primary_positive"
                    title="Primary positive"
                    variant={UIBoxButtonVariant.Positive}
                    onPress={() => {
                        // empty
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    disabled
                    testID="uiBoxButton_primary_disabled"
                    title="Primary disabled"
                    onPress={() => {
                        // empty
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_primary_loading"
                    title="Action"
                    loading
                    onPress={() => console.log('Pressed UIBoxButton')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    icon={UIAssets.icons.ui.camera}
                    testID="uiBoxButton_primary_leftIcon"
                    title="Action"
                    onPress={() => console.log('Pressed UIBoxButton')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    icon={UIAssets.icons.ui.arrowUpRight}
                    iconPosition={UIBoxButtonIconPosition.Middle}
                    testID="uiBoxButton_primary_middleIcon"
                    title="Action"
                    onPress={() => console.log('Pressed UIBoxButton')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    icon={UIAssets.icons.ui.camera}
                    iconPosition={UIBoxButtonIconPosition.Right}
                    testID="uiBoxButton_primary_rightIcon"
                    title="Action"
                    onPress={() => console.log('Pressed UIBoxButton')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_secondary"
                    title="Secondary"
                    type={UIBoxButtonType.Secondary}
                    onPress={() => console.log('Pressed UIBoxButton secondary')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_secondary_negative"
                    title="Secondary negative"
                    type={UIBoxButtonType.Secondary}
                    variant={UIBoxButtonVariant.Negative}
                    onPress={() => console.log('Pressed UIBoxButton secondary negative')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_secondary_positive"
                    title="Secondary positive"
                    type={UIBoxButtonType.Secondary}
                    variant={UIBoxButtonVariant.Positive}
                    onPress={() => console.log('Pressed UIBoxButton secondary positive')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    disabled
                    testID="uiBoxButton_secondary_disabled"
                    title="Secondary disabled"
                    type={UIBoxButtonType.Secondary}
                    onPress={() => {
                        // empty
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_tertiary"
                    title="Tertiary"
                    type={UIBoxButtonType.Tertiary}
                    onPress={() => console.log('Pressed UIBoxButton tertiary')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_tertiary_negative"
                    title="Tertiary negative"
                    type={UIBoxButtonType.Tertiary}
                    variant={UIBoxButtonVariant.Negative}
                    onPress={() => console.log('Pressed UIBoxButton tertiary negative')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_tertiary_positive"
                    title="Tertiary positive"
                    type={UIBoxButtonType.Tertiary}
                    variant={UIBoxButtonVariant.Positive}
                    onPress={() => console.log('Pressed UIBoxButton tertiary positive')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    disabled
                    testID="uiBoxButton_tertiary_disabled"
                    title="Tertiary disabled"
                    type={UIBoxButtonType.Tertiary}
                    onPress={() => {
                        // empty
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_nulled"
                    title="Nulled"
                    type={UIBoxButtonType.Nulled}
                    onPress={() => console.log('Pressed UIBoxButton nulled')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_nulled_negative"
                    title="Nulled negative"
                    type={UIBoxButtonType.Nulled}
                    variant={UIBoxButtonVariant.Negative}
                    onPress={() => console.log('Pressed UIBoxButton nulled negative')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    testID="uiBoxButton_nulled_positive"
                    title="Nulled positive"
                    type={UIBoxButtonType.Nulled}
                    variant={UIBoxButtonVariant.Positive}
                    onPress={() => console.log('Pressed UIBoxButton nulled positive')}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    disabled
                    testID="uiBoxButton_nulled_disabled"
                    title="Nulled disabled"
                    type={UIBoxButtonType.Nulled}
                    onPress={() => {
                        // empty
                    }}
                />
            </View>
        </ExampleSection>

        <ExampleSection title="UIMsgButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    testID="uiMsgButton_default"
                    title="Action"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    testID="uiMsgButton_longTitle"
                    title="Action with a very loooooooong title"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    cornerPosition={UIMsgButtonCornerPosition.BottomLeft}
                    testID="uiMsgButton_cornerPosition_bottomLeft"
                    title="Action"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    disabled
                    testID="uiMsgButton_disabled"
                    title="Disabled"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    icon={UIAssets.icons.ui.camera}
                    testID="uiMsgButton_leftIcon_default"
                    title="Action"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    icon={UIAssets.icons.ui.arrowUpRight}
                    iconPosition={UIMsgButtonIconPosition.Middle}
                    testID="uiMsgButton_middleIcon"
                    title="Action"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    icon={UIAssets.icons.ui.camera}
                    iconPosition={UIMsgButtonIconPosition.Right}
                    testID="uiMsgButton_rightIcon"
                    title="Action"
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    testID="uiMsgButton_secondary"
                    title="Secondary"
                    type={UIMsgButtonType.Secondary}
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    testID="uiMsgButton_secondary_negative"
                    title="Secondary"
                    type={UIMsgButtonType.Secondary}
                    variant={UIMsgButtonVariant.Negative}
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    testID="uiMsgButton_secondary_positive"
                    title="Secondary"
                    type={UIMsgButtonType.Secondary}
                    variant={UIMsgButtonVariant.Positive}
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    testID="uiMsgButton_secondary_with_caption"
                    title="1.000000000 | Loooooooooooong title"
                    caption="Sell 1 · Buy 0 | Loooooooooooooooooooooooong caption"
                    cornerPosition={UIMsgButtonCornerPosition.TopLeft}
                    type={UIMsgButtonType.Secondary}
                    onPress={() => {
                        //
                    }}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIMsgButton
                    disabled
                    testID="uiMsgButton_secondary_disabled"
                    title="Secondary disabled"
                    type={UIMsgButtonType.Secondary}
                    onPress={() => {
                        //
                    }}
                />
            </View>
        </ExampleSection>

        <ExampleSection title="UIButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_default" title="Example" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_with_counter"
                    title="Example"
                    badge={2}
                />
            </View>
            <View
                style={{
                    maxWidth: 300,
                    paddingVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <UIButton
                    testID="uiButton_large"
                    title="Large"
                    buttonSize={UIButton.ButtonSize.Large}
                />
                <UIButton
                    testID="uiButton_medium"
                    title="Medium"
                    buttonSize={UIButton.ButtonSize.Medium}
                />
                <UIButton
                    testID="uiButton_small"
                    title="Small"
                    buttonSize={UIButton.ButtonSize.Small}
                />
                <UIButton
                    testID="uiButton_default_size"
                    title="Default"
                    buttonSize={UIButton.ButtonSize.Default}
                />
            </View>
            <View
                style={{
                    maxWidth: 300,
                    paddingVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <UIButton
                    testID="uiButton_radiused"
                    title="Radius"
                    buttonShape={UIButton.ButtonShape.Radius}
                />
                <UIButton
                    testID="uiButton_rounded"
                    title="Rounded"
                    buttonShape={UIButton.ButtonShape.Rounded}
                />
                <UIButton
                    testID="uiButton_full"
                    title="Full"
                    buttonShape={UIButton.ButtonShape.Full}
                />
                <UIButton
                    testID="uiButton_default_form"
                    title="Default"
                    buttonShape={UIButton.ButtonShape.Default}
                />
            </View>
            <View
                style={{
                    maxWidth: 300,
                    paddingVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <UIButton
                    testID="uiButton_default_style"
                    title="Full"
                    buttonStyle={UIButton.ButtonStyle.Full}
                />
                <UIButton
                    testID="uiButton_bordered"
                    title="Border"
                    buttonStyle={UIButton.ButtonStyle.Border}
                />
                <UIButton
                    testID="uiButton_as_link"
                    title="Link"
                    buttonStyle={UIButton.ButtonStyle.Link}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_counter_1"
                    title="Example"
                    count="1"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_with_data"
                    title="Example"
                    data="data"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_icon_left"
                    title="Icon left"
                    icon={UIAssets.icons.ui.arrowLeft}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_icon_right"
                    title="Icon right"
                    iconR={UIAssets.icons.ui.arrowLeft}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_with_tooltip"
                    title="With tooltip"
                    tooltip="Hi there!"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    testID="uiButton_disabled"
                    title="Disabled"
                    disabled
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_animation" showIndicator />
            </View>
        </ExampleSection>

        <ExampleSection title="UIImageButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton
                    testID="uiImageButton_back"
                    image={UIImageButton.Images.back}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton
                    testID="uiImageButton_close_primary"
                    image={UIImageButton.Images.closePrimary}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton
                    testID="uiImageButton_close_secondary"
                    image={UIImageButton.Images.closeSecondary}
                />
            </View>
            <View
                style={{
                    maxWidth: 300,
                    paddingVertical: 20,
                    backgroundColor: 'black',
                }}
            >
                <UIImageButton
                    testID="uiImageButton_close_dark_theme_secondary"
                    image={UIImageButton.Images.closeDarkThemeSecondary}
                />
            </View>
            <View
                style={{
                    maxWidth: 300,
                    paddingVertical: 20,
                    backgroundColor: 'black',
                }}
            >
                <UIImageButton
                    testID="uiImageButton_close_light"
                    image={UIImageButton.Images.closeLight}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton
                    testID="uiImageButton_menu"
                    image={UIImageButton.Images.menu}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton
                    testID="uiImageButton_menu_contained"
                    image={UIImageButton.Images.menuContained}
                />
            </View>
        </ExampleSection>

        <ExampleSection title="UIScaleButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIScaleButton testID="uiScaleButton_default">
                    <Text>Scale example</Text>
                </UIScaleButton>
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIScaleButton
                    testID="uiScaleButton_factor_2"
                    scaleInFactor={2}
                >
                    <Text>Scale example factor 2</Text>
                </UIScaleButton>
            </View>
        </ExampleSection>

        <ExampleSection title="UITextButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITextButton
                    testID="uiTextButton_default"
                    title="Text button"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITextButton
                    testID="uiTextButton_with_details"
                    title="Text button with details"
                    details="Some details"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITextButton
                    testID="uiTextButton_disabled"
                    disabled
                    title="Disabled text button"
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);

const ButtonsStack = createStackNavigator();

export function ButtonsScreen() {
    return (
        <ButtonsStack.Navigator>
            <ButtonsStack.Screen
                name="ButtonsWindow"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Buttons',
                }}
                component={Buttons}
            />
        </ButtonsStack.Navigator>
    );
}
