import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { PartStatusContext } from '../Container';
import type { PrimaryPartProps, PartStatus } from '../types';

export function PrimaryPart({ children, onPress, disabled, negative }: PrimaryPartProps) {
    const partStatus: PartStatus = React.useMemo((): PartStatus => {
        return {
            disabled,
            negative,
            partType: 'Primary',
            partState: onPress ? 'Pressable' : 'NonPressable',
        };
    }, [disabled, negative, onPress]);

    return (
        <TouchableOpacity
            style={styles.primaryPart}
            disabled={!onPress || disabled}
            onPress={onPress}
        >
            <PartStatusContext.Provider value={partStatus}>{children}</PartStatusContext.Provider>
        </TouchableOpacity>
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
