import * as React from 'react';
import { View, StyleSheet, Image, I18nManager } from 'react-native';

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UILabel,
    UILabelRoles,
    UILabelColors,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

import { MessageStatus, TransactionType } from './constants';
import type { TransactionComment } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

type Props = TransactionComment & {
    status: MessageStatus;
    // This is strange coz it's actually used in getBubbleColor
    // eslint-disable-next-line react/no-unused-prop-types
    type: TransactionType;
};

const getBubbleCornerStyle = (position: BubblePosition, isRTL: boolean) => {
    if (position === BubblePosition.right) {
        return isRTL ? styles.leftCorner : styles.rightCorner;
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
    const { status, encrypted, text } = props;
    const position = useBubblePosition(status);
    const bubbleColor = useBubbleColor(props);
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);

    return (
        <View
            style={[
                styles.msgContainer,
                UIStyle.padding.verticalSmall(),
                UIStyle.padding.horizontalNormal(),
                getBubbleCornerStyle(position, isRTL),
                bubbleColor,
                status === MessageStatus.Pending && UIStyle.common.opacity70(),
                encrypted && styles.msgContainerEncrypted,
            ]}
        >
            <UILabel
                testID={`transaction_comment_${text}`}
                role={UILabelRoles.ParagraphText}
                color={UILabelColors.StaticTextPrimaryLight}
                style={styles.text}
            >
                {text}
            </UILabel>
            {encrypted && (
                <View style={styles.keyThin}>
                    <Image source={UIAssets.icons.ui.keyThin} />
                </View>
            )}
        </View>
    );
}

const KEY_THIN_WIDTH = 16;

const styles = StyleSheet.create({
    msgContainer: {
        position: 'relative',
        borderRadius: UIConstant.borderRadius(),
        marginTop: UIConstant.tinyContentOffset(),
        maxWidth: '100%',
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
        borderTopLeftRadius: 0,
    },
    rightCorner: {
        borderTopRightRadius: 0,
    },
});
