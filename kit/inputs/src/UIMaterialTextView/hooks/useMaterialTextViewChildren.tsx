import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type {
    MaterialTextViewProps,
    MaterialTextViewActionChild,
    MaterialTextViewIconChild,
    MaterialTextViewTextChild,
} from '../../MaterialTextView';
import {
    MaterialTextViewIcon,
    MaterialTextViewAction,
    MaterialTextViewText,
    MaterialTextViewClearButton,
} from '../../MaterialTextView';

const getChildList = (children: React.ReactNode) => {
    const configs = React.Children.toArray(children).reduce<React.ReactNode[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (
                child.type === MaterialTextViewIcon ||
                child.type === MaterialTextViewAction ||
                child.type === MaterialTextViewText
            ) {
                acc.push(child);
                return acc;
            }

            if (child.type === React.Fragment) {
                acc.push(...getChildList(child.props.children));

                return acc;
            }
        }

        throw new Error(
            `A MaterialText can only contain 'MaterialTextView.[Icon|Action|Text]' components as its direct children (found ${
                // eslint-disable-next-line no-nested-ternary
                React.isValidElement(child)
                    ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                    : typeof child === 'object'
                    ? JSON.stringify(child)
                    : `'${String(child)}'`
            })`,
        );
    }, []);

    return configs;
};

export function useMaterialTextViewChildren(
    children: MaterialTextViewProps['children'],
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: (() => void) | undefined,
): MaterialTextViewProps['children'] {
    const clearButton = (
        <MaterialTextViewClearButton
            inputHasValue={inputHasValue}
            isFocused={isFocused}
            isHovered={isHovered}
            clear={clear}
        />
    );

    if (clearButton) {
        /**
         * It's wrapped with a View
         * to stick a clear button to the bottom
         * when an input is multilined
         */
        return <View style={styles.clearButtonWrapper}>{clearButton}</View>;
    }

    const { icons, action, text } = getChildList(children).reduce<{
        icons: (MaterialTextViewIconChild | undefined)[];
        action: MaterialTextViewActionChild | undefined;
        text: MaterialTextViewTextChild | undefined;
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === MaterialTextViewIcon) {
                    acc.icons.push(child);
                } else if (child.type === MaterialTextViewAction) {
                    acc.action = child;
                } else if (child.type === MaterialTextViewText) {
                    acc.text = child;
                }
            }

            return acc;
        },
        {
            icons: [],
            action: undefined,
            text: undefined,
        },
    );

    const hasIcons = icons.length > 0;
    const hasAction = action != null;
    const hasText = text != null;

    if (hasIcons) {
        if (hasAction || hasText) {
            throw new Error(
                `You can't pass MaterialTextView.Action or MaterialTextView.Text with icons at the same time.`,
            );
        }

        return icons
            .slice(0, 2) // Render only two icons, as required by design system
            .reduce<MaterialTextViewIconChild[]>((acc, item, index) => {
                if (!React.isValidElement(item)) {
                    return acc;
                }

                if (index !== 0) {
                    acc.push(
                        React.cloneElement(item, {
                            style: item.props?.style,
                            containerStyle: [item.props?.containerStyle, styles.iconOffset],
                        }),
                    );
                } else {
                    acc.push(item);
                }

                return acc;
            }, []);
    }

    if (hasAction) {
        if (hasText) {
            throw new Error(`You can't pass MaterialTextView.Text with Action at the same time.`);
        }

        return action;
    }

    return text;
}

const styles = StyleSheet.create({
    iconOffset: {
        marginRight: -UILayoutConstant.normalContentOffset,
    },
    clearButtonWrapper: {
        justifyContent: 'flex-end',
    },
});
