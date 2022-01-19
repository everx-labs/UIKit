import * as React from 'react';
import { View } from 'react-native';
import type { UIForegroundType, SecondaryPartProps } from './types';
import { PrimaryPart } from './Parts';
import { ActionElement, IconElement } from './Elements';
import { Container } from './Container';

export function NumberElement() {
    return <View />;
}
export function SectionElement() {
    return <View />;
}
export function TextElement() {
    return <View />;
}

export function SecondaryPart({ children }: SecondaryPartProps) {
    return <View>{children}</View>;
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
