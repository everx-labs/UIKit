import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useSheetSize } from './UISheet/SheetSize';
import { useSheetReady } from './UISheet/usePosition';

/**
 * (savelichalex):
 * I'd rather predered not to have it, but it is as it is.
 *
 * A quote from ScrollView docs:
 * "Keep in mind that ScrollViews must have a bounded height in order to work,
 *  since they contain unbounded-height children into a bounded container"
 * https://reactnative.dev/docs/scrollview
 *
 * Since some UISheets (like UICardSheet or UIBottomSheet)
 * have the height of the size of it's content (intrinsic)
 * by default ScrollView won't work,
 * because of what was mentioned in the quote above.
 *
 * In order to overcome it, there is a helper, that makes ScrollView
 * to work with UISheet.
 *
 * Example of usage:
 * ```ts
 * import { ScrollView } from '@tonlabs/uikit.scrolls';
 * import {
 *     UIBottomSheet,
 *     useIntrinsicSizeScrollView,
 * } from '@tonlabs/uikit.popovers';
 *
 * function SheetContent() {
 *     const { style, onContentSizeChange } = useIntrinsicSizeScrollView();
 *
 *     return (
 *         <ScrollView
 *             containerStyle={style}
 *             onContentSizeChange={onContentSizeChange}
 *         >
 *             {content}
 *         </ScrollView>
 *     );
 * }
 *
 * function Screen() {
 *     const [visible, setVisible] = React.useState(false);
 *     return (
 *         <UIBottomSheet
 *             visible={visible}
 *             onClose={() => setVisible(false)}
 *         >
 *             <SheetContent />
 *         </UIBottomSheet>
 *     );
 * }
 * ```
 */
export function useIntrinsicSizeScrollView() {
    const { maxPossibleHeight, height: parentHeight } = useSheetSize();
    const scrollViewContentHeight = useSharedValue(0);
    const ready = useSheetReady();

    const firstRender = React.useRef<boolean>();

    if (firstRender.current == null) {
        ready.value = false;
        firstRender.current = true;
    }

    const restSpace = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            height: Math.min(
                maxPossibleHeight.value - restSpace.value,
                scrollViewContentHeight.value,
            ),
        };
    });

    const onContentSizeChange: ScrollViewProps['onContentSizeChange'] = React.useCallback(
        (_, height) => {
            if (ready.value) {
                scrollViewContentHeight.value = height;
                return;
            }

            /**
             * It's a bit hacky way to know how much space
             * in UISheet is taken by another views.
             *
             * It based on a fact that during first render
             * a ScrollView wouldn't take any space (height = 0),
             * but other views should have size specified, or
             * they have paddings or margins.
             *
             * So basically before set the height for the very first time
             * we just wait for the `onLayout` on the parent view
             * (rAF should fire after it (at least I hope so))
             * and then capture it, to later extract from overall height,
             * that allows to calculate the exact space that a ScrollView
             * should be
             */
            (function checkParentHeight() {
                if (parentHeight.value === 0) {
                    requestAnimationFrame(checkParentHeight);
                    return;
                }

                restSpace.value = parentHeight.value;
                scrollViewContentHeight.value = height;

                /**
                 * Skip 3 frames instead of 1 with rAF,
                 * that provide more stability to an open animation.
                 *
                 * Was chosen by an eye test.
                 */
                setTimeout(() => {
                    ready.value = true;
                }, 3 * 16);
            })();
        },
        [scrollViewContentHeight, ready, restSpace, parentHeight],
    );

    return {
        style,
        onContentSizeChange,
    };
}
