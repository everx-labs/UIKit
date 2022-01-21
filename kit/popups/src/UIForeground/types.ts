import type React from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { ColorVariants } from '@tonlabs/uikit.themes';

// ================== Start of Elements Types: ==================

export type UIForegroundTextProps = {
    /**
     * Text content
     */
    children: string;
};

export type UIForegroundSectionProps = {
    /**
     * Text content
     */
    children: string;
};

type PressableProps = {
    /**
     * The callback that is called when the action is tapped/clicked
     */
    onPress?: () => void;
    /**
     * Whether the press behavior is disabled
     * Default: `false`
     */
    disabled?: boolean;
    /**
     * Is the action negative?
     * Default: `false`
     */
    negative?: boolean;
};

export type UIForegroundActionProps = PressableProps & {
    /**
     * Text content of the action
     */
    title: string;
    /**
     * There can be no children here
     */
    children?: undefined;
};

export type UIForegroundNumberProps = {
    /**
     * Numerical value
     */
    children: number;
};

export type UIForegroundIconProps = PressableProps & {
    /**
     * Icon source
     */
    source?: ImageSourcePropType;
    /**
     * tintColor of the Icon
     * By default, tintcolor is set accordingly to the ActionElement
     */
    tintColor?: ColorVariants;
    /**
     * There can be no children here
     */
    children?: undefined;
};

export type ActionElementComponent = React.ReactElement<UIForegroundActionProps>;
export type IconElementComponent = React.ReactElement<UIForegroundIconProps>;
export type NumberElementComponent = React.ReactElement<UIForegroundNumberProps>;
export type SectionElementComponent = React.ReactElement<UIForegroundSectionProps>;
export type TextElementComponent = React.ReactElement<UIForegroundTextProps>;
// ================== End of Elements Types ==================

// ================== Start of Parts Types: ==================

export type ForegroundPrimaryElements =
    | ActionElementComponent
    | SectionElementComponent
    | TextElementComponent;

export type PrimaryPartProps = PressableProps & {
    /** only UIForeground Elements can be passed to children */
    children: ForegroundPrimaryElements | [IconElementComponent, ForegroundPrimaryElements];
};

export type ForegroundSecondaryElements =
    | ActionElementComponent
    | IconElementComponent
    | NumberElementComponent
    | TextElementComponent;

export type SecondaryPartProps = PressableProps & {
    /** only UIForeground Elements can be passed to children */
    children: ForegroundSecondaryElements | [ForegroundSecondaryElements, IconElementComponent];
};

type PrimaryPart = React.ReactElement<PrimaryPartProps>;
type SecondaryPart = React.ReactElement<SecondaryPartProps>;

export type PartType = 'Primary' | 'Secondary';
export type PartState = 'Pressable' | 'NonPressable';
export type PartStatus = {
    disabled: boolean | undefined;
    negative: boolean | undefined;
    partType: PartType;
    partState: PartState;
};
// ================== End of Parts Types ==================

export type ContainerProps = {
    /** only UIForeground Parts can be passed to children */
    children: PrimaryPart | [PrimaryPart, SecondaryPart];
};

export type UIForegroundType = {
    /**
     * Root container of the UIForeground
     */
    Container: React.FC<ContainerProps>;

    // ================== Parts: ==================
    /**
     * Container of the Primary (Left) part of the UIForeground
     */
    PrimaryPart: React.FC<PrimaryPartProps>;
    /**
     * Container of the Secondary (Right) part of the UIForeground
     */
    SecondaryPart: React.FC<SecondaryPartProps>;

    // ================== Elements: ==================
    /**
     * Pressable element (Button) of the UIForeground
     */
    ActionElement: React.FC<UIForegroundActionProps>;
    /**
     * Icon of the UIForeground
     */
    IconElement: React.FC<UIForegroundIconProps>;
    /**
     * Numerical value of the UIForeground
     */
    NumberElement: React.FC<UIForegroundNumberProps>;
    /**
     * Bold text content of the UIForeground
     */
    SectionElement: React.FC<UIForegroundSectionProps>;
    /**
     * Text content of the UIForeground
     */
    TextElement: React.FC<UIForegroundTextProps>;
};
