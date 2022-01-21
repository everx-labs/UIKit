import * as React from 'react';
import { StyleSheet } from 'react-native';
import { PartStatusContext } from '../Container';
import { TouchableWrapper } from '../TouchableWrapper';
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
        <TouchableWrapper style={styles.secondaryPart} disabled={disabled} onPress={onPress}>
            <PartStatusContext.Provider value={partStatus}>{children}</PartStatusContext.Provider>
        </TouchableWrapper>
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
