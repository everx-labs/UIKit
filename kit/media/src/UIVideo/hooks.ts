import * as React from 'react';
import type { Dimensions } from './types';

export const useDimensionsByAspectRatio = (
    width: number | undefined,
    height: number | undefined,
    aspectRatio: number | undefined,
): Dimensions | null => {
    return React.useMemo(() => {
        if (!width && !height) {
            return null;
        }
        if (!aspectRatio) {
            return { width, height };
        }
        if (!width && height) {
            return {
                width: height * aspectRatio,
                height,
            };
        }
        if (width && !height) {
            return {
                width,
                height: width / aspectRatio,
            };
        }
        if (width && height) {
            if (height > width / aspectRatio) {
                return {
                    width,
                    height: width / aspectRatio,
                };
            }
            return {
                width: height * aspectRatio,
                height,
            };
        }
        return {
            width,
            height,
        };
    }, [width, height, aspectRatio]);
};
