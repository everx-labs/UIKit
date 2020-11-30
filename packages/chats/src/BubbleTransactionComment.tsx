import * as React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from "react-native-gesture-handler"; // TODO: think how to use it

import { UIStyle, UIFont, UIConstant, UIColor } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';

import { ChatMessageStatus, TransactionType } from './types';
import type { TransactionComment } from './types';
import { useBubblePosition, BubblePosition } from './useBubblePosition';

type Props = TransactionComment & {
    status: ChatMessageStatus;
    type: TransactionType;
    onPress?: () => void | Promise<void>;
};

const getBubbleCornerStyle = (position: BubblePosition) => {
    if (position === BubblePosition.right) {
        return styles.rightCorner;
    }
    return null;
};

const getBubbleColor = (props: Props) => {
    if (props.status === ChatMessageStatus.Aborted) {
        return styles.cardAborted;
    } else if (props.type === TransactionType.Expense) {
        return styles.cardWithdraw;
    } else if (props.type === TransactionType.Income) {
        return styles.cardIncome;
    }

    return null;
};

export function BubbleTransactionComment(props: Props) {
    const position = useBubblePosition(props.status);

    return (
        <TouchableOpacity
            style={[
                styles.msgContainer,
                UIStyle.padding.verticalSmall(),
                UIStyle.padding.horizontalNormal(),
                getBubbleCornerStyle(position),
                getBubbleColor(props),
                props.status === ChatMessageStatus.Pending &&
                    UIStyle.common.opacity70(),
            ]}
            onPress={props.onPress}
        >
            <Text
                testID={`transaction_comment_${props.text}`}
                style={[
                    styles.actionLabelText,
                    UIFont.smallRegularHigh(),
                    styles.textCell,
                ]}
            >
                {props.text}
            </Text>
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
    actionLabelText: {
        color: UIColor.fa(),
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
    // TODO: duplicates ones from BubbleTransaction
    cardIncome: {
        backgroundColor: UIColor.green(),
    },
    cardWithdraw: {
        backgroundColor: UIColor.black(),
    },
    cardAborted: {
        backgroundColor: UIColor.error(),
    },
});
