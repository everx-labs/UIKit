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

type VirtualizedListFrame = { inLayout: boolean; index: number; length: number; offset: number };

let now: number;
export function UICollapsableSectionList<ItemT, SectionT = DefaultSectionT>(
    props: SectionListProps<ItemT, SectionT>,
) {
    // const sectionsCoords = React.useRef<Record<string, number>>({});

    const { renderSectionHeader, sections } = props;

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
                    data: [],
                };
            }
            return section;
        });
    }, [sections, foldedSections]);

    const sectionsMapping = React.useRef<Record<string, string>>({});
    const sectionsFrames = React.useRef<Record<string, VirtualizedListFrame>>({});
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
    }

    const ref = React.useRef<QRCodeRef>(null);
    const snapshotRef = React.useRef<string>('');
    const [isSnapshotShown, setShowSnapshot] = React.useState(false);

    const edgeToCut = React.useRef();

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
                        const snapshotPng = await ref.current?.getPng();
                        if (snapshotPng == null) {
                            return;
                        }
                        snapshotRef.current = snapshotPng;
                        if (sectionsMapping.current[sectionKey] != null) {
                            console.log('section to animate', sectionsMapping.current[sectionKey]);
                            sectionToAnimateKey.current = sectionsMapping.current[sectionKey];
                        }
                        const currentSectionFrame =
                            listRef.current.getListRef()._frames[sectionKey];

                        const edge =
                            currentSectionFrame.offset +
                            currentSectionFrame.length -
                            listRef.current.getListRef()._scrollMetrics.offset;

                        edgeToCut.current = edge;

                        setShowSnapshot(true);
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
        [renderSectionHeader, foldedSections],
    );

    const listRef = React.useRef<VirtualizedSectionList<ItemT, SectionT>>(null);
    const listSize = React.useRef<{ width: number; height: number }>({ width: 0, height: 0 });

    const snapBottomTranslateY = useSharedValue(0);
    const snapBottomStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: snapBottomTranslateY.value,
                },
            ],
        };
    });

    const hideSnap = React.useCallback(() => {
        setShowSnapshot(false);
    }, []);

    return (
        <View
            style={{ position: 'relative', backgroundColor: 'white', flex: 1, overflow: 'hidden' }}
        >
            <Animated.View style={{ flex: 1 }}>
                <ScreenshotView ref={ref}>
                    <VirtualizedSectionList
                        ref={listRef}
                        {...props}
                        sections={processedSections}
                        extraData={processedSections.reduce(
                            (acc, { data }) => acc + data.length,
                            0,
                        )}
                        renderSectionHeader={renderCollapsableSectionHeader}
                        getItemCount={items => items.length}
                        getItem={(items, index) => items[index]}
                        onViewableItemsChanged={() => {
                            const list = listRef.current.getListRef();
                            if (sectionToAnimateKey.current) {
                                /**
                                 * It looks like that if I extracted that coords
                                 * every time I would distinct when it has changed
                                 * and run animation after that
                                 */
                                const frame = list._frames[
                                    sectionToAnimateKey.current
                                ] as VirtualizedListFrame;

                                const prev = sectionsFrames.current[sectionToAnimateKey.current];

                                console.log(frame);
                                console.log(prev);

                                if (
                                    prev.inLayout !== frame.inLayout ||
                                    prev.offset !== frame.offset
                                ) {
                                    console.log('changed!', Date.now() - now);
                                    if (frame.inLayout) {
                                        snapBottomTranslateY.value = 0;
                                        snapBottomTranslateY.value = withSpring(
                                            frame.offset - prev.offset,
                                            { overshootClamping: true },
                                            isFinished => {
                                                runOnJS(hideSnap)();
                                            },
                                        );
                                    }
                                }
                            }

                            Object.keys(sectionsMapping.current).forEach(sectionKey => {
                                sectionsFrames.current[sectionKey] = list._frames[sectionKey];
                            });
                        }}
                        onLayout={({
                            nativeEvent: {
                                layout: { width, height },
                            },
                        }: LayoutChangeEvent) => {
                            listSize.current.width = width;
                            listSize.current.height = height;
                        }}
                        style={{ backgroundColor: 'white' }}
                    />
                </ScreenshotView>
            </Animated.View>
            {isSnapshotShown && (
                <>
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: edgeToCut.current,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                overflow: 'hidden',
                                // borderWidth: 1,
                                borderColor: 'red',
                            },
                            snapBottomStyle,
                        ]}
                    >
                        <UIImage
                            onLoad={() => console.log('time to show snap', Date.now() - now)}
                            source={{ uri: snapshotRef.current }}
                            // resizeMode="contain"
                            // height={listRef.current.getListRef()._scrollMetrics.visibleLength}
                            style={{
                                position: 'absolute',
                                top: -edgeToCut.current,
                                left: 0,
                                right: 0,
                                width: listSize.current.width,
                                height: listSize.current.height,
                            }}
                        />
                    </Animated.View>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: edgeToCut.current,
                            overflow: 'hidden',
                            // borderWidth: 1,
                            borderColor: 'blue',
                        }}
                    >
                        <UIImage
                            onLoad={() => console.log('time to show snap', Date.now() - now)}
                            source={{ uri: snapshotRef.current }}
                            // height={listRef.current.getListRef()._scrollMetrics.visibleLength}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                width: listSize.current.width,
                                height: listSize.current.height,
                            }}
                        />
                    </View>
                </>
            )}
        </View>
    );
}
