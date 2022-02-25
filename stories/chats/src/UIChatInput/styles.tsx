import { StyleSheet } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';

export const commonStyles = StyleSheet.create({
    buttonContainer: {
        padding: UIConstant.contentOffset(),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UIConstant.largeButtonHeight(),
    },
    icon: {
        height: UIConstant.iconSize(),
        width: UIConstant.iconSize(),
    },
    actionIcon: {
        height: UIConstant.mediumIconSize(),
        width: UIConstant.mediumIconSize(),
    },
    actionTitle: {
        minWidth: UIConstant.iconSize(),
        textAlign: 'center',
    },
});
