import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant, UISkeleton } from '@tonlabs/uikit.layout';
import type { LogoProps } from './types';
import { UIConstant } from '../constants';

export const Logo: React.FC<LogoProps> = ({ logo, loading }: LogoProps) => {
    if (!logo) {
        return (
            <View style={styles.container}>
                <UISkeleton show={!!loading}>
                    <View style={styles.image} />
                </UISkeleton>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <UISkeleton show={!!loading}>
                <UIImage source={logo} style={styles.image} />
            </UISkeleton>
        </View>
    );
};

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
