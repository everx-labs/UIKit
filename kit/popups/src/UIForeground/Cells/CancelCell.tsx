import * as React from 'react';
import { StyleSheet } from 'react-native';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundCancelProps } from '../types';
import { ColumnStatusContext } from '../Container';
import { TouchableWrapper } from '../../TouchableWrapper';

export function CancelCell({ title, onPress, testID }: UIForegroundCancelProps) {
    const columnStatus = React.useContext(ColumnStatusContext);
    return (
        <TouchableWrapper
            testID={testID}
            disabled={columnStatus.columnState === 'Pressable'}
            onPress={onPress}
            style={[styles.container]}
        >
            <UILabel
                role={TypographyVariants.Action}
                color={ColorVariants.TextSecondary}
                numberOfLines={3}
            >
                {title}
            </UILabel>
        </TouchableWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.normalContentOffset / 2,
    },
});
