import { StyleSheet } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';

export const commonStyles = StyleSheet.create({
    buttonContainer: {
        padding: UILayoutConstant.contentOffset,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: UILayoutConstant.largeButtonHeight,
    },
    icon: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
