import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { UIConstant } from '../constants';
import { UIImage, UIImageProps } from '../UIImage';
import { UILabel, UILabelColors, UILabelRoles } from '../UILabel';
import type { ColorVariants } from '../Colors';
import type { TypographyVariants } from '../Typography';

// eslint-disable-next-line no-shadow
export enum ButtonContentDirection {
    Column = 'column',
    Row = 'row',
}

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
        <View {...props} style={[childrenDirection, style]}>
            {children}
        </View>
    );
}

export function ButtonIcon({
    source,
    tintColor,
    style,
    onPress,
    ...props
}: UIImageProps & {
    // add possibility to pass action to the icon, may be used for the right icons
    onPress?: () => void | Promise<void>,
}) {
    const image = React.useMemo(() => {
        return (
            <UIImage
                {...props}
                source={source}
                style={[
                    {
                        width: UIConstant.iconSize,
                        height: UIConstant.iconSize,
                    },
                    style,
                ]}
                tintColor={tintColor}
            />
        );
    }, [props, source, style, tintColor]);

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
    ...props
}: {
    children: string,
    titleColor?: ColorVariants,
    titleRole?: TypographyVariants
}) {
    return (
        <UILabel
            {...props}
            color={titleColor}
            role={titleRole}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {children}
        </UILabel>
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
