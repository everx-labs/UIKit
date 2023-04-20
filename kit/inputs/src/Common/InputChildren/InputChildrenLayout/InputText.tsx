import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants, UILabel } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { InputTextProps } from '../types';
import { inputChildrenTextColor } from '../constants';
import type { InputFont } from '../../constants';
import { useInputChildrenLabelRole } from '../useInputChildrenLabelRole';

function useProcessedChildren(
    children: React.ReactNode,
    tintColor: ColorVariants | undefined,
    font: InputFont | undefined,
): React.ReactNode {
    const labelRole = useInputChildrenLabelRole(font);
    return React.useMemo(() => {
        const length = React.Children.count(children);
        return React.Children.map(children, (child: React.ReactNode, index: number) => {
            const isLast = index === length - 1;
            const marginRight = !isLast ? UILayoutConstant.tinyContentOffset : 0;

            if (typeof child === 'string') {
                return (
                    <UILabel role={labelRole} color={tintColor} style={{ marginRight }}>
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
    }, [children, tintColor, labelRole]);
}

export function InputText({ children, font }: InputTextProps) {
    const processedChildren = useProcessedChildren(children, inputChildrenTextColor, font);

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
