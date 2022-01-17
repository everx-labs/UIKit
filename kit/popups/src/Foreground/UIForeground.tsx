import * as React from 'react';
import { View } from 'react-native';
import type { UIForegroundType } from './types';

export function Container() {
    return <View />;
}
export function PrimaryPart() {
    return <View />;
}
export function SecondaryPart() {
    return <View />;
}

export function Action() {
    return <View />;
}
export function Icon() {
    return <View />;
}
export function Number() {
    return <View />;
}
export function Section() {
    return <View />;
}
export function Text() {
    return <View />;
}

const UIForeground: UIForegroundType = {
    Container,

    PrimaryPart,
    SecondaryPart,

    Action,
    Icon,
    Number,
    Section,
    Text,
};

export default UIForeground;

/*
    <UIForeground.Container>
        <UIForeground.PrimaryPart>
            <UIForeground.Icon source={UIAssets.icons.ui.search} />
            <UIForeground.Action title="asd" onTap={() => null} negative disabled />
        </UIForeground.PrimaryPart>
        <UIForeground.SecondaryPart>
            <UIForeground.Action title="asd" onTap={() => null} negative disabled />
            <UIForeground.Icon source={UIAssets.icons.ui.search} />
        </UIForeground.SecondaryPart>
    </UIForeground.Container>;
*/
