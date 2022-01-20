import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { PartStatusContext } from '../Container';
import type { SecondaryPartProps, PartStatus } from '../types';

export function SecondaryPart({ children, onPress, disabled, negative }: SecondaryPartProps) {
    const partStatus: PartStatus = React.useMemo((): PartStatus => {
        return {
            disabled,
            negative,
            partType: 'Secondary',
            partState: onPress || disabled !== undefined ? 'Pressable' : 'NonPressable',
        };
    }, [disabled, negative, onPress]);

    return (
        <TouchableOpacity
            style={styles.secondaryPart}
            disabled={!onPress || disabled}
            onPress={onPress}
        >
            <PartStatusContext.Provider value={partStatus}>{children}</PartStatusContext.Provider>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    secondaryPart: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
