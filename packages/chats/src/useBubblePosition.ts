import * as React from 'react';
import { MessageStatus } from './types';

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
