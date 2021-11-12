import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import { UIImage, UIImageProps } from '@tonlabs/uikit.media';
import { useClearButton } from './useClearButton';

export function UIMaterialTextViewIcon({
    onPress,
    style,
    ...rest
}: UIImageProps & {
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <UIImage {...rest} style={[styles.iconSize, style]} />
        </TouchableOpacity>
    );
}

export function UIMaterialTextViewAction({
    children,
    onPress,
}: {
    children: string;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <UILabel role={UILabelRoles.Action} color={UILabelColors.TextPrimary}>
                {children}
            </UILabel>
        </TouchableOpacity>
    );
}

export function UIMaterialTextViewText({ children }: { children: string }) {
    return (
        <UILabel role={UILabelRoles.ParagraphText} color={UILabelColors.TextTertiary}>
            {children}
        </UILabel>
    );
}

const getChilds = (children: React.ReactNode) => {
    const configs = React.Children.toArray(children).reduce<React.ReactNode[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (
                child.type === UIMaterialTextViewIcon ||
                child.type === UIMaterialTextViewAction ||
                child.type === UIMaterialTextViewText
            ) {
                acc.push(child);
                return acc;
            }

            if (child.type === React.Fragment) {
                acc.push(...getChilds(child.props.children));

                return acc;
            }
        }

        throw new Error(
            `A UIMaterialText can only contain 'UIMaterialTextView.[Icon|Action|Text]' components as its direct children (found ${
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
    children: React.ReactNode,
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: () => void,
    success?: boolean,
) {
    const clearButton = useClearButton(inputHasValue, isFocused, isHovered, clear);
    
    /**
     * If clearButton is visible it blocks displaying child icons.
     * So we show it if the input is invalid.
     */
    if (clearButton && !success) {
        /**
         * It's wrapped with a View
         * to stick a clear button to the bottom
         * when an input is multilined
         */
        return <View style={styles.clearButtonWrapper}>{clearButton}</View>;
    }

    const { icons, action, text } = getChilds(children).reduce<{
        icons: React.ReactNode[];
        action: React.ReactNode;
        text: React.ReactNode;
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === UIMaterialTextViewIcon) {
                    acc.icons.push(child);
                } else if (child.type === UIMaterialTextViewAction) {
                    acc.action = child;
                } else if (child.type === UIMaterialTextViewText) {
                    acc.text = child;
                }
            }

            return acc;
        },
        {
            icons: [],
            action: null,
            text: null,
        },
    );

    const hasIcons = icons.length > 0;
    const hasAction = action != null;
    const hasText = text != null;

    if (hasIcons) {
        if (hasAction || hasText) {
            throw new Error(
                `You can't pass UIMaterialTextView.Action or UIMaterialTextView.Text with icons at the same time.`,
            );
        }

        return icons
            .slice(0, 2) // Render only two icons, as required by design system
            .reduce<React.ReactNode[]>((acc, item, index) => {
                if (!React.isValidElement(item)) {
                    return acc;
                }

                if (index !== 0) {
                    acc.push(
                        React.cloneElement(item, {
                            style: [item.props?.style, styles.iconsFiller],
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
            throw new Error(`You can't pass UIMaterialTextView.Text with Action at the same time.`);
        }

        return action;
    }

    return text;
}

const styles = StyleSheet.create({
    iconSize: {
        width: 24,
        height: 24,
    },
    iconsFiller: {
        marginLeft: 24,
    },
    clearButtonWrapper: {
        justifyContent: 'flex-end',
    },
});
