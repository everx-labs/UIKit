import * as React from 'react';

import { Portal } from '@tonlabs/uikit.layout';

type BlockingViewProps = {
    onBlockingViewReady(): void;
    onBlockingViewGone(): void;
};

export type BlockingViewRef = {
    block(): Promise<void> | undefined;
    unblock(): Promise<void> | undefined;
};

function BlockingViewInner({ onBlockingViewReady, onBlockingViewGone }: BlockingViewProps) {
    React.useEffect(() => {
        onBlockingViewReady();

        return onBlockingViewGone;
    }, [onBlockingViewGone, onBlockingViewReady]);

    return null;
}

type DeferedVisibility = {
    promise: Promise<void>;
    resolve: () => void;
};

export const BlockingView = React.memo(
    React.forwardRef<BlockingViewRef>(function BlockingView(_props, ref) {
        const [visible, setVisible] = React.useState(false);
        const visibleRef = React.useRef(visible);
        React.useEffect(() => {
            visibleRef.current = visible;
        }, [visible]);

        const resolveBlock = React.useRef<DeferedVisibility | null>();
        const resolveUnblock = React.useRef<DeferedVisibility | null>();

        React.useImperativeHandle(ref, () => ({
            block: () => {
                if (visibleRef.current) {
                    return resolveBlock.current?.promise;
                }
                if (resolveUnblock.current == null) {
                    const unblock: any = {};
                    unblock.promise = new Promise(res => {
                        unblock.resolve = res;
                    }).then(() => {
                        resolveBlock.current = null;
                        resolveUnblock.current = null;
                    });
                    resolveUnblock.current = unblock;
                }
                if (resolveBlock.current == null) {
                    const block: any = {};
                    block.promise = new Promise(res => {
                        block.resolve = res;
                    });
                    resolveBlock.current = block;
                }
                setVisible(true);
                return resolveBlock.current?.promise;
            },
            unblock: () => {
                setVisible(false);
                return resolveUnblock.current?.promise;
            },
        }));

        if (!visible) {
            return null;
        }

        return (
            <Portal absoluteFill>
                <BlockingViewInner
                    onBlockingViewReady={() => {
                        resolveBlock.current?.resolve();
                    }}
                    onBlockingViewGone={() => {
                        resolveUnblock.current?.resolve();
                    }}
                />
            </Portal>
        );
    }),
);
