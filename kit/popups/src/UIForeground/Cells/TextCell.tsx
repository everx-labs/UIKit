import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundTextProps } from '../types';
import { useTextColorByColumnStatus } from '../hooks';
import { ColumnStatusContext } from '../Context';

export function TextCell({ children }: UIForegroundTextProps) {
    const columnStatus = React.useContext(ColumnStatusContext);
    const color = useTextColorByColumnStatus(columnStatus);

    return (
        <View
            style={[
                styles.container,
                columnStatus.columnType === 'Primary'
                    ? styles.primaryContainer
                    : styles.secondaryContainer,
            ]}
        >
            <UILabel
                role={TypographyVariants.ParagraphText}
                color={color}
                numberOfLines={3}
                style={
                    columnStatus.columnType === 'Primary'
                        ? styles.primaryText
                        : styles.secondaryText
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
        paddingHorizontal: UILayoutConstant.normalContentOffset / 2,
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
