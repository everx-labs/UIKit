/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
    DefaultSectionT,
    SectionListData,
    SectionListProps,
    View,
    // UIManager,
    TouchableOpacity,
    LayoutChangeEvent,
    StyleSheet,
    VirtualizedList,
    // StyleSheet,
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { ScreenshotView, UIImage, QRCodeRef } from '@tonlabs/uikit.media';

import VirtualizedSectionList from 'react-native/Libraries/Lists/VirtualizedSectionList';

import { ScreenshotImageView, ScreenshotImageViewRef } from './ScreenshotImageView';

const originalCompDidMount = VirtualizedList.prototype.componentDidMount;

VirtualizedList.prototype.componentDidMount = function componentDidMount(...args) {
    if (originalCompDidMount) {
        originalCompDidMount.apply(this, args);
    }
    if ('patchedFrames' in this.props && this.props.patchedFrames != null) {
        this._frames = this.props.patchedFrames;
    }
};

type VirtualizedListFrame = { inLayout: boolean; index: number; length: number; offset: number };

/**
 * VirtualizedList do a lot of work under the hood,
 * what is the most important for us - it track coordinates
 * for cells, that it manages.
 *
 * Unfortunatelly though, it doesn't have a way to notify
 * somehow about the changes in that frames.
 * VirtualizedList has `onViewableItemsChanged`, but it doesn't have
 * coords in event payload.
 *
 * So how it works?
 * We just replace internal object, with proxy object,
 * that intercept mutations, and if a key of changed frame
 * is the one that we want to track, it notifies about changes.
 */
function useFramesProxyListener(
    keysToListen: Record<string, any>,
    listener: (key: string, prev: VirtualizedListFrame, next: VirtualizedListFrame) => void,
) {
    const proxyRef = React.useRef<typeof Proxy>();
    if (proxyRef.current == null) {
        const frameTarget = {
            set(obj: VirtualizedListFrame, key: string, value: any) {
                if (obj[prop] !== value) {
                    listener(this.key, obj, { ...obj, [key]: value });
                }
                obj[key] = value;
                return true;
            },
        };
        const target = {
            set(
                obj: Record<string, VirtualizedListFrame>,
                key: string,
                value: VirtualizedListFrame,
            ) {
                if (!(key in keysToListen)) {
                    obj[key] = value;
                    return true;
                }
                const prev = obj[key];
                if (prev != null) {
                    listener(key, prev, value);
                }

                obj[key] = new Proxy(value, { ...frameTarget, key });
                return true;
            },
        };
        // @ts-expect-error
        proxyRef.current = new Proxy({}, target);
    }
    return proxyRef.current;
}

let now: number;

const emptyArray: any = [];
type LastSection = -1;
const LAST_SECTION_TAG: LastSection = -1;
const duration = 1000;

async function prepareAnimation<ItemT, SectionT = DefaultSectionT>(
    sectionKey: string,
    foldedSections: Record<string, boolean>,
    screenshotRef: { current: ScreenshotImageViewRef },
    listRef: { current: VirtualizedSectionList<ItemT, SectionT> },
    sectionsMapping: { current: Record<string, string> },
    sectionToAnimateKey: { current: string | LastSection | undefined },
) {
    const list = listRef.current.getListRef();

    sectionToAnimateKey.current = sectionsMapping.current[sectionKey];
    const currentSectionFrame: VirtualizedListFrame = list._frames[sectionKey];
    const { visibleLength, offset, contentLength } = list._scrollMetrics;
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
        await screenshotRef.current?.show(
            sectionEndY - visibleLength,
            offset + visibleLength - sectionEndY,
        );
        screenshotRef.current?.moveAndHide(offset + visibleLength - sectionEndY, duration);

        return;
    }
    /**
     * The second case is actually like the regular one,
     * except change event won't fire, so we have to call
     * animation manually.
     */
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
    screenshotRef: { current: ScreenshotImageViewRef };
    listRef: { current: VirtualizedSectionList<ItemT, SectionT> };
    sectionsMapping: { current: Record<string, string> };
    sectionToAnimateKey: { current: string | LastSection | undefined };
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

    const sectionsMapping = React.useRef<Record<string, string | LastSection>>({});
    const prevSections = React.useRef<typeof props['sections']>().current;

    const sectionToAnimateKey = React.useRef<string | LastSection | undefined>();

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

    const listRef = React.useRef<VirtualizedSectionList<ItemT, SectionT>>(null);

    const framesProxy = useFramesProxyListener(
        sectionsMapping.current,
        (sectionKey, prev, next) => {
            if (sectionToAnimateKey.current == null) {
                return;
            }
            if (sectionKey !== sectionToAnimateKey.current) {
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
                const { visibleLength } = list._scrollMetrics;

                ref.current?.moveAndHide(visibleLength - prev.offset, duration);
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
                const { visibleLength } = list._scrollMetrics;

                // TODO: should they be sequential?
                // ref.current?.appendAdditional(next.offset);
                ref.current?.moveAndHide(-visibleLength, duration);
                return;
            }
            /**
             * The regular and the most simple case, when both sections are mounted
             */
            if (prev.inLayout && next.inLayout && prev.offset !== next.offset) {
                console.log('changed!', Date.now() - now, next.offset - prev.offset);

                if (next.inLayout) {
                    ref.current?.moveAndHide(next.offset - prev.offset, duration);
                }
            }
            sectionToAnimateKey.current = undefined;
        },
    );

    // const snapBottomTranslateY = useSharedValue(0);

    return (
        <UICollapsableSectionListInner
            {...props}
            screenshotRef={ref}
            listRef={listRef}
            sectionsMapping={sectionsMapping}
            sectionToAnimateKey={sectionToAnimateKey}
            getItemCount={items => items.length}
            getItem={(items, index) => items[index]}
            // onViewableItemsChanged={onViewableItemsChanged}
            style={{ backgroundColor: 'white', flex: 1 }}
            contentContainerStyle={{
                backgroundColor: 'white',
                // TODO
                ...StyleSheet.flatten(contentContainerStyle),
            }}
            patchedFrames={framesProxy}
        />
    );
}
