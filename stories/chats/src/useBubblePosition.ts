import * as React from 'react';
import { I18nManager, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';

import { MessageStatus } from './constants';
import type { BubbleBaseT } from './types';

// eslint-disable-next-line no-shadow
export enum BubblePosition {
    left = 'left',
    right = 'right',
}

export const BubblePositionContext = React.createContext({
    [MessageStatus.Sent]: BubblePosition.right,
    [MessageStatus.Pending]: BubblePosition.right,
    [MessageStatus.Received]: BubblePosition.left,
    [MessageStatus.Aborted]: BubblePosition.right,
});

export function useBubblePosition(status: MessageStatus): BubblePosition {
    const config = React.useContext(BubblePositionContext);

    return config[status];
}

function getBubbleContainerPositionStyle(position: BubblePosition, isRTL: boolean) {
    if (position === BubblePosition.left) {
        return isRTL ? styles.containerRight : styles.containerLeft;
    }
    if (position === BubblePosition.right) {
        return isRTL ? styles.containerLeft : styles.containerRight;
    }
    return null;
}

export function useBubbleContainerStyle({
    status,
    firstFromChain,
}: BubbleBaseT): StyleProp<ViewStyle> {
    const position = useBubblePosition(status);
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);

    return React.useMemo(
        () => [
            getBubbleContainerPositionStyle(position, isRTL),
            firstFromChain ? styles.firstFromChain : styles.notFirstFromChain,
        ],
        [position, isRTL, firstFromChain],
    );
}

const styles = StyleSheet.create({
    containerRight: {
        maxWidth: '100%',
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    containerLeft: {
        maxWidth: '100%',
        paddingRight: '20%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    firstFromChain: { paddingTop: UIConstant.smallContentOffset() },
    notFirstFromChain: { paddingTop: UIConstant.tinyContentOffset() },
});
