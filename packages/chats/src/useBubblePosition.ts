import * as React from "react";
import { ChatMessageStatus } from "./types";

export enum BubblePosition {
    left = "left",
    right = "right",
}

export const BubblePositionContext = React.createContext({
    [ChatMessageStatus.Sent]: BubblePosition.right,
    [ChatMessageStatus.Pending]: BubblePosition.right,
    [ChatMessageStatus.Received]: BubblePosition.left,
});

export function useBubblePosition(status: ChatMessageStatus): BubblePosition {
    const config = React.useContext(BubblePositionContext);

    return config[status];
}
