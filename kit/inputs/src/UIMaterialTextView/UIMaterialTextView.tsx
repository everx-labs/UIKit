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

type TextViewParameters = {
    isHovered?: boolean;
    isFocused?: boolean;
    hasValue?: boolean;
};

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

function useTextViewReactState<T extends TextViewParameters>(
    ref: React.RefObject<MaterialTextViewRef1>,
    config: T,
): Record<keyof T, boolean> {
    const configRef = React.useRef(config);

    return React.useMemo(() => {
        const result: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;
        // eslint-disable-next-line no-restricted-syntax
        for (const key in configRef.current) {
            if (Object.prototype.hasOwnProperty.call(configRef.current, key)) {
                const textViewParameterName = key as keyof TextViewParameters;
                // eslint-disable-next-line react-hooks/rules-of-hooks
                result[textViewParameterName] = useGetJSValue(
                    ref.current?.[`${textViewParameterName}Animated`],
                );
            }
        }
        return result;
    }, [ref]);
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

/*
type FocusState = { isFocused: boolean };
type HoverState = { isHovered: boolean };
type ValueState = { value: string; hasValue: boolean };

type TextViewState<T extends Config> = (T['trackFocus'] extends boolean ? FocusState : unknown) &
    (T['trackHover'] extends boolean ? HoverState : unknown) &
    (T['trackValue'] extends boolean ? ValueState : unknown);

type Config = {
    trackHover?: boolean;
    trackFocus?: boolean;
    trackValue?: boolean;
};

function foo<T extends Config>(config: T): TextViewState<T> {
    config;
    return {} as any;
}

const { isFocused, isHovered, value, hasValue } = foo({
    trackFocus: true,
    trackHover: false,
    trackValue: true,
});

isFocused;
isHovered;
value;
hasValue;
*/

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
