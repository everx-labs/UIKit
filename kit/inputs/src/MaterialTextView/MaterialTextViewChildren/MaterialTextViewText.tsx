import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import { MaterialTextViewColorScheme, MaterialTextViewTextProps } from '../types';
import { MaterialTextViewContext } from '../MaterialTextViewContext';

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

export function MaterialTextViewText({ children }: MaterialTextViewTextProps) {
    const { colorScheme } = React.useContext(MaterialTextViewContext);

    const color = React.useMemo(() => {
        switch (colorScheme) {
            case MaterialTextViewColorScheme.Secondary:
                return ColorVariants.TextTertiary;
            case MaterialTextViewColorScheme.Default:
            default:
                return ColorVariants.TextPrimary;
        }
    }, [colorScheme]);

    const processedChildren = useProcessedChildren(children, color);

    return <Animated.View style={styles.textContainer}>{processedChildren}</Animated.View>;
}

const styles = StyleSheet.create({
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: UILayoutConstant.normalContentOffset,
        left: UILayoutConstant.normalContentOffset,
    },
    imageChild: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
