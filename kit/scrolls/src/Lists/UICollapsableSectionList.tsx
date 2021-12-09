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

/**
 * Leave it just in case I would need to measure list again,
 * though it looks like I can extract all necessary info from VirtualizedList
 */
// const coordsToNormalize = React.useRef<{ y: number; cb: (y: number) => void }[]>([]);

// React.useLayoutEffect(() => {
//     function measureList() {
//         const scrollNode = listRef.current?.getListRef().getScrollableNode();
//         if (scrollNode == null) {
//             return;
//         }
//         UIManager.measureInWindow(scrollNode, (_x, y, _width, height) => {
//             if (height === 0) {
//                 requestAnimationFrame(measureList);
//                 return;
//             }
//             listCoords.current.y = y;
//             listCoords.current.height = height;
//             if (coordsToNormalize.current.length > 0) {
//                 coordsToNormalize.current.forEach(({ y: rawY, cb }) => {
//                     cb(rawY - y);
//                 });
//                 coordsToNormalize.current = [];
//             }

//             // console.log(JSON.stringify(listRef.current.getListRef()._frames, null, '  '));
//         });
//     }
//     measureList();
//     // listRef.current?.
// }, []);

let now: number;

const emptyArray: any = [];

/**
 * The component is separated to call as less hooks as possible
 * when section is toggled
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
    screenshotRef: React.RefObject<ScreenshotImageViewRef>;
    listRef: React.RefObject<VirtualizedSectionList<ItemT, SectionT>>;
    sectionsMapping: React.RefObject<Record<string, string>>;
    sectionToAnimateKey: React.RefObject<string | undefined>;
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

                        const list = listRef.current.getListRef();

                        sectionToAnimateKey.current = sectionsMapping.current[sectionKey];
                        const currentSectionFrame: VirtualizedListFrame = list._frames[sectionKey];

                        const sectionEndY = currentSectionFrame.offset + currentSectionFrame.length;
                        screenshotRef.current?.show(
                            sectionEndY,
                            sectionEndY + list._scrollMetrics.visibleLength,
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
            sectionsMapping.current[prevSectionKey] = undefined;
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
            if (prev.inLayout !== next.inLayout || prev.offset !== next.offset) {
                console.log('changed!', Date.now() - now, next.offset - prev.offset);

                if (next.inLayout) {
                    ref.current?.moveAndHide(next.offset - prev.offset, 1000);
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
