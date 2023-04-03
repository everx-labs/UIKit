import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { Pressable } from '@tonlabs/uikit.controls';

import type { InputIconProps } from '../types';
import { ImagePressableChild } from './ImagePressableChild';

export function InputIcon({
    onPress,
    style,
    containerStyle = styles.iconTapZone,
    ...rest
}: InputIconProps) {
    return (
        <Pressable onPress={onPress} style={containerStyle}>
            <ImagePressableChild
                {...rest}
                style={{
                    ...styles.iconSize,
                    ...StyleSheet.flatten(style),
                }}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconTapZone: {
        alignSelf: 'stretch',
        paddingHorizontal: UILayoutConstant.contentOffset,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: {},
        }),
    },
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
