import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UIConstant } from '../constants';

export function useClearButton(
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: () => void,
) {
    return React.useMemo(() => {
        if (inputHasValue && (isFocused || isHovered)) {
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
    }, [inputHasValue, isFocused, isHovered, clear]);
}

const styles = StyleSheet.create({
    clearButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: UIConstant.iconSize,
    },
});
