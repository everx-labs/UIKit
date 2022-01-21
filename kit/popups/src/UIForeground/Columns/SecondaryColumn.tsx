import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ColumnStatusContext } from '../Container';
import { TouchableWrapper } from '../TouchableWrapper';
import type { SecondaryColumnProps, ColumnStatus } from '../types';

export function SecondaryColumn({ children, onPress, disabled, negative }: SecondaryColumnProps) {
    const columnStatus: ColumnStatus = React.useMemo((): ColumnStatus => {
        return {
            disabled,
            negative,
            columnType: 'Secondary',
            columnState: onPress || disabled !== undefined ? 'Pressable' : 'NonPressable',
        };
    }, [disabled, negative, onPress]);

    return (
        <TouchableWrapper style={styles.secondaryColumn} disabled={disabled} onPress={onPress}>
            <ColumnStatusContext.Provider value={columnStatus}>
                {children}
            </ColumnStatusContext.Provider>
        </TouchableWrapper>
    );
}

const styles = StyleSheet.create({
    secondaryColumn: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
