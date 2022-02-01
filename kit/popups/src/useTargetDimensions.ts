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
        if (!targetRef.current || !targetRef.current.measure) {
            console.error(
                `[UITooltipContent]: [useTargetDimensions]: targetRef does not have a 'measure' method`,
            );
            return;
        }
        targetRef.current.measure(
            (
                _x: number,
                _y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number,
            ) => {
                if (width == null || height == null || pageX == null || pageY == null) {
                    console.error(
                        `[UITooltipContent]: [useTargetDimensions]: fail of measuring by targetRef`,
                    );
                    setTargetDimensions(null);
                    return;
                }
                setTargetDimensions({
                    x: pageX,
                    y: pageY,
                    width,
                    height,
                });
            },
        );
    }, [targetRef, windowDimensions]);

    return targetDimensions;
}
