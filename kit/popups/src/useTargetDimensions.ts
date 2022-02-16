import * as React from 'react';
import type { NativeMethods, ScaledSize } from 'react-native';

export type TargetDimensions = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function useTargetDimensions(
    targetRef: React.RefObject<NativeMethods>,
    windowDimensions: ScaledSize,
): TargetDimensions | null {
    const [targetDimensions, setTargetDimensions] = React.useState<TargetDimensions | null>(null);

    React.useEffect(() => {
        if (!targetRef.current || !targetRef.current.measureInWindow) {
            console.error(
                `[UITooltipContent]: [useTargetDimensions]: targetRef does not have a 'measureInWindow' method`,
            );
            return;
        }
        targetRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
            if (width == null || height == null || x == null || y == null) {
                console.error(
                    `[UITooltipContent]: [useTargetDimensions]: fail of measuring by targetRef`,
                );
                setTargetDimensions(null);
                return;
            }
            setTargetDimensions({
                x,
                y,
                width,
                height,
            });
        });
    }, [targetRef, windowDimensions]);

    return targetDimensions;
}
