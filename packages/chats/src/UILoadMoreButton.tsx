import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

import { UIColor, UIConstant } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

type Props = {
    label?: string;
    isLoadingMore: boolean;
    onLoadMore?: () => void;
};

const Indicator = ({ isLoadingMore }: { isLoadingMore: boolean }) => {
    if (!isLoadingMore) {
        return null;
    }
    return (
        <MaterialIndicator
            style={styles.indicator}
            color={UIColor.white()}
            size={20}
        />
    );
};

export const UILoadMoreButton: React.FunctionComponent<Props> = ({
    label = uiLocalized.LoadMore,
    isLoadingMore = false,
    onLoadMore,
}: Props) => (
    <TouchableOpacity
        style={styles.container}
        onPress={() => {
            if (onLoadMore) {
                onLoadMore();
            }
        }}
        disabled={isLoadingMore}
    >
        <View style={styles.wrapper}>
            {label && (
                <UILabel
                    role={UILabelRoles.ActionFootnote}
                    color={UILabelColors.TextTertiary}
                    style={{ opacity: isLoadingMore ? 0 : 1 }}
                >
                    {label}
                </UILabel>
            )}
            <Indicator isLoadingMore={isLoadingMore} />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: UIConstant.contentOffset(),
    },
    wrapper: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: UIColor.backgroundTertiary(),
        height: UIConstant.smallCellHeight(),
        borderRadius: UIConstant.smallCellHeight() / 2,
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'center',
    },
});
