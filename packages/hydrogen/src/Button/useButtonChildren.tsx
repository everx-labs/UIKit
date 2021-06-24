import * as React from 'react';
import { Platform, StyleSheet, View, ViewProps, ImageProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { ColorVariants, useTheme } from '../Colors';
import { UIConstant } from '../constants';
import { UILabel, UILabelColors, UILabelRoles } from '../UILabel';
import type { TypographyVariants } from '../Typography';

// eslint-disable-next-line no-shadow
export enum ButtonContentDirection {
    Column = 'column',
    Row = 'row',
}

const AnimatedUILabel = Animated.createAnimatedComponent(UILabel);

export function ButtonContent({
    children,
    direction = ButtonContentDirection.Row,
    style,
    ...props
}: ViewProps & {
    children: React.ReactNode,
    direction?: ButtonContentDirection,
}) {
    const childrenDirection = React.useMemo(() => {
        if (direction === ButtonContentDirection.Column) {
            return [
                { flexDirection: direction },
                styles.leftContent,
            ];
        }
        return [
            { flexDirection: direction },
            styles.centerContent,
        ];
    }, [direction]);

    return (
        <View
            {...props}
            style={[
                childrenDirection,
                Platform.OS === 'web' ? styles.flexShrink : null,
                style,
            ]}
        >
            {children}
        </View>
    );
}

export function ButtonIcon({
    iconAnimStyle,
    initialColor,
    activeColor,
    onPress,
    source,
    style,
    ...props
}: ImageProps & {
    iconAnimStyle?: any,
    initialColor?: ColorVariants,
    activeColor?: ColorVariants,
    // add possibility to pass action to the icon, may be used for the right icons
    onPress?: () => void | Promise<void>,
}) {
    const theme = useTheme();

    const image = React.useMemo(() => {
        return (
            <View>
                <Animated.Image
                    {...props}
                    source={source}
                    style={[
                        {
                            width: UIConstant.iconSize,
                            height: UIConstant.iconSize,
                            tintColor: theme[ColorVariants[initialColor as ColorVariants]],
                        },
                        style,
                    ]}
                />
                <Animated.Image
                    {...props}
                    source={source}
                    style={[
                        {
                            width: UIConstant.iconSize,
                            height: UIConstant.iconSize,
                            tintColor: theme[ColorVariants[activeColor as ColorVariants]],
                            position: 'absolute',
                        },
                        style,
                        iconAnimStyle,
                    ]}
                />
            </View>
        );
    }, [props, source, style, iconAnimStyle, initialColor, activeColor]);

    return onPress ? (
        <TouchableOpacity onPress={onPress}>
            {image}
        </TouchableOpacity>
    ) : image;
}

export function ButtonTitle({
    children,
    titleColor = UILabelColors.TextPrimaryInverted,
    titleRole = UILabelRoles.Action,
    titleAnimStyle,
    ...props
}: {
    children: string,
    titleColor?: ColorVariants,
    titleRole?: TypographyVariants,
    titleAnimStyle?: any,
}) {
    return (
        <AnimatedUILabel
            {...props}
            color={titleColor}
            role={titleRole}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={titleAnimStyle}
        >
            {children}
        </AnimatedUILabel>
    );
}

const getChilds = (children: React.ReactNode) => {
    const childElements = React.Children.toArray(children).reduce<React.ReactNode[]>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === ButtonContent ||
                    child.type === ButtonIcon ||
                    child.type === ButtonTitle
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
                `Button can only contain 'Button.[Content|Icon|Title]' components as its direct children (found ${
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

    return childElements;
};

export const useButtonChildren = (children: React.ReactNode) => {
    // here we may need to order children in a particular way or add some styles
    // TODO: understand whether we need to limit icons to one at a time and remove others

    const childElements = getChilds(children);
    const { length } = childElements;

    if (length === 1) {
        return (
            <View style={styles.singleElementContainer}>
                {childElements}
            </View>
        );
    } else if (length === 2) {
        // TODO: add checking of child type
        //  & separating Button.Container to icon and title with corresponding alignment
        return (
            <View style={styles.moreThanOneElementContainer}>
                <View style={styles.left} />
                <View style={styles.center}>
                    {childElements[0]}
                </View>
                <View style={styles.right}>
                    {childElements[1]}
                </View>
            </View>
        )
    }

    return childElements;
};

const styles = StyleSheet.create({
    centerContent: {
        alignItems: 'center',
    },
    leftContent: {
        alignItems: 'flex-start',
    },
    flexShrink: {
        flexShrink: 1
    },
    singleElementContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreThanOneElementContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    right: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});
