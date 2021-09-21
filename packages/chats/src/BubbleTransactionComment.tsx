import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { TouchableOpacity } from '@tonlabs/uikit.hydrogen';
import {
    UILabel,
    UILabelRoles,
    UILabelColors,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

import { MessageStatus, TransactionType } from './types';
import type { TransactionComment } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

type Props = TransactionComment & {
    status: MessageStatus;
    // This is strange coz it's actually used in getBubbleColor
    // eslint-disable-next-line react/no-unused-prop-types
    type: TransactionType;
    onPress?: () => void | Promise<void>;
};

const getBubbleCornerStyle = (position: BubblePosition) => {
    if (position === BubblePosition.right) {
        return styles.rightCorner;
    }
    return null;
};

const useBubbleColor = (props: Props) => {
    const theme = useTheme();

    if (props.status === MessageStatus.Aborted) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundNegative])];
    }

    if (props.type === TransactionType.Expense) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.StaticBackgroundBlack])];
    }

    if (props.type === TransactionType.Income) {
        return [UIStyle.color.getBackgroundColorStyle(theme[ColorVariants.BackgroundPositive])];
    }

    return null;
};

export function BubbleTransactionComment(props: Props) {
    const position = useBubblePosition(props.status);
    const bubbleColor = useBubbleColor(props);

    return (
        <TouchableOpacity
            style={[
                styles.msgContainer,
                UIStyle.padding.verticalSmall(),
                UIStyle.padding.horizontalNormal(),
                getBubbleCornerStyle(position),
                bubbleColor,
                props.status === MessageStatus.Pending && UIStyle.common.opacity70(),
                props.encrypted && styles.msgContainerEncrypted,
            ]}
            onPress={props.onPress}
        >
            <UILabel
                testID={`transaction_comment_${props.text}`}
                role={UILabelRoles.ParagraphText}
                color={UILabelColors.StaticTextPrimaryLight}
                style={styles.text}
            >
                {props.text}
            </UILabel>
            {props.encrypted && (
                <View style={styles.keyThin}>
                    <Image source={UIAssets.icons.ui.keyThin} />
                </View>
            )}
        </TouchableOpacity>
    );
}

const KEY_THIN_WIDTH = 16;

const styles = StyleSheet.create({
    msgContainer: {
        position: 'relative',
        borderRadius: UIConstant.borderRadius(),
        marginTop: UIConstant.tinyContentOffset(),
    },
    msgContainerEncrypted: {
        paddingRight: KEY_THIN_WIDTH + UIConstant.smallContentOffset(), // take the place for the key icon
    },
    text: {
        textAlign: 'left', // TODO: LTR support?
    },
    keyThin: {
        position: 'absolute',
        width: KEY_THIN_WIDTH,
        bottom: UIConstant.smallContentOffset(),
        right: UIConstant.smallContentOffset(),
    },
    leftCorner: {
        borderBottomLeftRadius: 0,
    },
    rightCorner: {
        borderTopRightRadius: 0,
    },
});
