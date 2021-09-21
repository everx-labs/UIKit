import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UILabel, UILabelRoles, UILabelColors, TouchableOpacity } from '@tonlabs/uikit.hydrogen';
import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import type { Shortcut } from './types';

type Props = {
    shortcuts?: Shortcut[];
};

export function Shortcuts(props: Props) {
    const theme = useTheme();

    if (props.shortcuts == null) {
        return null;
    }

    return (
        <View style={styles.container}>
            {props.shortcuts.map(shortcut => (
                <TouchableOpacity
                    testID={shortcut.testID ?? `shortcut_cell_${shortcut.title ?? ''}`}
                    key={shortcut.key ?? shortcut.title}
                    style={[
                        styles.shortcut,
                        {
                            borderColor: shortcut.isDanger
                                ? theme[ColorVariants.LineNegative]
                                : theme[ColorVariants.LineAccent],
                        },
                        UIStyle.color.getBackgroundColorStyle(
                            theme[ColorVariants.BackgroundPrimary],
                        ),
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
        paddingHorizontal: UIConstant.smallContentOffset(),
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
        paddingHorizontal: UIConstant.contentOffset(),
        height: UIConstant.mediumButtonHeight(),
        borderRadius: UIConstant.borderRadius(),
        borderBottomRightRadius: 0,
        alignSelf: 'flex-end',
        margin: UIConstant.smallContentOffset(),
    },
});
