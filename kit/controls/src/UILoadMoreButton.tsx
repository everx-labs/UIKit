import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

import { TouchableOpacity } from './TouchableOpacity';
import { UIIndicator } from './UIIndicator';

type Props = {
    label?: string;
    isLoadingMore: boolean;
    onLoadMore?: () => void;
};

export const UILoadMoreButton: React.FunctionComponent<Props> = ({
    label = uiLocalized.LoadMore,
    isLoadingMore = false,
    onLoadMore,
}: Props) => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                if (onLoadMore) {
                    onLoadMore();
                }
            }}
            disabled={isLoadingMore}
        >
            <View
                style={[
                    styles.wrapper,
                    {
                        backgroundColor: theme[ColorVariants.BackgroundTertiary],
                    },
                ]}
            >
                {label && (
                    <UILabel
                        role={UILabelRoles.ActionFootnote}
                        color={UILabelColors.TextTertiary}
                        style={{ opacity: isLoadingMore ? 0 : 1 }}
                    >
                        {label}
                    </UILabel>
                )}
                {isLoadingMore && (
                    <UIIndicator
                        color={ColorVariants.LinePrimary}
                        size={20}
                        style={styles.indicator}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
    },
    wrapper: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: UILayoutConstant.smallCellHeight,
        borderRadius: UILayoutConstant.smallCellHeight / 2,
        paddingVertical: UILayoutConstant.contentInsetVerticalX1 / 2,
        paddingHorizontal: UILayoutConstant.smallContentOffset,
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'center',
    },
});
