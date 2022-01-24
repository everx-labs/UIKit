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
    /**
     * ID for usage in tests
     */
    testID?: string;
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

// ================== Start of Columns Types: ==================

export type ForegroundPrimaryElements =
    | ActionElementComponent
    | SectionElementComponent
    | TextElementComponent;

export type PrimaryColumnProps = PressableProps & {
    /** only UIForeground Elements can be passed to children */
    children: ForegroundPrimaryElements | [IconElementComponent, ForegroundPrimaryElements];
};

export type ForegroundSecondaryElements =
    | ActionElementComponent
    | IconElementComponent
    | NumberElementComponent
    | TextElementComponent;

export type SecondaryColumnProps = PressableProps & {
    /** only UIForeground Elements can be passed to children */
    children: ForegroundSecondaryElements | [ForegroundSecondaryElements, IconElementComponent];
};

type PrimaryColumn = React.ReactElement<PrimaryColumnProps>;
type SecondaryColumn = React.ReactElement<SecondaryColumnProps>;

export type ColumnType = 'Primary' | 'Secondary';
export type ColumnState = 'Pressable' | 'NonPressable';
export type ColumnStatus = {
    disabled: boolean | undefined;
    negative: boolean | undefined;
    columnType: ColumnType;
    columnState: ColumnState;
};
// ================== End of Columns Types ==================

export type ContainerProps = {
    /** only UIForeground Columns can be passed to children */
    children: PrimaryColumn | [PrimaryColumn, SecondaryColumn];
    /**
     * The unique id
     */
    id?: string;
};

export type UIForegroundType = {
    /**
     * Root container of the UIForeground
     */
    Container: React.FC<ContainerProps>;

    // ================== Columns: ==================
    /**
     * Container of the Primary (Left) column of the UIForeground
     */
    PrimaryColumn: React.FC<PrimaryColumnProps>;
    /**
     * Container of the Secondary (Right) column of the UIForeground
     */
    SecondaryColumn: React.FC<SecondaryColumnProps>;

    // ================== Cells: ==================
    /**
     * Pressable element (Button) of the UIForeground
     */
    ActionCell: React.FC<UIForegroundActionProps>;
    /**
     * Icon of the UIForeground
     */
    IconCell: React.FC<UIForegroundIconProps>;
    /**
     * Numerical value of the UIForeground
     */
    NumberCell: React.FC<UIForegroundNumberProps>;
    /**
     * Text content of the UIForeground
     */
    TextCell: React.FC<UIForegroundTextProps>;
};
