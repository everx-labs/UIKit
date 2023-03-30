import * as React from 'react';
import { StyleSheet } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { Pressable } from '@tonlabs/uikit.controls';

import type { MaterialTextViewIconProps } from '../types';
import { ImagePressableChild } from './ImagePressableChild';

export function MaterialTextViewIcon({
    onPress,
    style,
    containerStyle = styles.iconTapZone,
    ...rest
}: MaterialTextViewIconProps) {
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: UILayoutConstant.normalContentOffset,
        left: UILayoutConstant.normalContentOffset,
    },
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
