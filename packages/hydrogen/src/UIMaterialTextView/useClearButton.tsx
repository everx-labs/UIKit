import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { UIImage } from '../UIImage';
import { ColorVariants } from '../Colors';
import { UIConstant } from '../constants';

export function useClearButton(inputHasValue: boolean, clear: () => void) {
    return React.useMemo(() => {
        if (inputHasValue) {
            return (
                <TouchableOpacity
                    testID="clear_btn"
                    style={styles.clearButtonContainer}
                    onPress={clear}
                    hitSlop={UIConstant.hitSlop}
                >
                    <UIImage
                        source={UIAssets.icons.ui.clear}
                        tintColor={ColorVariants.BackgroundPrimaryInverted}
                    />
                </TouchableOpacity>
            );
        }

        return null;
    }, [inputHasValue, clear]);
}

const styles = StyleSheet.create({
    clearButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: UIConstant.iconSize,
    },
});
