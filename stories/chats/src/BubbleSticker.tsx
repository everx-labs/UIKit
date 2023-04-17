import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import { UIImage } from '@tonlabs/uikit.media';
import { UILabel, UILabelRoles, ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import { MessageStatus } from './constants';
import type { StickerMessage } from './types';
import { useBubbleContainerStyle } from './useBubblePosition';

export function BubbleSticker(props: StickerMessage) {
    const { onLayout, status, source, time } = props;
    const containerStyle = useBubbleContainerStyle(props);
    const theme = useTheme();

    const opacity = React.useMemo(() => {
        return status === MessageStatus.Pending ? 0.7 : 1;
    }, [status]);

    return (
        <View style={containerStyle} onLayout={onLayout}>
            <View style={styles.inner}>
                <View style={{ opacity }}>
                    <UIImage style={styles.sticker} source={source} />
                </View>
                <View
                    style={[
                        styles.time,
                        {
                            backgroundColor: theme[ColorVariants.BackgroundSecondary],
                            opacity,
                        },
                    ]}
                >
                    <UILabel
                        // testID={testID} TODO: do we need it here?
                        role={UILabelRoles.ParagraphLabel}
                        style={styles.timeText}
                    >
                        {uiLocalized.formatTime(time || Date.now())}
                    </UILabel>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inner: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    sticker: {
        width: UILayoutConstant.giantCellHeight,
        height: UILayoutConstant.giantCellHeight,
    },
    time: {
        marginRight: 12, // TODO: use UILayout
        borderRadius: 10,
        paddingVertical: UILayoutConstant.contentInsetVerticalX1 / 2,
        paddingHorizontal: UILayoutConstant.smallContentOffset,
    },
    timeText: {
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
});
