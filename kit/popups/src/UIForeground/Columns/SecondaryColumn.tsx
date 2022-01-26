import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ColumnStatusContext } from '../Context';
import { TouchableWrapper } from '../../TouchableWrapper';
import type { SecondaryColumnProps, ColumnStatus } from '../types';
import { useCheckChildren } from '../hooks';
import * as Cells from '../Cells';

export function SecondaryColumn({
    children,
    onPress,
    disabled,
    negative,
    testID,
}: SecondaryColumnProps) {
    const columnStatus: ColumnStatus = React.useMemo((): ColumnStatus => {
        return {
            disabled,
            negative,
            columnType: 'Secondary',
            columnState: onPress || disabled !== undefined ? 'Pressable' : 'NonPressable',
        };
    }, [disabled, negative, onPress]);

    const isValid = useCheckChildren(
        children,
        Cells,
        `'Column' can only contain 'Cell' components as its direct children`,
    );
    if (!isValid) {
        return null;
    }

    return (
        <TouchableWrapper
            testID={testID}
            style={styles.secondaryColumn}
            disabled={disabled}
            onPress={onPress}
        >
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
