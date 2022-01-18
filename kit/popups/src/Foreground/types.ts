import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

export type UIForegroundParts =
    | React.ReactElement<PrimaryPartProps>
    | React.ReactElement<SecondaryPartProps>;

export type ContainerProps = {
    /** only UIForeground Parts can be passed to children */
    children: UIForegroundParts | [UIForegroundParts, UIForegroundParts];
};

// ================== Start of Parts Props: ==================

export type UIForegroundPrimaryElements =
    | React.ReactElement<UIForegroundActionProps>
    | React.ReactElement<UIForegroundIconProps>
    | React.ReactElement<UIForegroundSectionProps>
    | React.ReactElement<UIForegroundTextProps>;

export type PrimaryPartProps = {
    /** only UIForeground Elements can be passed to children */
    children:
        | UIForegroundPrimaryElements
        | [UIForegroundPrimaryElements, UIForegroundPrimaryElements];
};

export type UIForegroundSecondaryElements =
    | React.ReactElement<UIForegroundActionProps>
    | React.ReactElement<UIForegroundIconProps>
    | React.ReactElement<UIForegroundNumberProps>
    | React.ReactElement<UIForegroundTextProps>;

export type SecondaryPartProps = {
    /** only UIForeground Elements can be passed to children */
    children:
        | UIForegroundSecondaryElements
        | [UIForegroundSecondaryElements, UIForegroundSecondaryElements];
};
// ================== End of Parts Props ==================

// ================== Start of Elements Props: ==================

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

export type UIForegroundActionProps = {
    /**
     * Text content of the action
     */
    title: string;
    /**
     * The callback that is called when the action is tapped/clicked
     */
    onPress: () => void;
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

export type UIForegroundIconProps = {
    /**
     * Icon source
     */
    source?: ImageSourcePropType;
    /**
     * There can be no children here
     */
    children?: undefined;
};
// ================== End of Elements Props ==================

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
    Action: React.FC<UIForegroundActionProps>;
    /**
     * Icon of the UIForeground
     */
    Icon: React.FC<UIForegroundIconProps>;
    /**
     * Numerical value of the UIForeground
     */
    Number: React.FC<UIForegroundNumberProps>;
    /**
     * Bold text content of the UIForeground
     */
    Section: React.FC<UIForegroundSectionProps>;
    /**
     * Text content of the UIForeground
     */
    Text: React.FC<UIForegroundTextProps>;
};
