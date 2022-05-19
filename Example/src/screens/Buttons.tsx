import * as React from 'react';
import { View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UIActionButton,
    UIActionButtonType,
    UIBoxButton,
    UIBoxButtonIconPosition,
    UIBoxButtonType,
    UIBoxButtonVariant,
    UILinkButton,
    UILinkButtonIconPosition,
    UILinkButtonType,
    UIMsgButton,
    UIMsgButtonCornerPosition,
    UIMsgButtonIconPosition,
    UIMsgButtonType,
    UIMsgButtonVariant,
    UIPillButton,
    UIPillButtonIconPosition,
    UIPillButtonVariant,
    UIShowMoreButton,
    UIShowMoreButtonHeight,
    UIWideBoxButton,
    UIWideBoxButtonType,
    UIPressableArea,
} from '@tonlabs/uikit.controls';
import { ColorVariants, UIBackgroundView, UILabel } from '@tonlabs/uikit.themes';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export function ButtonsScreen() {
    const [progress, setProgress] = React.useState<boolean>(false);
    const onPress = React.useCallback(() => {
        setProgress(true);
        setTimeout(() => {
            setProgress(false);
        }, 3000);
    }, []);
    return (
        <ExampleScreen>
            <ExampleSection title="UIPressableArea">
                <UIPressableArea onPress={() => console.log('UIPressableArea')}>
                    <View
                        style={{
                            marginTop: 20,
                            width: 200,
                            height: 40,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'lightblue',
                        }}
                    >
                        <UILabel>UIPressableArea</UILabel>
                    </View>
                </UIPressableArea>
            </ExampleSection>
            <ExampleSection title="UIWideBoxButton">
                <View
                    style={{
                        maxWidth: 600,
                        alignSelf: 'stretch',
                        padding: 20,
                        alignItems: 'stretch',
                    }}
                >
                    <UIWideBoxButton
                        type={UIWideBoxButtonType.Primary}
                        title="Primary"
                        caption="caption"
                        icon={UIAssets.icons.ui.plus}
                        onPress={() => console.log('UIWideBoxButtonType.Primary')}
                        loading={false}
                        disabled={false}
                    />
                    <UIWideBoxButton
                        type={UIWideBoxButtonType.Secondary}
                        title="Secondary"
                        caption="caption"
                        icon={UIAssets.icons.ui.plus}
                        onPress={() => console.log('UIWideBoxButtonType.Secondary')}
                        loading={false}
                        disabled={false}
                    />
                    <UIBackgroundView
                        color={ColorVariants.BackgroundOverlay}
                        style={{ height: 1 }}
                    />
                    <UIWideBoxButton
                        type={UIWideBoxButtonType.Nulled}
                        title="Nulled"
                        caption="caption"
                        icon={UIAssets.icons.ui.plus}
                        onPress={() => console.log('UIWideBoxButtonType.Nulled')}
                        loading={false}
                        disabled={false}
                    />
                    <UIBackgroundView
                        color={ColorVariants.BackgroundOverlay}
                        style={{ height: 1 }}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIActionButton">
                <View
                    style={{
                        maxWidth: 600,
                        paddingVertical: 20,
                        flexDirection: 'row',
                        paddingHorizontal: 4,
                    }}
                >
                    <View
                        style={{
                            maxWidth: 300,
                            paddingHorizontal: 4,
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <UILabel style={{ paddingBottom: 8 }}>Primary:</UILabel>
                        <UIActionButton
                            type={UIActionButtonType.Primary}
                            testID="uiActionButton_primary_default"
                            title="Title"
                            icon={UIAssets.icons.ui.plus}
                            onPress={onPress}
                            loading={progress}
                        />
                        <View style={{ height: 8 }} />
                        <UIActionButton
                            type={UIActionButtonType.Primary}
                            testID="uiActionButton_primary_default"
                            icon={UIAssets.icons.ui.plus}
                            onPress={onPress}
                            loading={progress}
                        />
                        <View style={{ height: 8 }} />
                        <UIActionButton
                            type={UIActionButtonType.Primary}
                            testID="uiActionButton_primary_default"
                            title="Title"
                            onPress={onPress}
                            loading={progress}
                        />
                        <View style={{ height: 8 }} />
                        <UIActionButton
                            type={UIActionButtonType.Primary}
                            testID="uiActionButton_primary_default"
                            title="Disabled"
                            onPress={() => console.log('Pressed UIActionButton primary')}
                            icon={UIAssets.icons.ui.plus}
                            loading={progress}
                            disabled
                        />
                    </View>
                    <View
                        style={{
                            maxWidth: 300,
                            paddingHorizontal: 8,
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <UILabel style={{ paddingBottom: 8 }}>Accent:</UILabel>
                        <UIActionButton
                            type={UIActionButtonType.Accent}
                            testID="uiActionButton_accent_default"
                            title="Title"
                            icon={UIAssets.icons.ui.plus}
                            onPress={onPress}
                            loading={progress}
                        />
                        <View style={{ height: 8 }} />
                        <UIActionButton
                            type={UIActionButtonType.Accent}
                            testID="uiActionButton_accent_default"
                            icon={UIAssets.icons.ui.plus}
                            onPress={onPress}
                            loading={progress}
                        />
                        <View style={{ height: 8 }} />
                        <UIActionButton
                            type={UIActionButtonType.Accent}
                            testID="uiActionButton_accent_default"
                            title="Title"
                            onPress={onPress}
                            loading={progress}
                        />
                        <View style={{ height: 8 }} />
                        <UIActionButton
                            type={UIActionButtonType.Accent}
                            testID="uiActionButton_primary_default"
                            title="Disabled"
                            icon={UIAssets.icons.ui.plus}
                            onPress={() => console.log('Pressed UIActionButton accent')}
                            loading={progress}
                            disabled
                        />
                    </View>
                </View>
            </ExampleSection>
            <ExampleSection title="UIShowMoreButton">
                <View
                    style={{
                        width: 300,
                        paddingVertical: 20,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                >
                    <UIShowMoreButton
                        testID="uiBoxButton_primary_default"
                        label="Show more"
                        onPress={onPress}
                        progress={progress}
                    />
                    <UIShowMoreButton
                        testID="uiBoxButton_primary_default"
                        label="Show more"
                        onPress={onPress}
                        background={false}
                        progress={progress}
                    />
                </View>
                <View
                    style={{
                        width: 300,
                        paddingVertical: 20,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                >
                    <UIShowMoreButton
                        testID="uiBoxButton_primary_default"
                        label="Show more"
                        onPress={onPress}
                        height={UIShowMoreButtonHeight.Small}
                        progress={progress}
                    />
                    <UIShowMoreButton
                        testID="uiBoxButton_primary_default"
                        label="Show more"
                        onPress={onPress}
                        background={false}
                        height={UIShowMoreButtonHeight.Small}
                        progress={progress}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIBoxButton">
                <View
                    style={{
                        maxWidth: 600,
                        alignSelf: 'stretch',
                        padding: 20,
                        alignItems: 'stretch',
                    }}
                >
                    <UIBoxButton
                        testID="uiBoxButton_primary_default"
                        title="Primary"
                        onPress={() => console.log('Pressed UIBoxButton primary')}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_primary_negative"
                        title="Primary negative"
                        variant={UIBoxButtonVariant.Negative}
                        onPress={() => {
                            // empty
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_primary_positive"
                        title="Primary positive"
                        variant={UIBoxButtonVariant.Positive}
                        onPress={() => {
                            // empty
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        disabled
                        testID="uiBoxButton_primary_disabled"
                        title="Primary disabled"
                        onPress={() => {
                            // empty
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_primary_loading"
                        title="Action"
                        loading
                        onPress={() => console.log('Pressed UIBoxButton')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        icon={UIAssets.icons.ui.camera}
                        testID="uiBoxButton_primary_leftIcon"
                        title="Action"
                        onPress={() => console.log('Pressed UIBoxButton')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        icon={UIAssets.icons.ui.arrowUpRight}
                        iconPosition={UIBoxButtonIconPosition.Middle}
                        testID="uiBoxButton_primary_middleIcon"
                        title="Action"
                        onPress={() => console.log('Pressed UIBoxButton')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        icon={UIAssets.icons.ui.camera}
                        iconPosition={UIBoxButtonIconPosition.Right}
                        testID="uiBoxButton_primary_rightIcon"
                        title="Action"
                        onPress={() => console.log('Pressed UIBoxButton')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_secondary"
                        title="Secondary"
                        type={UIBoxButtonType.Secondary}
                        onPress={() => console.log('Pressed UIBoxButton secondary')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_secondary_negative"
                        title="Secondary negative"
                        type={UIBoxButtonType.Secondary}
                        variant={UIBoxButtonVariant.Negative}
                        onPress={() => console.log('Pressed UIBoxButton secondary negative')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_secondary_positive"
                        title="Secondary positive"
                        type={UIBoxButtonType.Secondary}
                        variant={UIBoxButtonVariant.Positive}
                        onPress={() => console.log('Pressed UIBoxButton secondary positive')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        disabled
                        testID="uiBoxButton_secondary_disabled"
                        title="Secondary disabled"
                        type={UIBoxButtonType.Secondary}
                        onPress={() => {
                            // empty
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_tertiary"
                        title="Tertiary"
                        type={UIBoxButtonType.Tertiary}
                        onPress={() => console.log('Pressed UIBoxButton tertiary')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_tertiary_negative"
                        title="Tertiary negative"
                        type={UIBoxButtonType.Tertiary}
                        variant={UIBoxButtonVariant.Negative}
                        onPress={() => console.log('Pressed UIBoxButton tertiary negative')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_tertiary_positive"
                        title="Tertiary positive"
                        type={UIBoxButtonType.Tertiary}
                        variant={UIBoxButtonVariant.Positive}
                        onPress={() => console.log('Pressed UIBoxButton tertiary positive')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        disabled
                        testID="uiBoxButton_tertiary_disabled"
                        title="Tertiary disabled"
                        type={UIBoxButtonType.Tertiary}
                        onPress={() => {
                            // empty
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_nulled"
                        title="Nulled"
                        type={UIBoxButtonType.Nulled}
                        onPress={() => console.log('Pressed UIBoxButton nulled')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_nulled_negative"
                        title="Nulled negative"
                        type={UIBoxButtonType.Nulled}
                        variant={UIBoxButtonVariant.Negative}
                        onPress={() => console.log('Pressed UIBoxButton nulled negative')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        testID="uiBoxButton_nulled_positive"
                        title="Nulled positive"
                        type={UIBoxButtonType.Nulled}
                        variant={UIBoxButtonVariant.Positive}
                        onPress={() => console.log('Pressed UIBoxButton nulled positive')}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIBoxButton
                        disabled
                        testID="uiBoxButton_nulled_disabled"
                        title="Nulled disabled"
                        type={UIBoxButtonType.Nulled}
                        onPress={() => {
                            // empty
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                </View>
            </ExampleSection>

            <ExampleSection title="UILinkButton">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="uiLinkButton_default"
                        title="Action"
                        onPress={() => console.log('Pressed UILinkButton')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="uiLinkButton_leftIcon"
                        title="Action"
                        icon={UIAssets.icons.ui.camera}
                        iconPosition={UILinkButtonIconPosition.Left}
                        onPress={() => console.log('Pressed UILinkButton with left icon')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="uiLinkButton_middleIcon"
                        title="Action"
                        icon={UIAssets.icons.ui.arrowUpRight}
                        iconPosition={UILinkButtonIconPosition.Middle}
                        onPress={() => console.log('Pressed UILinkButton with middle icon')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="uiLinkButton_rightIcon"
                        title="Action"
                        icon={UIAssets.icons.ui.camera}
                        iconPosition={UILinkButtonIconPosition.Right}
                        onPress={() => console.log('Pressed UILinkButton with right icon')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="uiLinkButton_secondary"
                        title="Action"
                        type={UILinkButtonType.Menu}
                        onPress={() => console.log('Pressed secondary UILinkButton')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UILinkButton
                        testID="uiLinkButton_withCaption"
                        title="Action"
                        caption="Caption"
                        onPress={() => console.log('Pressed UILinkButton with caption')}
                    />
                </View>
            </ExampleSection>

            <ExampleSection title="UIMsgButton">
                <View
                    style={{
                        maxWidth: 600,
                        alignSelf: 'stretch',
                        padding: 20,
                        alignItems: 'stretch',
                    }}
                >
                    <UIMsgButton
                        testID="uiMsgButton_default"
                        title="Action"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        cornerPosition={UIMsgButtonCornerPosition.TopRight}
                        testID="uiMsgButton_longTitle"
                        title="Action"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                        variant={UIMsgButtonVariant.Negative}
                    />
                    <UIMsgButton
                        cornerPosition={UIMsgButtonCornerPosition.BottomLeft}
                        testID="uiMsgButton_cornerPosition_bottomLeft"
                        title="Action"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                        variant={UIMsgButtonVariant.Positive}
                    />
                    <UIMsgButton
                        disabled
                        testID="uiMsgButton_disabled"
                        title="Disabled"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        disabled
                        testID="uiMsgButton_loading"
                        title="Disabled"
                        onPress={() => {
                            //
                        }}
                        loading
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        icon={UIAssets.icons.ui.camera}
                        testID="uiMsgButton_leftIcon_default"
                        title="Action"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        icon={UIAssets.icons.ui.arrowUpRight}
                        iconPosition={UIMsgButtonIconPosition.Middle}
                        testID="uiMsgButton_middleIcon"
                        title="Action"
                        caption="Sell 1 · Buy 0 | short caption"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        icon={UIAssets.icons.ui.camera}
                        iconPosition={UIMsgButtonIconPosition.Right}
                        testID="uiMsgButton_rightIcon"
                        title="Action"
                        caption="Sell 1 · Buy 0 | Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong caption"
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        testID="uiMsgButton_secondary"
                        title="Secondary"
                        type={UIMsgButtonType.Secondary}
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        testID="uiMsgButton_secondary_negative"
                        title="Secondary"
                        type={UIMsgButtonType.Secondary}
                        variant={UIMsgButtonVariant.Negative}
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        testID="uiMsgButton_secondary_positive"
                        title="Secondary"
                        type={UIMsgButtonType.Secondary}
                        variant={UIMsgButtonVariant.Positive}
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        testID="uiMsgButton_secondary_with_caption"
                        title="1.000000000 | Loooooooooooong title"
                        caption="Sell 1 · Buy 0 | Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong caption"
                        cornerPosition={UIMsgButtonCornerPosition.TopLeft}
                        type={UIMsgButtonType.Secondary}
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        testID="uiMsgButton_secondary_loading"
                        title="Secondary"
                        type={UIMsgButtonType.Secondary}
                        onPress={() => {
                            //
                        }}
                        loading
                        layout={{
                            marginTop: 20,
                        }}
                    />
                    <UIMsgButton
                        disabled
                        testID="uiMsgButton_secondary_disabled"
                        title="Secondary disabled"
                        type={UIMsgButtonType.Secondary}
                        onPress={() => {
                            //
                        }}
                        layout={{
                            marginTop: 20,
                        }}
                    />
                </View>
            </ExampleSection>

            <ExampleSection title="UIPillButton">
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        testID="uiPillButton_default"
                        title="Action"
                        onPress={() => console.log('Pressed UIPillButton')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        testID="uiPillButton_negative"
                        title="Action negative"
                        variant={UIPillButtonVariant.Negative}
                        onPress={() => console.log('Pressed UIPillButton negative action')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        testID="uiPillButton_positive"
                        title="Action positive"
                        variant={UIPillButtonVariant.Positive}
                        onPress={() => console.log('Pressed UIPillButton positive action')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        disabled
                        testID="uiPillButton_disabled"
                        title="Action disabled"
                        onPress={() => {
                            // empty
                        }}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        testID="uiPillButton_loading"
                        title="Action"
                        loading
                        onPress={() => {
                            //
                        }}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        icon={UIAssets.icons.ui.arrowUpRight}
                        testID="uiPillButton_leftIcon"
                        title="Action"
                        onPress={() => console.log('Pressed UIBoxButton')}
                    />
                </View>
                <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                    <UIPillButton
                        icon={UIAssets.icons.ui.arrowUpRight}
                        iconPosition={UIPillButtonIconPosition.Right}
                        testID="uiPillButton_rightIcon"
                        title="Action"
                        onPress={() => console.log('Pressed UIBoxButton')}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
}
