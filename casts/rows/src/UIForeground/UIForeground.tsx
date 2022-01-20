import * as React from 'react';
import { View } from 'react-native';
import type { UIForegroundType } from './types';
import { PrimaryPart, SecondaryPart } from './Parts';
import { ActionElement, IconElement, TextElement, NumberElement } from './Elements';
import { Container } from './Container';

export function SectionElement() {
    return <View />;
}

export const UIForeground: UIForegroundType = {
    Container,

    PrimaryPart,
    SecondaryPart,

    ActionElement,
    IconElement,
    NumberElement,
    SectionElement,
    TextElement,
};

/*
    <UIForeground.Container>
        <UIForeground.PrimaryPart>
            <UIForeground.IconElement source={UIAssets.icons.ui.search} />
            <UIForeground.ActionElement title="asd" onPress={() => null} negative disabled />
        </UIForeground.PrimaryPart>
        <UIForeground.SecondaryPart>
            <UIForeground.TextElement>Text</UIForeground.TextElement>
            <UIForeground.IconElement source={UIAssets.icons.ui.search} />
        </UIForeground.SecondaryPart>
    </UIForeground.Container>;
*/
