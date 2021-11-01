import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';

import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

export function useClearButton(
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: () => void,
) {
    return React.useMemo(() => {
        if (inputHasValue) {
            return (
                <TouchableOpacity
                    testID="clear_btn"
                    style={styles.clearButtonContainer}
                    onPress={clear}
                    hitSlop={UILayoutConstant.hitSlop}
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
        height: UILayoutConstant.iconSize,
    },
});
