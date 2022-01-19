import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import type { UIForegroundIconProps, PartStatus } from '../types';
import { PartStatusConsumer } from '../Container';
import getColorByPartStatus from '../getColorByPartStatus';

export function IconElement({ source }: UIForegroundIconProps) {
    const renderImage = React.useCallback(
        function renderImage(partStatus: PartStatus) {
            const tintColor = getColorByPartStatus(partStatus);
            if (!source) {
                return null;
            }
            return <UIImage source={source} tintColor={tintColor} style={styles.image} />;
        },
        [source],
    );
    if (!source) {
        return null;
    }
    return (
        <View style={styles.container}>
            <PartStatusConsumer>{renderImage}</PartStatusConsumer>
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
