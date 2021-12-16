/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { VirtualizedList } from 'react-native';

const originalCompDidMount = VirtualizedList.prototype.componentDidMount;

VirtualizedList.prototype.componentDidMount = function componentDidMount(...args) {
    if (originalCompDidMount) {
        originalCompDidMount.apply(this, args);
    }
    // @ts-ignore
    if ('patchedFrames' in this.props && this.props.patchedFrames != null) {
        // @ts-ignore
        this._frames = this.props.patchedFrames;
    }
};

export type VirtualizedListFrame = {
    inLayout: boolean;
    index: number;
    length: number;
    offset: number;
};

export type VirtualizedListScrollMetrics = {
    // Overall height
    contentLength: number;
    dOffset: number;
    dt: number;
    // Scroll offset
    offset: number;
    timestamp: number;
    velocity: number;
    // Height of visible area
    visibleLength: number;
};

/**
 * VirtualizedList do a lot of work under the hood,
 * what is the most important for us - it track coordinates
 * for cells, that it manages.
 *
 * Unfortunatelly though, it doesn't have a way to notify
 * somehow about the changes in that frames.
 * VirtualizedList has `onViewableItemsChanged`, but it doesn't have
 * coords in event payload.
 *
 * So how it works?
 * We just replace internal object, with proxy object,
 * that intercept mutations, and if a key of changed frame
 * is the one that we want to track, it notifies about changes.
 */
export function useVirtualizedListFramesListener(
    keysToListen: Record<string, any>,
    listener: (key: string, prev: VirtualizedListFrame, next: VirtualizedListFrame) => void,
) {
    const proxyRef = React.useRef<typeof Proxy>();
    if (proxyRef.current == null) {
        const frameTarget = {
            set(obj: VirtualizedListFrame, key: string, value: any) {
                // @ts-ignore
                if (obj[key] !== value) {
                    // @ts-ignore
                    const frameKey = this.key;
                    listener(frameKey, obj, { ...obj, [key]: value });
                }
                // @ts-ignore
                obj[key] = value;
                return true;
            },
        };
        const target = {
            set(
                obj: Record<string, VirtualizedListFrame>,
                key: string,
                value: VirtualizedListFrame,
            ) {
                if (!(key in keysToListen)) {
                    obj[key] = value;
                    return true;
                }
                const prev = obj[key];
                listener(key, prev, value);

                obj[key] = new Proxy(value, {
                    ...frameTarget,
                    // @ts-ignore
                    key,
                });
                return true;
            },
        };
        // @ts-expect-error
        proxyRef.current = new Proxy({}, target);
    }
    return proxyRef.current;
}
