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
                actionColor = getColorByPartStatus({ ...partStatus, disabled, negative });
            } else {
                actionColor = getColorByPartStatus(partStatus);
            }
            return (
                <View
                    testID={`${title}_action_button`}
                    style={[
                        styles.container,
                        partStatus.partType === 'Primary'
                            ? styles.primaryContainer
                            : styles.secondaryContainer,
                    ]}
                >
                    <UILabel
                        role={TypographyVariants.Action}
                        color={actionColor}
                        numberOfLines={3}
                        style={
                            partStatus.partType === 'Primary'
                                ? styles.primaryText
                                : styles.secondaryText
                        }
                    >
                        {title}
                    </UILabel>
                </View>
            );
        },
        [title, disabled, negative],
    );
    return <PartStatusConsumer>{renderLabel}</PartStatusConsumer>;
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.contentInsetVerticalX3,
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
