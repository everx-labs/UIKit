import * as React from 'react';
import { View } from 'react-native';
import { UILabel, ColorVariants, TypographyVariants } from '@tonlabs/uikit.themes';
import type {
    UIForegroundType,
    ContainerProps,
    SecondaryPartProps,
    UIForegroundActionProps,
} from './types';
import { PrimaryPart } from './PrimaryPart';

const getActionColor = (
    negative: boolean | undefined,
    disabled: boolean | undefined,
): ColorVariants => {
    if (disabled) {
        return ColorVariants.TextTertiary;
    }
    if (negative) {
        return ColorVariants.TextNegative;
    }
    return ColorVariants.TextPrimary;
};

export function ActionElement({ title, disabled, negative }: UIForegroundActionProps) {
    const actionColor = getActionColor(negative, disabled);
    return (
        <View testID={`${title}_action_button`}>
            <UILabel role={TypographyVariants.Action} color={actionColor}>
                {title}
            </UILabel>
        </View>
    );
}
export function IconElement() {
    return <View />;
}
export function NumberElement() {
    return <View />;
}
export function SectionElement() {
    return <View />;
}
export function TextElement() {
    return <View />;
}

export function Container({ children }: ContainerProps) {
    return <View>{children}</View>;
}
export function SecondaryPart({ children }: SecondaryPartProps) {
    return <View>{children}</View>;
}

const UIForeground: UIForegroundType = {
    Container,

    PrimaryPart,
    SecondaryPart,

    ActionElement,
    IconElement,
    NumberElement,
    SectionElement,
    TextElement,
};

export default UIForeground;

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
