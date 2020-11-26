import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

import { UIColor, UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UILabel } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

type Props = {
    label?: string;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    wrapperStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<ViewStyle>;
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
    onLoadMore = () => {},
    containerStyle = {},
    wrapperStyle = {},
    textStyle = {},
}: Props) => (
    <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => {
            if (onLoadMore) {
                onLoadMore();
            }
        }}
        disabled={isLoadingMore}
    >
        <View style={[styles.wrapper, wrapperStyle]}>
            {label && (
                <UILabel
                    role={UILabel.Role.TinyRegular}
                    style={[
                        UIStyle.color.getColorStyle(UIColor.textTertiary()),
                        textStyle,
                        { opacity: isLoadingMore ? 0 : 1 },
                    ]}
                    text={label}
                />
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
