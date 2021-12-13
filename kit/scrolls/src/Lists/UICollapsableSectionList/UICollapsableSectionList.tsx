/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
    DefaultSectionT,
    SectionListData,
    SectionListProps,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
// TODO: it won't work on web. Consider to do sth with it, when do implementation for web.
// @ts-ignore
import VirtualizedSectionList from 'react-native/Libraries/Lists/VirtualizedSectionList';

import { ScreenshotImageView, ScreenshotImageViewRef } from './ScreenshotImageView';
import {
    useVirtualizedListFramesListener,
    VirtualizedListFrame,
    VirtualizedListScrollMetrics,
} from './useVirtualizedListFramesListener';

let now: number;

const emptyArray: any = [];
const LAST_SECTION_TAG = 'LAST_SECTION_TAG_DO_NOT_USE_THIS';
const duration = 1000;

/**
 * TODO: known problems.
 * This is was caught on Android:
 * - when a list has scroll (content is bigger than a visible area)
 *   and if one tries to collaps a section, after re-render, content become
 *   less than a visible area, that shifts it's position
 *   (actually it's reseted to 0) that breaks everything
 *
 * - (minor and I don't want to address it right now)
 *   If one tried to expand section that is the last one
 *   it won't change the position of the section,
 *   therefore there wouldn't be any visual feedback
 *   that it's expanded and one have to scroll manually
 *   to see some items in the expanded section
 */

async function prepareAnimation<ItemT, SectionT = DefaultSectionT>(
    sectionKey: string,
    foldedSections: Record<string, boolean>,
    screenshotRef: { current: ScreenshotImageViewRef | null },
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
         * Just show a screenshot above
         * Animation is handled later in frame change listener
         */
        screenshotRef.current?.show(sectionEndY, sectionEndY + visibleLength);
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
        await screenshotRef.current?.show(sectionEndY - visibleLength, realBottomOffset);
        screenshotRef.current?.moveAndHide(offset + visibleLength - sectionEndY, duration);

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
    await screenshotRef.current?.show(sectionEndY, visibleBottomOffset);
    screenshotRef.current?.moveAndHide(
        isFolded ? visibleBottomOffset - sectionEndY : sectionEndY - realBottomOffset,
        duration,
    );
}

/**
 * The component is separated to call as less hooks as possible
 * when section is toggled, since animation is depend on how
 * fast the list is re-rendered
 */
function UICollapsableSectionListInner<ItemT, SectionT = DefaultSectionT>({
    screenshotRef,
    listRef,
    sectionsMapping,
    sectionToAnimateKey,
    sections,
    renderSectionHeader,
    ...rest
}: {
    screenshotRef: { current: ScreenshotImageViewRef | null };
    listRef: { current: VirtualizedSectionList<ItemT, SectionT> };
    sectionsMapping: { current: Record<string, string> };
    sectionToAnimateKey: { current: string | undefined };
} & SectionListProps<ItemT, SectionT>) {
    const [foldedSections, setFoldedSections] = React.useState<Record<string, boolean>>({});

    const processedSections = React.useMemo(() => {
        return sections.map(section => {
            const { key } = section;
            if (!key) {
                return section;
            }
            if (foldedSections[`${key}:header`]) {
                return {
                    ...section,
                    data: emptyArray as ItemT[],
                };
            }
            return section;
        });
    }, [sections, foldedSections]);

    const renderCollapsableSectionHeader = React.useCallback(
        (info: { section: SectionListData<ItemT, SectionT> }) => {
            if (info.section.key == null) {
                // TODO: can we do sth with it or better to throw an error?
                return null;
            }
            const sectionKey = `${info.section.key}:header`;
            return (
                <TouchableOpacity
                    onPress={async () => {
                        now = Date.now();

                        prepareAnimation(
                            sectionKey,
                            foldedSections,
                            screenshotRef,
                            listRef,
                            sectionsMapping,
                            sectionToAnimateKey,
                        );

                        setFoldedSections({
                            ...foldedSections,
                            [sectionKey]: !foldedSections[sectionKey],
                        });
                    }}
                >
                    {renderSectionHeader?.(info)}
                </TouchableOpacity>
            );
        },
        [
            renderSectionHeader,
            foldedSections,
            listRef,
            screenshotRef,
            sectionsMapping,
            sectionToAnimateKey,
        ],
    );

    return (
        <ScreenshotImageView ref={screenshotRef} style={rest.style}>
            <VirtualizedSectionList
                ref={listRef}
                {...rest}
                sections={processedSections}
                // extraData={processedSections.reduce(
                //     (acc, { data }) => acc + data.length,
                //     0,
                // )}
                renderSectionHeader={renderCollapsableSectionHeader}
            />
        </ScreenshotImageView>
    );
}

export function UICollapsableSectionList<ItemT, SectionT = DefaultSectionT>(
    props: SectionListProps<ItemT, SectionT>,
) {
    const { sections, contentContainerStyle } = props;

    const sectionsMapping = React.useRef<Record<string, string>>({});
    const prevSections = React.useRef<typeof props['sections']>().current;

    const sectionToAnimateKey = React.useRef<string | undefined>();

    if (prevSections !== sections) {
        let prevSectionKey: string | undefined;
        for (let i = 0; i < sections.length; i += 1) {
            if (sections[i].key == null) {
                // TODO: can we do sth with it or better to throw an error?
                break;
            }
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

    const ref = React.useRef<ScreenshotImageViewRef>(null);
    const listRef = React.useRef<VirtualizedSectionList<ItemT, SectionT>>();

    const framesProxy = useVirtualizedListFramesListener(
        sectionsMapping.current,
        async (sectionKey, prev, next) => {
            if (sectionToAnimateKey.current == null) {
                return;
            }
            if (sectionKey !== sectionToAnimateKey.current) {
                return;
            }
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
                const list = listRef.current.getListRef();
                const { visibleLength, offset } =
                    list._scrollMetrics as VirtualizedListScrollMetrics;

                await ref.current?.append(next.offset, offset + visibleLength);
                ref.current?.moveAndHide(-visibleLength, duration);

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
                const list = listRef.current.getListRef();
                const { visibleLength } = list._scrollMetrics as VirtualizedListScrollMetrics;

                ref.current?.moveAndHide(visibleLength - prev.offset, duration);

                sectionToAnimateKey.current = undefined;
                return;
            }
            /**
             * The regular and the most simple case, when both sections are mounted
             */
            if (prev.inLayout && next.inLayout && prev.offset !== next.offset) {
                console.log('changed!', Date.now() - now, next.offset - prev.offset);

                ref.current?.moveAndHide(next.offset - prev.offset, duration);

                sectionToAnimateKey.current = undefined;
                return;
            }
            console.log('4');
        },
    );

    return (
        <UICollapsableSectionListInner
            {...props}
            screenshotRef={ref}
            listRef={listRef}
            sectionsMapping={sectionsMapping}
            sectionToAnimateKey={sectionToAnimateKey}
            getItemCount={items => items.length}
            getItem={(items, index) => items[index]}
            style={{ backgroundColor: 'white', flex: 1 }}
            contentContainerStyle={{
                backgroundColor: 'white',
                // TODO
                ...StyleSheet.flatten(contentContainerStyle),
            }}
            // @ts-expect-error
            patchedFrames={framesProxy}
        />
    );
}
