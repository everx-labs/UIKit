import * as React from 'react';
import { View, ViewProps } from 'react-native';

import { UIImage, UIImageProps } from '../UIImage';
import { UILabel, UILabelColors, UILabelRoles } from '../UILabel';
import type { ColorVariants } from '../Colors';
import type { TypographyVariants } from '../Typography';

export function ButtonContent({
    children,
    ...props
}: ViewProps & {
    children: React.ReactNode;
}) {
    return (
        <View {...props}>
            {children}
        </View>
    );
}

export function ButtonIcon({
    source,
    tintColor,
    ...props
}: UIImageProps) {
    return (
        <UIImage {...props} source={source} tintColor={tintColor} />
    );
}

export function ButtonTitle({
    children,
    titleColor = UILabelColors.TextPrimaryInverted,
    titleRole = UILabelRoles.Action
}: {
    children: string,
    titleColor?: ColorVariants,
    titleRole?: TypographyVariants
}) {
    return (
        <UILabel
            color={titleColor}
            role={titleRole}
        >
            {children}
        </UILabel>
    );
}

export const useButtonChildren = (children: React.ReactNode) => {
    // here we may need to order children in a particular way or add some styles
    const configs = React.Children.toArray(children);
    const { length } = configs;
    return (
        <View>
            {React.Children.map(
                configs,
                (child, index) =>
                    child && [
                        child,
                        index !== length - 1 && <View style={{ paddingLeft: 16 }} />,
                    ]
            )}
        </View>
    );
};
