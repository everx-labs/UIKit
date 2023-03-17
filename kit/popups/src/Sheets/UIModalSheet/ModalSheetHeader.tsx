import * as React from 'react';
import { StyleSheet } from 'react-native';

import { UIBackgroundView, ColorVariants } from '@tonlabs/uikit.themes';

export type ModalSheetHeaderProps = {
    /**
     * Background color of the UIBottomSheet
     */
    backgroundColor?: ColorVariants;
    /**
     * TestID for testing purposes
     */
    testID?: string;
};

export function ModalSheetHeader({ backgroundColor, testID }: ModalSheetHeaderProps) {
    return (
        <UIBackgroundView style={styles.container} testID={testID} color={backgroundColor}>
            <UIBackgroundView color={ColorVariants.GraphSecondary} style={styles.puller} />
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    puller: {
        width: 18,
        height: 2,
        borderRadius: 2,
    },
});
