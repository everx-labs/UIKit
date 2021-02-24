import * as React from 'react';
import { Text, View } from 'react-native';

import {
    UIButton,
    UIImageButton,
    UIScaleButton,
    UITextButton,
} from '@tonlabs/uikit.components';
import { UIDetailsButton } from '@tonlabs/uikit.legacy';
import { UIAssets } from '@tonlabs/uikit.assets';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Buttons = () => (
    <ExampleScreen>
        <ExampleSection title="UIButton">
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <UIButton
                    title="Large"
                    buttonSize={UIButton.ButtonSize.Large}
                />
                <UIButton
                    title="Medium"
                    buttonSize={UIButton.ButtonSize.Medium}
                />
                <UIButton
                    title="Small"
                    buttonSize={UIButton.ButtonSize.Small}
                />
                <UIButton
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
                    title="Radius"
                    buttonShape={UIButton.ButtonShape.Radius}
                />
                <UIButton
                    title="Rounded"
                    buttonShape={UIButton.ButtonShape.Rounded}
                />
                <UIButton
                    title="Full"
                    buttonShape={UIButton.ButtonShape.Full}
                />
                <UIButton
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
                    title="Full"
                    buttonStyle={UIButton.ButtonStyle.Full}
                />
                <UIButton
                    title="Border"
                    buttonStyle={UIButton.ButtonStyle.Border}
                />
                <UIButton
                    title="Link"
                    buttonStyle={UIButton.ButtonStyle.Link}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton title="Example" count="1" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton title="Example" data="data" />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    title="Icon left"
                    icon={UIAssets.icons.ui.arrowLeft}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIButton
                    title="Icon right"
                    iconR={UIAssets.icons.ui.arrowLeft}
                />
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
        </ExampleSection>
        <ExampleSection title="UIDetailsButton">
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
                <UIDetailsButton
                    title="Example"
                    secondDetails="second details"
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIDetailsButton
                    title="Example"
                    details="long second details title title title title title title title"
                    truncDetails
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIImageButton">
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
                    backgroundColor: 'black',
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
                    backgroundColor: 'black',
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
        </ExampleSection>
        <ExampleSection title="UIScaleButton">
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
        </ExampleSection>
        <ExampleSection title="UITextButton">
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
        </ExampleSection>
    </ExampleScreen>
);
