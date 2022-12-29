import * as React from 'react';
import { I18nManager, ImageStyle, StyleProp } from 'react-native';

/**
 * Flips images on the Y-axis in RTL mode.
 * @param style
 * @returns the same `style` with rotateY style in RTL mode.
 */
export function useFlippedImageIfRtl(
    style: StyleProp<ImageStyle> | undefined,
): StyleProp<ImageStyle> | undefined {
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);

    const flipImageIfRtlStyle: StyleProp<ImageStyle> = isRTL
        ? {
              transform: [
                  {
                      scaleX: -1,
                  },
              ],
          }
        : undefined;

    if (!style) {
        return flipImageIfRtlStyle;
    }
    if (!flipImageIfRtlStyle) {
        return style;
    }
    return [style, flipImageIfRtlStyle];
}
