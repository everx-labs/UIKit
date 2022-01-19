import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { PartStatusProvider } from '../Container';
import type { PrimaryPartProps, PartStatus } from '../types';

export function PrimaryPart({ children, onPress, disabled, negative }: PrimaryPartProps) {
    const partStatus: PartStatus = React.useMemo(() => {
        return { disabled, negative };
    }, [disabled, negative]);

    return (
        <TouchableOpacity style={styles.primaryPart} disabled={disabled} onPress={onPress}>
            <PartStatusProvider value={partStatus}>{children}</PartStatusProvider>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    primaryPart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
