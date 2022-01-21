import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundNumberProps } from '../types';
import { useTextColorByPartStatus } from '../hooks';
import { PartStatusContext } from '../Container';

export function NumberElement({ children }: UIForegroundNumberProps) {
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
                role={TypographyVariants.MonoText}
                color={color}
                numberOfLines={3}
                style={
                    partStatus.partType === 'Primary'
                        ? styles.primaryNumber
                        : styles.secondaryNumber
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
        paddingHorizontal: UILayoutConstant.contentInsetVerticalX3 / 2,
    },
    primaryContainer: {
        flex: 1,
    },
    secondaryContainer: {
        flexShrink: 1,
    },
    primaryNumber: {},
    secondaryNumber: {
        textAlign: 'right',
    },
});
