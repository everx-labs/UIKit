import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIImage, TouchableOpacity } from '@tonlabs/uikit.hydrogen';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant } from '@tonlabs/uikit.core';

type ActionButtonProps = {
    inputHasValue: boolean;
    onPress: () => void | Promise<void>;
    hasError: boolean;
    clear: () => void;
};

export function ActionButton({ inputHasValue, hasError, onPress, clear }: ActionButtonProps) {
    const theme = useTheme();
    if (hasError) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={actionStyles.buttonContainer}
                onPress={clear}
            >
                <View
                    style={[
                        actionStyles.iconRound,
                        {
                            backgroundColor: theme[ColorVariants.BackgroundNegative],
                        },
                    ]}
                >
                    <UIImage
                        source={UIAssets.icons.ui.closeRemove}
                        style={actionStyles.iconClear}
                        tintColor={ColorVariants.LinePrimary}
                    />
                </View>
            </TouchableOpacity>
        );
    }
    if (inputHasValue) {
        return (
            <TouchableOpacity
                testID="send_btn"
                style={actionStyles.buttonContainer}
                onPress={onPress}
            >
                <UIImage source={UIAssets.icons.ui.buttonMsgSend} style={actionStyles.icon} />
            </TouchableOpacity>
        );
    }
    return null;
}

const actionStyles = StyleSheet.create({
    buttonContainer: {
        padding: UIConstant.contentOffset(),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UIConstant.largeButtonHeight(),
    },
    icon: {
        height: UIConstant.tinyButtonHeight(),
        width: UIConstant.tinyButtonHeight(),
    },
    iconClear: {
        height: 30,
        width: 30,
    },
    iconRound: {
        height: UIConstant.tinyButtonHeight(),
        width: UIConstant.tinyButtonHeight(),
        borderRadius: UIConstant.tinyButtonHeight() / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
