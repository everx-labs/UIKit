export type PointerEvents = null | 'box-none' | 'none' | 'box-only' | 'auto';

export type PositionObject = {
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
};

export type EventProps = { [string]: () => void };
