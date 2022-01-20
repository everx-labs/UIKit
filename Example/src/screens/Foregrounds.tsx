import * as React from 'react';
import { View } from 'react-native';

import { UIForeground } from '@tonlabs/uicast.rows';
import { UIAssets } from '@tonlabs/uikit.assets';
import { ColorVariants } from '@tonlabs/uikit.themes';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

const foregroundList = (
    <>
        <UIForeground.Container>
            <UIForeground.PrimaryPart>
                <UIForeground.ActionElement onPress={() => null} title="Action" />
            </UIForeground.PrimaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart>
                <UIForeground.ActionElement title="Section" />
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.TextElement>Text</UIForeground.TextElement>
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart>
                <UIForeground.TextElement>Text</UIForeground.TextElement>
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.ActionElement title="Action" onPress={() => null} />
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart onPress={() => null} negative>
                <UIForeground.ActionElement title="Negative" />
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.NumberElement>{1234567890}</UIForeground.NumberElement>
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart onPress={() => null}>
                <UIForeground.ActionElement title="Action" />
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} onPress={() => null} />
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} />
                <UIForeground.ActionElement title="Section" />
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.TextElement>Text</UIForeground.TextElement>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} disabled />
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart>
                <UIForeground.IconElement
                    source={UIAssets.icons.ui.camera}
                    tintColor={ColorVariants.TextAccent}
                />
                <UIForeground.TextElement>Text</UIForeground.TextElement>
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.ActionElement title="Action" onPress={() => null} />
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} onPress={() => null} />
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart onPress={() => null} negative>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} />
                <UIForeground.ActionElement title="Negative" />
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.NumberElement>{1234567890}</UIForeground.NumberElement>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} onPress={() => null} />
            </UIForeground.SecondaryPart>
        </UIForeground.Container>

        <UIForeground.Container>
            <UIForeground.PrimaryPart onPress={() => null}>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} />
                <UIForeground.ActionElement title="Action" />
            </UIForeground.PrimaryPart>
            <UIForeground.SecondaryPart>
                <UIForeground.IconElement source={UIAssets.icons.ui.camera} onPress={() => null} />
                <UIForeground.IconElement
                    source={UIAssets.icons.ui.camera}
                    onPress={() => null}
                    tintColor={ColorVariants.TextAccent}
                />
            </UIForeground.SecondaryPart>
        </UIForeground.Container>
    </>
);

export const ForegroundsScreen = () => {
    return (
        <ExampleScreen>
            <ExampleSection title="UIForeground">
                <View style={{ flex: 1, width: '100%', maxWidth: 400, padding: 16 }}>
                    {foregroundList}
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
