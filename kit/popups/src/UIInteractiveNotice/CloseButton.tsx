import * as React from 'react';
import { ViewStyle, View } from 'react-native';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIPressableArea } from '@tonlabs/uikit.controls';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage } from '@tonlabs/uikit.media';
import { ColorVariants } from '@tonlabs/uikit.themes';
import type { InteractiveNoticeContentProps } from './types';

export function CloseButton({
    style,
    showCloseButton,
    onClose,
}: Pick<InteractiveNoticeContentProps, 'showCloseButton' | 'onClose'> & { style: ViewStyle }) {
    if (!showCloseButton) {
        return null;
    }
    return (
        <View style={style}>
            <UIPressableArea
                onPress={onClose}
                style={{
                    marginVertical: -UILayoutConstant.contentInsetVerticalX4,
                    marginHorizontal: -UILayoutConstant.contentOffset,
                    paddingVertical: UILayoutConstant.contentInsetVerticalX4,
                    paddingHorizontal: UILayoutConstant.contentOffset,
                }}
            >
                <UIImage
                    source={UIAssets.icons.ui.closeBlack}
                    tintColor={ColorVariants.GraphSecondary}
                    style={{
                        height: UILayoutConstant.iconSize,
                        aspectRatio: 1,
                    }}
                />
            </UIPressableArea>
        </View>
    );
}
