import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { UIConstant } from '@tonlabs/uikit.core';

import { BubbleBaseT, MessageStatus } from './types';

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

function getBubbleContainerPositionStyle(position: BubblePosition) {
    if (position === BubblePosition.left) {
        return styles.containerLeft;
    } else if (position === BubblePosition.right) {
        return styles.containerRight;
    }
    return null;
}

export function useBubbleContainerStyle({
    status,
    firstFromChain,
}: BubbleBaseT): StyleProp<ViewStyle> {
    const position = useBubblePosition(status);

    return React.useMemo(
        () => [
            getBubbleContainerPositionStyle(position),
            firstFromChain ? styles.firstFromChain : styles.notFirstFromChain,
        ],
        [position, firstFromChain],
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
