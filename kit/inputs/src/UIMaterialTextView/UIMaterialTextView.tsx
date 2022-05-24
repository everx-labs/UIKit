import * as React from 'react';
import { SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import {
    getEmptyUIMaterialTextViewRef,
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
    MaterialTextView,
    useInputHasValue,
    MaterialTextViewRef,
} from '../MaterialTextView';
import { useFocused } from '../UITextView';
import { useUIMaterialTextViewChildren } from './hooks';
import type { UIMaterialTextViewRef, UIMaterialTextViewProps } from './types';

const emptyUIMaterialTextViewRef = getEmptyUIMaterialTextViewRef('UIMaterialTextView');

const UIMaterialTextViewForward = React.forwardRef<UIMaterialTextViewRef, UIMaterialTextViewProps>(
    function UIMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
        const ref = React.useRef<MaterialTextViewRef>(null);
        const {
            value,
            defaultValue,
            onFocus: onFocusProp,
            onBlur: onBlurProp,
            onChangeText: onChangeTextProp,
            children,
        } = props;
        const [isHovered, setIsHovered] = React.useState<boolean>(false);
        const { isFocused, onFocus, onBlur } = useFocused(onFocusProp, onBlurProp);
        const { inputHasValue, checkInputHasValue } = useInputHasValue(value, defaultValue);
        const processedChildren = useUIMaterialTextViewChildren(
            children,
            inputHasValue,
            isFocused,
            isHovered,
            ref.current?.clear,
        );

        const onChangeText = React.useCallback(
            function onChangeText(text: string) {
                onChangeTextProp?.(text);
                checkInputHasValue(text);
            },
            [checkInputHasValue, onChangeTextProp],
        );

        React.useImperativeHandle<Record<string, any>, MaterialTextViewRef>(
            passedRef,
            (): MaterialTextViewRef => ({
                ...emptyUIMaterialTextViewRef,
                ...ref.current,
            }),
        );

        return (
            <MaterialTextView
                {...props}
                ref={ref}
                onHover={setIsHovered}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChangeText}
            >
                {processedChildren}
            </MaterialTextView>
        );
    },
);

function useTextViewRef(passedRef: React.ForwardedRef<MaterialTextViewRef1>) {
    const ref = React.useRef<MaterialTextViewRef1>(null);

    React.useImperativeHandle<Record<string, any>, MaterialTextViewRef>(
        passedRef,
        (): MaterialTextViewRef => ({
            ...emptyUIMaterialTextViewRef,
            ...ref.current,
        }),
    );

    return ref;
}

type TextViewStateParameters = {
    isHoveredAnimated: Readonly<SharedValue<boolean>>;
    isFocusedAnimated: Readonly<SharedValue<boolean>>;
    hasValueAnimated: Readonly<SharedValue<boolean>>;
};

type MaterialTextViewRef1 = MaterialTextViewRef & TextViewStateParameters;

type TextViewParameterName = 'isHovered' | 'isFocused' | 'hasValue';

type TextViewParameters<T extends TextViewParameterName> = Record<T, true | undefined>;

type TextViewState<T extends TextViewParameterName> = Record<T, Readonly<boolean | undefined>>;

function useGetJSValue(animatedValue: Readonly<SharedValue<boolean>> | undefined): boolean {
    if (!animatedValue) {
        return false;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<boolean>(animatedValue?.value || false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedReaction(
        () => animatedValue?.value,
        (currentValue: boolean | undefined, previousValue: boolean | undefined | null) => {
            if (currentValue != null && currentValue !== previousValue) {
                setValue(currentValue);
            }
        },
    );
    return value;
}

function useTextViewReactState<T extends TextViewParameterName>(
    ref: React.RefObject<MaterialTextViewRef1>,
    config: TextViewParameters<T>,
): TextViewState<T> {
    const configRef = React.useRef(config);

    const result: TextViewState<T> = {} as TextViewState<T>;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in configRef.current) {
        if (Object.prototype.hasOwnProperty.call(configRef.current, key)) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            result[key] = useGetJSValue(ref.current?.[`${key}Animated`]);
        }
    }
    return result;
}

const UINewMaterialTextViewForward = React.forwardRef<
    MaterialTextViewRef1,
    UIMaterialTextViewProps
>(function UINewMaterialTextViewForward(props: UIMaterialTextViewProps, passedRef) {
    /**
     * We can provide nothing to the useTextViewRef function. We provide passedRef if only when we have it.
     *
     * `ref` must be passed to any "Input" component (MaterialTextView, UIMaterialTextView, etc.)
     * That "Input" component must have `isHoveredAnimated`, `isFocusedAnimated`, `hasValueAnimated`
     * fields in their `ref`
     *
     */
    const ref = useTextViewRef(passedRef);

    const { isHoveredAnimated, isFocusedAnimated, hasValueAnimated } = ref.current ?? {};

    const { isHovered, isFocused, hasValue } = useTextViewReactState(ref, {
        isHovered: true,
        isFocused: true,
        hasValue: true,
    });

    isHovered;
    isHoveredAnimated;
    isFocused;
    isFocusedAnimated;
    hasValue;
    hasValueAnimated;

    return <MaterialTextView {...props} ref={ref} />;
});

UINewMaterialTextViewForward;

// @ts-expect-error
// ts doesn't understand that we assign [Icon|Action|Text] later, and want to see it right away
export const UIMaterialTextView: typeof UIMaterialTextViewForward & {
    Icon: typeof MaterialTextViewIcon;
    Action: typeof MaterialTextViewAction;
    Text: typeof MaterialTextViewText;
} = UIMaterialTextViewForward;

UIMaterialTextView.Icon = MaterialTextViewIcon;
UIMaterialTextView.Action = MaterialTextViewAction;
UIMaterialTextView.Text = MaterialTextViewText;
