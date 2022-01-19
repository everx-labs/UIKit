import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundTextProps } from '../types';
import { useTextColorByPartStatus } from '../hooks';
import { PartStatusContext } from '../Container';

export function TextElement({ children }: UIForegroundTextProps) {
    const partStatus = React.useContext(PartStatusContext);
    const color = useTextColorByPartStatus(partStatus);

    return (
        <View
            style={[
                styles.container,
                partStatus.partType === 'Primary'
                    ? styles.primaryContainer
                    : styles.secondaryContainer,
            ]}
        >
            <UILabel
                role={TypographyVariants.ParagraphText}
                color={color}
                numberOfLines={3}
                style={
                    partStatus.partType === 'Primary' ? styles.primaryText : styles.secondaryText
                }
            >
                {children}
            </UILabel>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.contentInsetVerticalX3,
    },
    primaryContainer: {
        flex: 1,
    },
    secondaryContainer: {
        flexShrink: 1,
    },
    primaryText: {},
    secondaryText: {
        textAlign: 'right',
    },
});
