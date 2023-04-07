import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants, UILabel, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { InputTextProps } from '../types';
import { inputChildrenTextColor } from '../constants';

function useProcessedChildren(
    children: React.ReactNode,
    tintColor: ColorVariants | undefined,
): React.ReactNode {
    return React.useMemo(() => {
        const length = React.Children.count(children);
        return React.Children.map(children, (child: React.ReactNode, index: number) => {
            const isLast = index === length - 1;
            const marginRight = !isLast ? UILayoutConstant.tinyContentOffset : 0;

            if (typeof child === 'string') {
                return (
                    <UILabel role={UILabelRoles.Action} color={tintColor} style={{ marginRight }}>
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
                        ...{ marginRight },
                        ...StyleSheet.flatten(child.props.style),
                    },
                });
            }
            return child;
        });
    }, [children, tintColor]);
}

export function InputText({ children }: InputTextProps) {
    const processedChildren = useProcessedChildren(children, inputChildrenTextColor);

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
