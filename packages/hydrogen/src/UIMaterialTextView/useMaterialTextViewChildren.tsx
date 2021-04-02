import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { ColorVariants, useTheme } from '../Colors';
import { UIImage, UIImageProps } from '../UIImage';
import { UILabel, UILabelColors, UILabelRoles } from '../UILabel';

export function UIMaterialTextViewIcon({
    onPress,
    style,
    ...rest
}: UIImageProps & {
    onPress?: React.ComponentProps<typeof TouchableOpacity>['onPress'];
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
    onPress?: React.ComponentProps<typeof TouchableOpacity>['onPress'];
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <UILabel
                role={UILabelRoles.Action}
                color={UILabelColors.TextPrimary}
            >
                {children}
            </UILabel>
        </TouchableOpacity>
    );
}

export function UIMaterialTextViewText({ children }: { children: string }) {
    return (
        <UILabel
            role={UILabelRoles.ParagraphText}
            color={UILabelColors.TextTertiary}
        >
            {children}
        </UILabel>
    );
}

const getChilds = (children: React.ReactNode) => {
    const configs = React.Children.toArray(children).reduce<React.ReactNode[]>(
        (acc, child) => {
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
                        ? `${
                              typeof child.type === 'string'
                                  ? child.type
                                  : child.type?.name
                          }`
                        : typeof child === 'object'
                        ? JSON.stringify(child)
                        : `'${String(child)}'`
                })`,
            );
        },
        [],
    );

    return configs;
};

export function useMaterialTextViewChildren(
    children: React.ReactNode,
    inputHasValue: boolean,
    clear: () => void,
) {
    const theme = useTheme();

    if (inputHasValue) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={styles.clearButtonContainer}
                onPress={clear}
            >
                <View
                    style={[
                        styles.clearIconRoundBackground,
                        {
                            backgroundColor:
                                theme[ColorVariants.BackgroundPrimaryInverted],
                        },
                    ]}
                >
                    <UIImage
                        source={UIAssets.icons.ui.closeRemove}
                        style={styles.clearIcon}
                        tintColor={ColorVariants.LinePrimary}
                    />
                </View>
            </TouchableOpacity>
        );
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
            throw new Error(
                `You can't pass UIMaterialTextView.Text with Action at the same time.`,
            );
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
    clearButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: 24,
    },
    clearIcon: {
        height: 30,
        width: 30,
    },
    clearIconRoundBackground: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
