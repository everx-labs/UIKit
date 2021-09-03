import React from "react";
import { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export const usePageStyle = (initialOffset: number) => {

    const offset = useSharedValue(initialOffset);

     React.useEffect(() => {
        offset.value = initialOffset
    },[offset, initialOffset])

    const animatedStyles = useAnimatedStyle(() => {
        const opacity = interpolate(
          offset.value,
          [1, 0],
          [offset.value, 1],
        );

        // TODO: pass animatedStyles only for active pages

        // const scale = interpolate(
        //     offset.value,
        //     [1, 0],
        //     [.9, 1]
        //   );

        // const transform = [{scale}]
    
        return {
          opacity,
        //   transform
        };
      });

    return animatedStyles;

}

export const usePaginationStyle = (initialOffset: number) => {

    const offset = useSharedValue(initialOffset);

     React.useEffect(() => {
        offset.value = initialOffset
    },[offset, initialOffset])

    const animatedStyles = useAnimatedStyle(() => {
        
        const scale = interpolate(
            offset.value,
            [1, 0],
            [.9, 1]
          );

        const transform = [{scale}]
    
        return {
            transform
        };
      });

    return animatedStyles;

}
