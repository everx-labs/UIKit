import type { MaterialTextViewProps } from '../MaterialTextView';

export type {
    MaterialTextViewActionChild as UIMaterialTextViewActionChild,
    MaterialTextViewActionProps as UIMaterialTextViewActionProps,
    MaterialTextViewAmountMask as UIMaterialTextViewAmountMask,
    MaterialTextViewChild as UIMaterialTextViewChild,
    MaterialTextViewIconChild as UIMaterialTextViewIconChild,
    MaterialTextViewIconProps as UIMaterialTextViewIconProps,
    MaterialTextViewMask as UIMaterialTextViewMask,
    MaterialTextViewRefChangeText as UIMaterialTextViewRefChangeText,
    MaterialTextViewRefMoveCarret as UIMaterialTextViewRefMoveCarret,
    MaterialTextViewTextChild as UIMaterialTextViewTextChild,
    MaterialTextViewTextProps as UIMaterialTextViewTextProps,
    MaterialTextViewRef as UIMaterialTextViewRef,
} from '../MaterialTextView';

export type UIMaterialTextViewProps = Omit<MaterialTextViewProps, 'colorScheme'> & {
    /**
     * If set, the clear button will not be displayed when the input:
     * (editable) and (contains text content) and (is in focus or hovered)
     * @default false
     */
    hideClearButton?: boolean;
    /**
     * Color scheme of the TextView.
     * @default UIMaterialTextViewColorScheme.Default
     */
    colorScheme?: UIMaterialTextViewColorScheme;
};

export enum UIMaterialTextViewColorScheme {
    Default = 'Default',
    Secondary = 'Secondary',
}
