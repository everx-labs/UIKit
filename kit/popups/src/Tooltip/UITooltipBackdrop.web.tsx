import * as React from 'react';
import type { UITooltipBackdropProps } from './types';

export const UITooltipBackdrop = React.memo(function Backdrop({
    onTap,
    triggerRef,
    contentRef,
}: UITooltipBackdropProps) {
    React.useEffect(() => {
        const mousedownHandler = (event: MouseEvent) => {
            if (
                // @ts-expect-error
                !triggerRef?.current?.contains ||
                // @ts-expect-error
                !contentRef?.current?.contains
            ) {
                onTap();
            }
            if (
                // @ts-expect-error
                !triggerRef.current.contains(event.target) &&
                // @ts-expect-error
                !contentRef.current.contains(event.target)
            ) {
                onTap();
            }
        };
        const wheelHandler = () => {
            onTap();
        };

        document.addEventListener('mousedown', mousedownHandler);
        document.addEventListener('wheel', wheelHandler);

        return () => {
            document.removeEventListener('mousedown', mousedownHandler);
            document.removeEventListener('wheel', wheelHandler);
        };
    }, [onTap, triggerRef, contentRef]);

    return null;
});
