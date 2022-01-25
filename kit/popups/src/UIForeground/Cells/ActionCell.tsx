import * as React from 'react';
import { StyleSheet } from 'react-native';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundActionProps } from '../types';
import { usePressableCellColorByColumnStatus, useMergedColumnStatus } from '../hooks';
import { ColumnStatusContext } from '../Container';
import { TouchableWrapper } from '../../TouchableWrapper';

export function ActionCell({
    title,
    onPress,
    disabled,
    negative,
    testID,
}: UIForegroundActionProps) {
    const columnStatus = React.useContext(ColumnStatusContext);

    const mergedColumnStatus = useMergedColumnStatus(columnStatus, disabled, negative, onPress);
    const actionColor = usePressableCellColorByColumnStatus(mergedColumnStatus);

    return (
        <TouchableWrapper
            testID={testID}
            disabled={columnStatus.columnState === 'Pressable' || disabled}
            onPress={onPress}
            style={[
                styles.container,
                columnStatus.columnType === 'Primary'
                    ? styles.primaryContainer
                    : styles.secondaryContainer,
            ]}
        >
            <UILabel
                role={TypographyVariants.Action}
                color={actionColor}
                numberOfLines={3}
                style={
                    columnStatus.columnType === 'Primary'
                        ? styles.primaryText
                        : styles.secondaryText
                }
            >
                {title}
            </UILabel>
        </TouchableWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.normalContentOffset / 2,
    },
    primaryContainer: {
        flex: 1,
    },
    secondaryContainer: {
        flexShrink: 1,
    },
    primaryText: {},
    secondaryText: {
        textAlign: 'right',
    },
});
