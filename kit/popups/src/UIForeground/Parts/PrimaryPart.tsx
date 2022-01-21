import * as React from 'react';
import { StyleSheet } from 'react-native';
import { PartStatusContext } from '../Container';
import { TouchableWrapper } from '../TouchableWrapper';
import type { PrimaryPartProps, PartStatus } from '../types';

export function PrimaryPart({ children, onPress, disabled, negative }: PrimaryPartProps) {
    const partStatus: PartStatus = React.useMemo((): PartStatus => {
        return {
            disabled,
            negative,
            partType: 'Primary',
            partState: onPress || disabled !== undefined ? 'Pressable' : 'NonPressable',
        };
    }, [disabled, negative, onPress]);

    return (
        <TouchableWrapper style={styles.primaryPart} disabled={disabled} onPress={onPress}>
            <PartStatusContext.Provider value={partStatus}>{children}</PartStatusContext.Provider>
        </TouchableWrapper>
    );
}

const styles = StyleSheet.create({
    primaryPart: {
        flexGrow: 1,
        minWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
