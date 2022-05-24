/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { DefaultSectionT, SectionListData, SectionListProps, StyleSheet } from 'react-native';
// @ts-ignore
import VirtualizedSectionList from 'react-native/Libraries/Lists/VirtualizedSectionList';
// @ts-ignore
import setAndForwardRef from 'react-native-reanimated/lib/setAndForwardRef';

import { ColorVariants, useTheme } from '@tonlabs/uikit.themes';

import { AccordionOverlayView, AccordionOverlayViewRef } from './AccordionOverlayView';
import {
    useVirtualizedListFramesListener,
    VirtualizedListFrame,
    VirtualizedListScrollMetrics,
} from './useVirtualizedListFramesListener';
import { CellRendererComponent } from './CellRendererComponent';

import { wrapScrollableComponent } from '../../wrapScrollableComponent';
import { AccordionSectionHeader } from './AccordionSectionHeader';
import type { RNSectionList } from '../../types';

let now: number;

const emptyArray: any = [];
const LAST_SECTION_TAG = 'LAST_SECTION_TAG_DO_NOT_USE_THIS_EXTERNALLY';
const duration = 250;

/**
 * TODO: known problems.
 * This is was caught on Android:
 * - (minor and I don't want to address it right now)
 *   If one tries to expand a section that is the last one
 *   it won't change the position of the section,
 *   therefore there wouldn't be any visual feedback
 *   that it's expanded and one have to scroll manually
 *   to see some items in the expanded section
 */

function prepareAnimation<ItemT, SectionT = DefaultSectionT>(
    sectionKey: string,
    foldedSections: Record<string, boolean>,
    overlayRef: { current: AccordionOverlayViewRef | null },
    listRef: { current: VirtualizedSectionList<ItemT, SectionT> },
    sectionsMapping: { current: Record<string, string> },
    sectionToAnimateKey: { current: string | undefined },
    animationInProgress: { current: boolean },
) {
    const list = listRef.current.getListRef();

    sectionToAnimateKey.current = sectionsMapping.current[sectionKey];
    const currentSectionFrame: VirtualizedListFrame = list._frames[sectionKey];
    const { visibleLength, offset, contentLength } =
        list._scrollMetrics as VirtualizedListScrollMetrics;
    const realBottomOffset = Math.min(offset + visibleLength, contentLength);
    const visibleBottomOffset = offset + visibleLength;
    const sectionEndY = currentSectionFrame.offset + currentSectionFrame.length;
    const isFolded = foldedSections[sectionKey];

    if (sectionToAnimateKey.current !== LAST_SECTION_TAG) {
        /**
         * There is a special case when the section is unfolded
         * and we know the coords for the next section
         *
         * First of all, the area of the screenshot is not equal
         * to visible area.
         * Second, as we know everything we need, we can start
         * animation as soon as possible.
         */
        if (!isFolded) {
            const nextSectionFrame: VirtualizedListFrame =
                list._frames[sectionToAnimateKey.current];
            if (nextSectionFrame != null && nextSectionFrame.inLayout) {
                const offsetDiff = nextSectionFrame.offset - sectionEndY;
                /**
                 * It's easier to explain then to get proper naming for a variable.
                 * So here we trying to calculate, how much space it is
                 * in the visible area from it's top to the bottom point of
                 * the current section frame
                 */
                const currentFrameSpace = sectionEndY - offset;
                /**
                 * Here we calculate a size for area
                 * that will be visible when the animation
                 * is ended, from the point where the next section starts.
                 *
                 * This is all space that goes from the current frame
                 * bottom point, to the end of the visible area.
                 */
                const nextSectionSpace = visibleLength - currentFrameSpace;
                const endY = sectionEndY + Math.max(nextSectionSpace + offsetDiff, visibleLength);

                animationInProgress.current = true;
                overlayRef.current
                    ?.show(sectionEndY, endY)
                    .then(() => {
                        return overlayRef.current?.moveAndHide(-offsetDiff, duration);
                    })
                    .finally(() => {
                        animationInProgress.current = false;
                    });
                // Disable frame tracking
                sectionToAnimateKey.current = undefined;
                return;
            }
        }
        /**
         * Just show a screenshot above
         * Animation is handled later in frame change listener
         */
        animationInProgress.current = true;
        overlayRef.current?.show(sectionEndY, sectionEndY + visibleLength);
        return;
    }

    /**
     * Handle a special case, when the tapped section is the last one.
     * Since we don't need to wait for changes in next section coordinates
     * (as it obviously doesn't even exist)
     * we can start the animation straight away
     *
     * Here we actually have 2 scenarios:
     *
     * One thing to notice before we proceed.
     * When the content is big (there is room to scroll it)
     * and the last section is collapsing, it's the only case
     * when the current position will change their position
     * during the next re-render.
     * It will actually move to the bottom a scroll view.
     * So handle this case first.
     */
    if (currentSectionFrame.offset > visibleLength && !isFolded) {
        animationInProgress.current = true;
        overlayRef.current
            ?.show(sectionEndY - visibleLength, realBottomOffset)
            .then(() => {
                return overlayRef.current?.moveAndHide(
                    offset + visibleLength - sectionEndY,
                    duration,
                );
            })
            .finally(() => {
                animationInProgress.current = false;
            });

        return;
    }
    /**
     * The second case is actually like the regular one,
     * except change event won't fire, so we have to call
     * animation manually.
     */

    /**
     * Actually statement should be `sectionEndY === visibleBottomOffset`
     * But in reality they might be not equal, with a diff less then 1.
     * Since values less than 1 (i.e 0.9) will be casted to `int` in native
     * we treat it as equality
     */
    if (Math.abs(sectionEndY - visibleBottomOffset) < 1) {
        // Do not animate here for now,
        // it's a special case
        return;
    }
    animationInProgress.current = true;
    overlayRef.current
        ?.show(sectionEndY, visibleBottomOffset)
        .then(() => {
            return overlayRef.current?.moveAndHide(
                isFolded ? visibleBottomOffset - sectionEndY : sectionEndY - realBottomOffset,
                duration,
            );
        })
        .finally(() => {
            animationInProgress.current = false;
        });
}

function getVirtualizedHeaderKey(key: string) {
    return `${key}:header`;
}

function useFoldedSectionsState<ItemT>(
    sections: SectionListProps<ItemT, UIAccordionSection<ItemT>>['sections'],
) {
    const [foldedSectionsIntermediary, setFoldedSections] = React.useState<Record<string, boolean>>(
        () => ({}),
    );
    const foldedSections = React.useMemo(() => {
        return sections.reduce((acc, { key, isFolded }) => {
            const sectionKey = getVirtualizedHeaderKey(key);

            // Do not override if we already track it internally
            if (sectionKey in foldedSectionsIntermediary) {
                acc[sectionKey] = foldedSectionsIntermediary[sectionKey];
            } else {
                acc[sectionKey] = isFolded == null ? false : isFolded;
            }

            return acc;
        }, {} as Record<string, boolean>);
    }, [sections, foldedSectionsIntermediary]);

    // This is used to reduce re-creation of a press callback
    const foldedSectionsHolderRef = React.useRef<Record<string, boolean>>(foldedSections);
    React.useEffect(() => {
        foldedSectionsHolderRef.current = foldedSections;
    }, [foldedSections]);

    return { foldedSections, setFoldedSections, foldedSectionsHolderRef };
}

type UIAccordionSection<ItemT> = {
    /**
     * Items that will be rendered in a section
     */
    data: ReadonlyArray<ItemT>;
    /**
     * The unique key to identify section.
     * NB - This is a mandatory field!
     */
    key: string;
    /**
     * Title that will be rendered in UILabel inside a section
     */
    title: string;
    /**
     * Used to control the default visiblity of a section
     */
    isFolded?: boolean;
};

/**
 * The component is separated to call as less hooks as possible
 * when a section is toggled, since the animation depends on how
 * fast the list is re-rendered.
 */
function UIAccordionSectionListInner<ItemT>({
    forwardedRef,
    overlayRef,
    listRef,
    sectionsMapping,
    sectionToAnimateKey,
    animationInProgress,
    sections,
    ...rest
}: {
    forwardedRef: React.ForwardedRef<VirtualizedSectionList<ItemT, UIAccordionSection<ItemT>>>;
    overlayRef: { current: AccordionOverlayViewRef | null };
    listRef: { current: VirtualizedSectionList<ItemT, UIAccordionSection<ItemT>> };
    sectionsMapping: { current: Record<string, string> };
    sectionToAnimateKey: { current: string | undefined };
    animationInProgress: { current: boolean };
} & SectionListProps<ItemT, UIAccordionSection<ItemT>>) {
    const { foldedSections, setFoldedSections, foldedSectionsHolderRef } =
        useFoldedSectionsState(sections);

    const processedSections = React.useMemo(() => {
        return sections.map(section => {
            const { key, data } = section;
            return {
                ...section,
                data: foldedSections[getVirtualizedHeaderKey(key)] ? (emptyArray as ItemT[]) : data,
                isFolded: foldedSections[getVirtualizedHeaderKey(key)],
            };
        });
    }, [sections, foldedSections]);

    const onSectionHeaderPress = React.useCallback(
        (sectionKey: string) => {
            if (animationInProgress.current) {
                return;
            }

            now = Date.now();

            prepareAnimation(
                sectionKey,
                foldedSectionsHolderRef.current,
                overlayRef,
                listRef,
                sectionsMapping,
                sectionToAnimateKey,
                animationInProgress,
            );

            setFoldedSections({
                ...foldedSectionsHolderRef.current,
                [sectionKey]: !foldedSectionsHolderRef.current[sectionKey],
            });
        },
        [
            listRef,
            overlayRef,
            sectionsMapping,
            sectionToAnimateKey,
            animationInProgress,
            foldedSectionsHolderRef,
            setFoldedSections,
        ],
    );

    const renderCollapsableSectionHeader = React.useCallback(
        (info: { section: SectionListData<ItemT, UIAccordionSection<ItemT>> }) => {
            const sectionKey = getVirtualizedHeaderKey(info.section.key);
            return (
                <AccordionSectionHeader
                    title={info.section.title}
                    isFolded={info.section.isFolded}
                    sectionKey={sectionKey}
                    onSectionHeaderPress={onSectionHeaderPress}
                    duration={duration}
                />
            );
        },
        [onSectionHeaderPress],
    );

    return (
        <AccordionOverlayView ref={overlayRef} style={rest.style}>
            <VirtualizedSectionList
                ref={forwardedRef}
                {...rest}
                sections={processedSections}
                renderSectionHeader={renderCollapsableSectionHeader}
            />
        </AccordionOverlayView>
    );
}

const defaultKeyExtractor = (item: any) => item.key;
const defaultGetItemCount = (items: any) => items.length;
const defaultGetItem = (items: any, index: number) => items[index];

/**
 * A component whose sections can expand and collapse with animation.
 * The component is almost identical to [SectionList](https://reactnative.dev/docs/sectionlist),
 * except few things that important to consider of:
 * - `stickySectionHeadersEnabled` is set to `false`,
 *    the animation doesn't work properly with it;
 * - `renderSectionHeader` won't give any effect,
 *    instead title from a section will be used.
 */
const UIAccordionSectionListOriginal = React.memo(
    React.forwardRef<
        VirtualizedSectionList<any, UIAccordionSection<any>>,
        SectionListProps<any, UIAccordionSection<any>>
    >(function UIAccordionSectionListOriginal<ItemT>(
        props: SectionListProps<ItemT, UIAccordionSection<ItemT>>,
        ref: React.ForwardedRef<VirtualizedSectionList<ItemT, UIAccordionSection<ItemT>>>,
    ) {
        const { sections, contentContainerStyle, keyExtractor, getItemCount, getItem } = props;

        const theme = useTheme();
        const bgStyle = React.useMemo(
            () => ({
                backgroundColor: theme[ColorVariants.BackgroundPrimary],
            }),
            [theme],
        );

        const sectionsMapping = React.useRef<Record<string, string>>({});
        const prevSections = React.useRef<typeof props['sections']>().current;

        const sectionToAnimateKey = React.useRef<string | undefined>();

        if (prevSections !== sections) {
            let prevSectionKey: string | undefined;
            for (let i = 0; i < sections.length; i += 1) {
                const sectionKey = getVirtualizedHeaderKey(sections[i].key);
                if (sectionKey && prevSectionKey != null) {
                    sectionsMapping.current[prevSectionKey] = sectionKey;
                }
                prevSectionKey = sectionKey;
            }
            if (prevSectionKey != null) {
                // A special flag to tell that it's a last section
                sectionsMapping.current[prevSectionKey] = LAST_SECTION_TAG;
            }
        }

        const overlayRef = React.useRef<AccordionOverlayViewRef>(null);
        const listRefLocal =
            React.useRef<VirtualizedSectionList<ItemT, UIAccordionSection<ItemT>>>();
        const setListRef = React.useMemo(
            () =>
                setAndForwardRef({
                    getForwardedRef: () => ref,
                    setLocalRef: (localRef: any) => {
                        listRefLocal.current = localRef;
                    },
                }),
            [ref],
        );

        const animationInProgress = React.useRef(false);

        const framesProxy = useVirtualizedListFramesListener(
            sectionsMapping.current,
            async (sectionKey, prev, next) => {
                if (sectionToAnimateKey.current == null) {
                    return;
                }
                if (sectionKey !== sectionToAnimateKey.current) {
                    return;
                }
                const list = listRefLocal.current.getListRef();
                const { visibleLength, offset } =
                    list._scrollMetrics as VirtualizedListScrollMetrics;
                /**
                 * The following case is a situation when the big section
                 * is collapsed, and it was so big, that the next section wasn't
                 * mounted (because of virtualization).
                 *
                 * This is a special case, because beside simple movement of a screenshot
                 * we actually have to take an additional screenshot at the moment
                 * and append it to a previous one. And then start animation from the lower bound
                 */
                if ((prev == null || !prev.inLayout) && next.inLayout) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('before animation time ms:', Date.now() - now);
                    }

                    await overlayRef.current?.append(next.offset, offset + visibleLength);
                    await overlayRef.current?.moveAndHide(-visibleLength, duration);

                    sectionToAnimateKey.current = undefined;
                    animationInProgress.current = false;
                    return;
                }
                if (prev == null) {
                    return;
                }
                /**
                 * The case is when the section is expanded, and it's so big,
                 * that the next section being unmounted in the process.
                 * The animation for that case is to simply move
                 * the screenshot below bounds
                 */
                if (prev.inLayout && !next.inLayout) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('before animation time ms:', Date.now() - now);
                    }

                    await overlayRef.current?.moveAndHide(
                        visibleLength - (prev.offset - offset),
                        duration,
                    );

                    sectionToAnimateKey.current = undefined;
                    animationInProgress.current = false;
                    return;
                }
                /**
                 * The regular and the most simple case, when both sections are mounted
                 */
                if (prev.inLayout && next.inLayout && prev.offset !== next.offset) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('before animation time ms:', Date.now() - now);
                    }

                    await overlayRef.current?.moveAndHide(
                        next.offset - (prev.offset - offset),
                        duration,
                    );

                    sectionToAnimateKey.current = undefined;
                    animationInProgress.current = false;
                }
            },
        );

        return (
            <UIAccordionSectionListInner
                {...props}
                forwardedRef={setListRef}
                overlayRef={overlayRef}
                listRef={listRefLocal}
                sectionsMapping={sectionsMapping}
                sectionToAnimateKey={sectionToAnimateKey}
                animationInProgress={animationInProgress}
                style={[bgStyle, styles.container]}
                contentContainerStyle={[bgStyle, contentContainerStyle]}
                CellRendererComponent={CellRendererComponent}
                stickySectionHeadersEnabled={false}
                // SectionList does the same under the hood
                // since we use VirtualizedSectionList need to do the same
                keyExtractor={keyExtractor || defaultKeyExtractor}
                getItemCount={getItemCount || defaultGetItemCount}
                getItem={getItem || defaultGetItem}
                // @ts-expect-error
                patchedFrames={framesProxy}
            />
        );
    }),
);

export const UIAccordionSectionList: typeof RNSectionList = wrapScrollableComponent(
    UIAccordionSectionListOriginal,
    'UIAccordionSectionList',
);

const styles = StyleSheet.create({
    container: { flex: 1 },
});
