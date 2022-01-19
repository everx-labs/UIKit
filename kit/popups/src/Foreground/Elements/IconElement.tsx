import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import type { UIForegroundIconProps } from '../types';
import { PartStatusContext } from '../Container';
import { useColorByPartStatus } from '../hooks';

export function IconElement({ source }: UIForegroundIconProps) {
    const partStatus = React.useContext(PartStatusContext);
    const tintColor = useColorByPartStatus(partStatus);
    if (!source) {
        return null;
    }
    return (
        <View style={styles.container}>
            <UIImage source={source} tintColor={tintColor} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.contentInsetVerticalX3,
    },
    image: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
