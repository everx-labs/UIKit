import * as React from 'react';
import { StyleSheet } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { IconProps } from './types';

export function Icon({ source }: IconProps) {
    if (!source) {
        return null;
    }
    return <UIImage source={source} style={styles.image} tintColor={ColorVariants.TextPrimary} />;
}

const styles = StyleSheet.create({
    image: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
