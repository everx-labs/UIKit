import * as React from 'react';
import { View, ViewProps } from 'react-native';

import { UIConstant } from '../constants';
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
    style,
    size = 'normal',
    ...props
}: UIImageProps & {
    size?: 'normal' | 'small';
}) {
    const iconSize = React.useMemo(() => {
        if (size === 'small') {
            return UIConstant.smallButtonIconSize;
        }
        return UIConstant.normalButtonIconSize;
    }, [size]);

    return (
        <UIImage
            {...props}
            source={source}
            style={[
                {
                    width: iconSize,
                    height: iconSize,
                },
                style,
            ]}
            tintColor={tintColor}
        />
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
    // TODO: understand whether we need to limit icons to one at a time and remove others
    const configs = React.Children.toArray(children);
    return (
        <View>
            {React.Children.map(
                configs,
                child =>
                    child && [
                        child,
                        <View style={{ paddingLeft: 16 }} />,
                    ]
            )}
        </View>
    );
};
