import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import {
    UILabel,
    UILabelRoles,
    UILabelColors,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

import type { Shortcut } from './types';

type Props = {
    shortcuts?: Shortcut[];
};

export function Shortcuts({ shortcuts }: Props) {
    const theme = useTheme();

    if (shortcuts == null) {
        return null;
    }

    return (
        <View style={styles.container}>
            {shortcuts.map(shortcut => (
                <TouchableOpacity
                    testID={shortcut.testID ?? `shortcut_cell_${shortcut.title ?? ''}`}
                    key={shortcut.key ?? shortcut.title}
                    style={[
                        styles.shortcut,
                        {
                            borderColor: shortcut.isDanger
                                ? theme[ColorVariants.LineNegative]
                                : theme[ColorVariants.LineAccent],
                            backgroundColor: theme[ColorVariants.BackgroundPrimary],
                        },
                    ]}
                    onPress={shortcut.onPress}
                >
                    <UILabel
                        role={UILabelRoles.Action}
                        color={
                            shortcut.isDanger
                                ? UILabelColors.TextNegative
                                : UILabelColors.TextAccent
                        }
                    >
                        {shortcut.title}
                    </UILabel>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingHorizontal: UILayoutConstant.smallContentOffset,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex: 1,
    },
    shortcut: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
        height: UILayoutConstant.mediumButtonHeight,
        borderRadius: UILayoutConstant.borderRadius,
        borderBottomRightRadius: 0,
        alignSelf: 'flex-end',
        marginHorizontal: UILayoutConstant.smallContentOffset,
        marginVertical: UILayoutConstant.contentInsetVerticalX2,
    },
});
