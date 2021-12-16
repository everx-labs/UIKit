/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { DefaultSectionT, SectionListData, SectionListProps, StyleSheet } from 'react-native';
// @ts-ignore
import VirtualizedSectionList from 'react-native/Libraries/Lists/VirtualizedSectionList';
// @ts-ignore
import setAndForwardRef from 'react-native-reanimated/lib/setAndForwardRef';

import { ColorVariants, UILabel, UILabelRoles, useTheme } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';

import { AccordionOverlayView, AccordionOverlayViewRef } from './AccordionOverlayView';
import {
    useVirtualizedListFramesListener,
    VirtualizedListFrame,
    VirtualizedListScrollMetrics,
} from './useVirtualizedListFramesListener';
import { CellRendererComponent } from './CellRendererComponent';

import { wrapScrollableComponent } from '../../wrapScrollableComponent';

let now: number;

const emptyArray: any = [];
const LAST_SECTION_TAG = 'LAST_SECTION_TAG_DO_NOT_USE_THIS_EXTERNALLY';
const duration = 1000;

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
                overlayRef.current
                    ?.show(sectionEndY, visibleLength - (sectionEndY - offset) + offsetDiff)
                    .then(() => {
                        overlayRef.current?.moveAndHide(-offsetDiff, duration);
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
        overlayRef.current?.show(sectionEndY - visibleLength, realBottomOffset).then(() => {
            overlayRef.current?.moveAndHide(offset + visibleLength - sectionEndY, duration);
        });

        return;
    }
    /**
     * The second case is actually like the regular one,
     * except change event won't fire, so we have to call
     * animation manually.
     */

    /**
     * Actually if statement should be `sectionEndY === visibleBottomOffset`
     * But in reality they might be not equal, with a diff less then 1.
     * Since values less than 1 (i.e 0.9) will be casted to `int` in native
     * we treat it as equality
     */
    if (Math.abs(sectionEndY - visibleBottomOffset) < 1) {
        // Do not animate here for now,
        // it's a special case
        return;
    }
    overlayRef.current?.show(sectionEndY, visibleBottomOffset).then(() => {
        overlayRef.current?.moveAndHide(
            isFolded ? visibleBottomOffset - sectionEndY : sectionEndY - realBottomOffset,
            duration,
        );
    });
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
 * when section is toggled, since animation is depend on how
 * fast the list is re-rendered.
 */
function UIAccordionSectionListInner<ItemT>({
    forwardedRef,
    overlayRef,
    listRef,
    sectionsMapping,
    sectionToAnimateKey,
    sections,
    ...rest
}: {
    forwardedRef: React.ForwardedRef<VirtualizedSectionList<ItemT, UIAccordionSection<ItemT>>>;
    overlayRef: { current: AccordionOverlayViewRef | null };
    listRef: { current: VirtualizedSectionList<ItemT, UIAccordionSection<ItemT>> };
    sectionsMapping: { current: Record<string, string> };
    sectionToAnimateKey: { current: string | undefined };
} & SectionListProps<ItemT, UIAccordionSection<ItemT>>) {
    const [foldedSections, setFoldedSections] = React.useState<Record<string, boolean>>({});
    // This is used to reduce re-creation of a press callback
    const foldedSectionsHolderRef = React.useRef<Record<string, boolean>>(foldedSections);
    React.useEffect(() => {
        foldedSectionsHolderRef.current = foldedSections;
    }, [foldedSections]);

    const processedSections = React.useMemo(() => {
        return sections.map(section => {
            const { key, isFolded, data } = section;
            if (!key) {
                return section;
            }
            if (!(`${key}:header` in foldedSections)) {
                if (isFolded) {
                    return {
                        ...section,
                        data: emptyArray as ItemT[],
                    };
                }
                return section;
            }
            return {
                ...section,
                data: foldedSections[`${key}:header`] ? (emptyArray as ItemT[]) : data,
                isFolded: foldedSections[`${key}:header`],
            };
        });
    }, [sections, foldedSections]);

    const onSectionHeaderPress = React.useCallback(
        (sectionKey: string) => {
            now = Date.now();

            prepareAnimation(
                sectionKey,
                foldedSectionsHolderRef.current,
                overlayRef,
                listRef,
                sectionsMapping,
                sectionToAnimateKey,
            );

            setFoldedSections({
                ...foldedSectionsHolderRef.current,
                [sectionKey]: !foldedSectionsHolderRef.current[sectionKey],
            });
        },
        [listRef, overlayRef, sectionsMapping, sectionToAnimateKey],
    );

    const renderCollapsableSectionHeader = React.useCallback(
        (info: { section: SectionListData<ItemT, UIAccordionSection<ItemT>> }) => {
            const sectionKey = `${info.section.key}:header`;
            return (
                <TouchableOpacity
                    onPress={() => onSectionHeaderPress(sectionKey)}
                    style={styles.sectionHeader}
                >
                    <UILabel role={UILabelRoles.HeadlineHead}>{info.section.title}</UILabel>
                </TouchableOpacity>
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
        const { sections, contentContainerStyle } = props;

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
                const sectionKey = `${sections[i].key}:header`;
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
                    overlayRef.current?.moveAndHide(-visibleLength, duration);

                    sectionToAnimateKey.current = undefined;
                    return;
                }
                if (prev == null) {
                    return;
                }
                /**
                 * The case is when section is expanded, and it's so big,
                 * that the next section being unmounted in the process.
                 * The animation for that case is to simply move
                 * the screenshot below bounds
                 */
                if (prev.inLayout && !next.inLayout) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('before animation time ms:', Date.now() - now);
                    }

                    overlayRef.current?.moveAndHide(
                        visibleLength - (prev.offset - offset),
                        duration,
                    );

                    sectionToAnimateKey.current = undefined;
                    return;
                }
                /**
                 * The regular and the most simple case, when both sections are mounted
                 */
                if (prev.inLayout && next.inLayout && prev.offset !== next.offset) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('before animation time ms:', Date.now() - now);
                    }

                    overlayRef.current?.moveAndHide(next.offset - (prev.offset - offset), duration);

                    sectionToAnimateKey.current = undefined;
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
                style={[bgStyle, styles.container]}
                contentContainerStyle={[bgStyle, contentContainerStyle]}
                CellRendererComponent={CellRendererComponent}
                stickySectionHeadersEnabled={false}
                // @ts-expect-error
                patchedFrames={framesProxy}
            />
        );
    }),
);

export const UIAccordionSectionList: <ItemT>(
    props: SectionListProps<ItemT, UIAccordionSection<ItemT>>,
) => React.ReactNode = wrapScrollableComponent(
    UIAccordionSectionListOriginal,
    'UIAccordionSectionList',
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    sectionHeader: {
        paddingTop: 20,
        paddingBottom: 16,
    },
});
