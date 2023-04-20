import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { LogoProps } from './types';
import { UIConstant } from '../constants';

export function Logo({ logo, loading }: LogoProps) {
    if (loading) {
        return (
            <View style={styles.container}>
                <UISkeleton show style={styles.skeleton}>
                    <View style={styles.image} />
                </UISkeleton>
            </View>
        );
    }
    if (!logo) {
        return (
            <View style={styles.container}>
                <View style={styles.image} />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <UIImage source={logo} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingRight: UILayoutConstant.normalContentOffset,
    },
    skeleton: {
        borderRadius: UIConstant.uiLink.logo.borderRadius,
    },
    image: {
        width: UIConstant.uiLink.logo.size,
        height: UIConstant.uiLink.logo.size,
        borderRadius: UIConstant.uiLink.logo.borderRadius,
        overflow: 'hidden',
    },
});
