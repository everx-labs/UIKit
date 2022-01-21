import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ColumnStatusContext } from '../Container';
import { TouchableWrapper } from '../TouchableWrapper';
import type { PrimaryColumnProps, ColumnStatus } from '../types';

export function PrimaryColumn({ children, onPress, disabled, negative }: PrimaryColumnProps) {
    const columnStatus: ColumnStatus = React.useMemo((): ColumnStatus => {
        return {
            disabled,
            negative,
            columnType: 'Primary',
            columnState: onPress || disabled !== undefined ? 'Pressable' : 'NonPressable',
        };
    }, [disabled, negative, onPress]);

    return (
        <TouchableWrapper style={styles.primaryColumn} disabled={disabled} onPress={onPress}>
            <ColumnStatusContext.Provider value={columnStatus}>
                {children}
            </ColumnStatusContext.Provider>
        </TouchableWrapper>
    );
}

const styles = StyleSheet.create({
    primaryColumn: {
        flexGrow: 1,
        minWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
