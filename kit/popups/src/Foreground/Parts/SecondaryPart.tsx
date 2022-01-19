import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { PartStatusProvider } from '../Container';
import type { SecondaryPartProps, PartStatus } from '../types';

export function SecondaryPart({ children, onPress, disabled, negative }: SecondaryPartProps) {
    const partStatus: PartStatus = React.useMemo((): PartStatus => {
        return { disabled, negative, partType: 'Secondary' };
    }, [disabled, negative]);

    return (
        <TouchableOpacity style={styles.secondaryPart} disabled={disabled} onPress={onPress}>
            <PartStatusProvider value={partStatus}>{children}</PartStatusProvider>
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
