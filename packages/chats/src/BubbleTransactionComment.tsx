import * as React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from "react-native-gesture-handler"; // TODO: think how to use it

import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';

import { ChatMessageStatus, TransactionType } from './types';
import type { TransactionComment } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

type Props = TransactionComment & {
    status: ChatMessageStatus;
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

    if (props.status === ChatMessageStatus.Aborted) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundNegative],
            ),
        ];
    }

    if (props.type === TransactionType.Expense) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundPrimaryInverted],
            ),
        ];
    }

    if (props.type === TransactionType.Income) {
        return [
            UIStyle.color.getBackgroundColorStyle(
                theme[ColorVariants.BackgroundPositive],
            ),
        ];
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
                props.status === ChatMessageStatus.Pending &&
                    UIStyle.common.opacity70(),
            ]}
            onPress={props.onPress}
        >
            <UILabel
                testID={`transaction_comment_${props.text}`}
                role={UILabelRoles.ParagraphText}
                color={UILabelColors.TextPrimaryInverted}
                style={styles.textCell}
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

const styles = StyleSheet.create({
    msgContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: UIConstant.borderRadius(),
        marginTop: UIConstant.tinyContentOffset(),
    },
    textCell: {
        textAlign: 'left', // TODO: LTR support?
        maxWidth: '100%',
    },
    keyThin: {
        paddingLeft: UIConstant.smallContentOffset(),
        marginLeft: 'auto',
    },
    leftCorner: {
        borderBottomLeftRadius: 0,
    },
    rightCorner: {
        borderTopRightRadius: 0,
    },
});
