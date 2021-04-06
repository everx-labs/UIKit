import * as React from 'react';
import { Text, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UIButton,
    UIImageButton,
    UIScaleButton,
    UITextButton,
} from '@tonlabs/uikit.components';
import { UIBoxButton } from '@tonlabs/uikit.hydrogen';
import { UIDetailsButton } from '@tonlabs/uikit.legacy';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Buttons = () => (
    <ExampleScreen>
        <ExampleSection title="UIBoxButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIBoxButton
                    icon={UIAssets.icons.ui.camera}
                    title="UIBoxButtonAction"
                    onPress={() => console.log('Pressed UIBoxButton')}
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_default" title="Example" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_with_counter" title="Example" badge={2} />
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
                <UIButton testID="uiButton_counter_1" title="Example" count="1" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_with_data" title="Example" data="data" />
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
                <UIButton testID="uiButton_with_tooltip" title="With tooltip" tooltip="Hi there!" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_disabled" title="Disabled" disabled />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton testID="uiButton_animation" showIndicator />
            </View>
        </ExampleSection>
        <ExampleSection title="UIDetailsButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsButton testID="uiDetailsButton_default" title="Example" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsButton testID="uiDetailsButton_animation" title="Example" progress />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsButton testID="uiDetailsButton_details" title="Example" details="details" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsButton
                    testID="uiDetailsButton_second_details"
                    title="Example"
                    secondDetails="second details"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsButton
                    testID="uiDetailsButton_long_details"
                    title="Example"
                    details="long second details title title title title title title title"
                    truncDetails
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIImageButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton testID="uiImageButton_back" image={UIImageButton.Images.back} />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton testID="uiImageButton_close_primary" image={UIImageButton.Images.closePrimary} />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageButton testID="uiImageButton_close_secondary" image={UIImageButton.Images.closeSecondary} />
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
                <UIScaleButton testID="uiScaleButton_factor_2" scaleInFactor={2}>
                    <Text>Scale example factor 2</Text>
                </UIScaleButton>
            </View>
        </ExampleSection>
        <ExampleSection title="UITextButton">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UITextButton testID="uiTextButton_default" title="Text button" />
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
