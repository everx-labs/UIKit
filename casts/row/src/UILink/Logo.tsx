import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { LogoProps } from './types';
import { UIConstant } from '../constants';

export const Logo: React.FC<LogoProps> = ({ logoSource }: LogoProps) => {
    if (!logoSource) {
        return <View style={[styles.container, styles.image]} />;
    }
    return (
        <View style={styles.container}>
            <UIImage source={logoSource} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingRight: UILayoutConstant.normalContentOffset,
    },
    image: {
        width: UIConstant.uiLink.logo.size,
        height: UIConstant.uiLink.logo.size,
        borderRadius: UIConstant.uiLink.logo.borderRadius,
        overflow: 'hidden',
    },
});
