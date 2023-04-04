import type { InputChildren } from '../Common/InputChildren';
import type { MaterialTextViewProps } from '../MaterialTextView';

export type {
    MaterialTextViewAmountMask as UIMaterialTextViewAmountMask,
    MaterialTextViewMask as UIMaterialTextViewMask,
    MaterialTextViewRefChangeText as UIMaterialTextViewRefChangeText,
    MaterialTextViewRefMoveCarret as UIMaterialTextViewRefMoveCarret,
    MaterialTextViewRef as UIMaterialTextViewRef,
} from '../MaterialTextView';

export type UIMaterialTextViewProps = MaterialTextViewProps & {
    /**
     * If set, the clear button will not be displayed when the input:
     * (editable) and (contains text content) and (is in focus or hovered)
     * @default false
     */
    hideClearButton?: boolean;
    /**
     *  As children you can provide only one or two of this component:
     *  `UIMaterialTextView.Icon`
     *  `UIMaterialTextView.Action`
     *  `UIMaterialTextView.Text`
     */
    children?: InputChildren;
};

export enum UIMaterialTextViewColorScheme {
    Default = 'Default',
    Secondary = 'Secondary',
}
