import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIStyle, UIColor, UIConstant } from '@tonlabs/uikit.core';
import { UIButton } from '@tonlabs/uikit.components';
import type { Shortcut } from './types';

type Props = {
    shortcuts?: Shortcut[];
};

export function Shortcuts(props: Props) {
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
                        shortcut.isDanger ? styles.dangerAction : null,
                        UIStyle.color.getBackgroundColorStyle(UIColor.white()),
                    ]}
                    textStyle={
                        shortcut.isDanger ? styles.dangerActionText : null
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
    dangerAction: {
        borderColor: UIColor.error(),
    },
    dangerActionText: {
        color: UIColor.error(),
    },
    shortcut: {
        margin: UIConstant.smallContentOffset(),
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
});
