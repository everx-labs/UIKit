import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIButton } from '@tonlabs/uikit.components';
import { useTheme, ColorVariants } from '@tonlabs/uikit.hydrogen';

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
            {props.shortcuts.map((shortcut) => (
                // TODO: revisit use of UIButton someday
                <UIButton
                    title={shortcut.title}
                    testID={
                        shortcut.testID ??
                        `shortcut_cell_${shortcut.title ?? ''}`
                    }
                    buttonShape={UIButton.ButtonShape.MediumRadius}
                    buttonSize={UIButton.ButtonSize.Medium}
                    buttonStyle={UIButton.ButtonStyle.Border}
                    onPress={shortcut.onPress}
                    key={shortcut.key ?? shortcut.title}
                    style={[
                        styles.shortcut,
                        shortcut.isDanger
                            ? {
                                  borderColor:
                                      theme[ColorVariants.LineNegative],
                              }
                            : null,
                        UIStyle.color.getBackgroundColorStyle(
                            theme[ColorVariants.BackgroundPrimary],
                        ),
                    ]}
                    textStyle={
                        shortcut.isDanger
                            ? { color: theme[ColorVariants.TextNegative] }
                            : null
                    }
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingHorizontal: UIConstant.smallContentOffset(),
        alignSelf: 'flex-end',
        flexDirection: 'row',
        zIndex: 1,
    },
    shortcut: {
        margin: UIConstant.smallContentOffset(),
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
});
