import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { UILabel, TypographyVariants, ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIForegroundActionProps, PartStatus } from '../types';
import getColorByPartStatus from '../getColorByPartStatus';
import { PartStatusConsumer } from '../Container';

export function ActionElement({ title, disabled, negative }: UIForegroundActionProps) {
    const renderLabel = React.useCallback(
        function renderLabel(partStatus: PartStatus) {
            let actionColor: ColorVariants;
            if (disabled !== undefined || negative !== undefined) {
                actionColor = getColorByPartStatus({ disabled, negative });
            } else {
                actionColor = getColorByPartStatus(partStatus);
            }
            return (
                <UILabel role={TypographyVariants.Action} color={actionColor}>
                    {title}
                </UILabel>
            );
        },
        [title, disabled, negative],
    );
    return (
        <View testID={`${title}_action_button`} style={styles.container}>
            <PartStatusConsumer>{renderLabel}</PartStatusConsumer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.contentInsetVerticalX3,
    },
});
