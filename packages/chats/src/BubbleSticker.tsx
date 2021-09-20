import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import { ColorVariants, UILabel, UILabelRoles, useTheme, UIImage } from '@tonlabs/uikit.hydrogen';

import { MessageStatus } from './types';
import type { StickerMessage } from './types';
import { useBubbleContainerStyle } from './useBubblePosition';

export const BubbleSticker = (props: StickerMessage) => {
    const containerStyle = useBubbleContainerStyle(props);
    const theme = useTheme();

    return (
        <View style={containerStyle} onLayout={props.onLayout}>
            <View style={styles.inner}>
                <View style={props.status === MessageStatus.Pending && UIStyle.common.opacity70()}>
                    <UIImage style={styles.sticker} source={props.source} />
                </View>
                <View
                    style={[
                        styles.time,
                        UIStyle.color.getBackgroundColorStyle(
                            theme[ColorVariants.BackgroundSecondary],
                        ),
                        props.status === MessageStatus.Pending && UIStyle.common.opacity70(),
                    ]}
                >
                    <UILabel
                        // testID={testID} TODO: do we need it here?
                        role={UILabelRoles.ParagraphLabel}
                        style={styles.timeText}
                    >
                        {uiLocalized.formatTime(props.time || Date.now())}
                    </UILabel>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inner: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    sticker: {
        width: UIConstant.giantCellHeight(),
        height: UIConstant.giantCellHeight(),
    },
    time: {
        marginRight: UIConstant.horizontalContentOffset(),
        // bottom: UIConstant.verticalContentOffset(),
        borderRadius: 10,
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    timeText: {
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
});
