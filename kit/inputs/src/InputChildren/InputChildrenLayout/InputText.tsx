import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { InputChildrenColorScheme, InputTextProps } from '../types';

function useProcessedChildren(
    children: React.ReactNode,
    tintColor: ColorVariants | undefined,
): React.ReactNode {
    return React.useMemo(
        () =>
            React.Children.map(children, (child: React.ReactNode) => {
                if (typeof child === 'string') {
                    return (
                        <UILabel role={UILabelRoles.Action} color={tintColor}>
                            {child}
                        </UILabel>
                    );
                }
                if (React.isValidElement(child) && child.type === UIImage) {
                    return React.createElement(UIImage, {
                        ...child.props,
                        tintColor,
                        style: {
                            ...styles.imageChild,
                            ...StyleSheet.flatten(child.props.style),
                        },
                    });
                }
                return child;
            }),
        [children, tintColor],
    );
}

export function InputText({ children, colorScheme }: InputTextProps) {
    const color = React.useMemo(() => {
        switch (colorScheme) {
            case InputChildrenColorScheme.Secondary:
                return ColorVariants.TextTertiary;
            case InputChildrenColorScheme.Default:
            default:
                return ColorVariants.TextPrimary;
        }
    }, [colorScheme]);

    const processedChildren = useProcessedChildren(children, color);

    return (
        <Animated.View style={styles.textContainer}>
            <View style={styles.textContent}>{processedChildren}</View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    textContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    imageChild: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
