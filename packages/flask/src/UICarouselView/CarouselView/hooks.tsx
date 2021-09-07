import React from "react";
import {Animated as WebAnimated} from 'react-native';
import Animated, { withSpring, useDerivedValue, interpolate, useAnimatedStyle, useSharedValue, interpolateColor } from 'react-native-reanimated';
import { Theme, UIBackgroundViewColors} from '@tonlabs/uikit.hydrogen';

import { PaginationState, UICarouselViewPageProps } from "../types";
import { UICarouselViewPage } from "./UICarouselViewPage";

export function useAnimatedValue(initialValue: number) {
  const lazyRef = React.useRef<WebAnimated.Value>();

  if (lazyRef.current === undefined) {
      lazyRef.current = new WebAnimated.Value(initialValue);
  }

  return lazyRef.current as WebAnimated.Value;
}

export const usePageStyle = (initialOffset: any) => {

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

        // TODO: pass animatedStyles only for active pages when new reanimated will work
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

const springConfig: Animated.WithSpringConfig = {
  damping: 100,
  stiffness: 500,
};

export const usePaginationStyle = (
    active: boolean,
    theme: Theme,
  ) => {

  const iconSwitcherState = useSharedValue<PaginationState>(
    PaginationState.NotActive
  );
  
  React.useEffect(() => {
    if (active && iconSwitcherState.value !== PaginationState.Active) {
        iconSwitcherState.value = PaginationState.Active;
    } else if (
        !active &&
        iconSwitcherState.value !== PaginationState.NotActive
    ) {
        iconSwitcherState.value = PaginationState.NotActive;
    }
  }, [active, iconSwitcherState]);

  const animatedValue = useDerivedValue(() => {
    return withSpring(iconSwitcherState.value, springConfig);
  });
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{
            scale: interpolate(
                animatedValue.value,
                [PaginationState.NotActive, PaginationState.Active],
                [1, 1.5],
            ),
        }],
        backgroundColor: interpolateColor(
            animatedValue.value,
            [PaginationState.NotActive, PaginationState.Active],
            [
              theme[UIBackgroundViewColors.BackgroundNeutral] as string, 
              theme[UIBackgroundViewColors.BackgroundAccent] as string
            ]
        )
    }
  });

  return {
    animatedStyles
  };

}

export const getPages = (
  children: React.ReactNode,
): React.ReactElement<UICarouselViewPageProps>[] => {
  const childElements: React.ReactElement<UICarouselViewPageProps>[] 
      = React.Children.toArray(children).reduce<React.ReactElement<UICarouselViewPageProps>[]>(
      (
          acc: React.ReactElement[],
          child: React.ReactNode,
      ): React.ReactElement<UICarouselViewPageProps>[] => {
          if (React.isValidElement(child)) {
              const pages: React.ReactElement<UICarouselViewPageProps>[] = acc;
              if (child.type === UICarouselViewPage) {
                  pages.push(child);
                  return pages;
              }

              if (child.type === React.Fragment) {
                  pages.push(...getPages(child.props.children));
                  return pages;
              }
          }
          if (__DEV__) {
              throw new Error(
                  `UICarouselViewContainer can only contain 'UICarouselView.Page' components as its direct children (found ${
                      // eslint-disable-next-line no-nested-ternary
                      React.isValidElement(child)
                          ? `${
                                typeof child.type === 'string'
                                    ? child.type
                                    : child.type?.name
                            }`
                          : typeof child === 'object'
                          ? JSON.stringify(child)
                          : `'${String(child)}'`
                  })`,
              );
          }
          return acc;
      },
      [],
  );

  return childElements;
};

export const usePages = (
  children:
      | React.ReactElement<UICarouselViewPageProps>
      | React.ReactElement<UICarouselViewPageProps>[],
): React.ReactElement<UICarouselViewPageProps>[] => {
  return React.useMemo((): React.ReactElement<UICarouselViewPageProps>[] => {
      const pages: React.ReactElement<UICarouselViewPageProps>[] = getPages(
          children,
      );
      return pages;
  }, [children]);
};