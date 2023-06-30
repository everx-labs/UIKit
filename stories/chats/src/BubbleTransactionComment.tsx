import * as React from 'react';
import { View, StyleSheet, Image, I18nManager, StyleProp, ViewStyle } from 'react-native';

import { UILayoutConstant } from '@tonlabs/uikit.layout';
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

const useBubbleColor = (props: Props): StyleProp<ViewStyle> => {
    const theme = useTheme();

    if (props.status === MessageStatus.Aborted) {
        return {
            backgroundColor: theme[ColorVariants.BackgroundNegative],
        };
    }

    if (props.type === TransactionType.Expense) {
        return {
            backgroundColor: theme[ColorVariants.StaticBackgroundBlack],
        };
    }

    if (props.type === TransactionType.Income) {
        return {
            backgroundColor: theme[ColorVariants.BackgroundPositive],
        };
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
                {
                    paddingVertical: UILayoutConstant.contentInsetVerticalX2,
                    paddingHorizontal: UILayoutConstant.normalContentOffset,
                    opacity: status === MessageStatus.Pending ? 0.7 : 1,
                },
                getBubbleCornerStyle(position, isRTL),
                bubbleColor,
            ]}
        >
            <UILabel
                testID={`transaction_comment_${text}`}
                role={UILabelRoles.ParagraphText}
                color={UILabelColors.StaticTextPrimaryLight}
                style={[styles.text, encrypted && styles.textEncrypted]}
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
        borderRadius: UILayoutConstant.borderRadius,
        marginTop: UILayoutConstant.contentInsetVerticalX1,
        maxWidth: '100%',
    },
    textEncrypted: {
        paddingRight: KEY_THIN_WIDTH + UILayoutConstant.smallContentOffset, // take the place for the key icon
    },
    text: {
        textAlign: 'left', // TODO: LTR support?
    },
    keyThin: {
        position: 'absolute',
        width: KEY_THIN_WIDTH,
        bottom: UILayoutConstant.contentInsetVerticalX2,
        right: UILayoutConstant.smallContentOffset,
    },
    leftCorner: {
        borderTopLeftRadius: 0,
    },
    rightCorner: {
        borderTopRightRadius: 0,
    },
});
