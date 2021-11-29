import * as React from 'react';
import {
    DefaultSectionT,
    SectionListData,
    SectionListProps,
    View,
    // UIManager,
    TouchableOpacity,
    // StyleSheet,
} from 'react-native';

import { ScreenshotView, UIImage, QRCodeRef } from '@tonlabs/uikit.media';

import VirtualizedSectionList from 'react-native/Libraries/Lists/VirtualizedSectionList';

/**
 * Leave it just in case I would need to measure list again,
 * though it looks like I can extract all necessary info from VirtualizedList
 */
// const listRef = React.useRef<VirtualizedSectionList<ItemT, SectionT>>(null);

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
            if (foldedSections[key]) {
                return {
                    ...section,
                    data: [],
                };
            }
            return section;
        });
    }, [sections, foldedSections]);

    const sectionsMapping = React.useRef<Record<string, string>>({});
    const sectionsRefs = React.useRef<Record<string, React.RefObject<View>>>({});
    const prevSections = React.useRef<typeof props['sections']>().current;

    const sectionToAnimateKey = React.useRef<string | undefined>();

    if (prevSections !== sections) {
        let prevSectionKey: string | undefined;
        for (let i = 0; i < sections.length; i += 1) {
            const sectionKey = sections[i].key;
            if (sectionKey == null) {
                // TODO: can we do sth with it or better to throw an error?
                return null;
            }
            if (sectionKey && prevSectionKey != null) {
                sectionsMapping.current[prevSectionKey] = sectionKey;
            }
            prevSectionKey = sectionKey;
            if (sectionsRefs.current[sectionKey] == null) {
                sectionsRefs.current[sectionKey] = React.createRef();
            }
        }
    }

    const ref = React.useRef<QRCodeRef>(null);
    const snapshotRef = React.useRef<string>('');
    const [isSnapshotShown, setShowSnapshot] = React.useState(false);

    const renderCollapsableSectionHeader = React.useCallback(
        (info: { section: SectionListData<ItemT, SectionT> }) => {
            const sectionKey = info.section.key;
            if (sectionKey == null) {
                // TODO: can we do sth with it or better to throw an error?
                return null;
            }
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
                        setShowSnapshot(true);
                        setFoldedSections({
                            ...foldedSections,
                            [sectionKey]: !foldedSections[sectionKey],
                        });
                        // listCoords[sectionsMapping[sectionKey]]
                        setTimeout(() => {
                            setShowSnapshot(false);
                        }, 500);
                    }}
                >
                    {renderSectionHeader?.(info)}
                </TouchableOpacity>
            );
        },
        [renderSectionHeader, foldedSections],
    );

    return (
        <ScreenshotView ref={ref} style={{ flex: 1 }}>
            <View style={{ position: 'relative', backgroundColor: 'white' }}>
                <VirtualizedSectionList
                    {...props}
                    sections={processedSections}
                    extraData={processedSections.reduce((acc, { data }) => acc + data.length, 0)}
                    renderSectionHeader={renderCollapsableSectionHeader}
                    getItemCount={items => items.length}
                    getItem={(items, index) => items[index]}
                    onViewableItemsChanged={() => {
                        // console.log('sdfsdf', JSON.stringify(args, null, '  '));
                        console.log('sdfsdf', Date.now() - now);
                        // console.log(JSON.stringify(Object.keys(), null, '  '));
                        if (sectionToAnimateKey.current) {
                            /**
                             * It looks like that if I extracted that coords
                             * every time I would distinct when it has changed
                             * and run animation after that
                             */
                            const frame =
                                listRef.current.getListRef()._frames[
                                    `${sectionToAnimateKey.current}:header`
                                ];
                            console.log(frame == null ? 'not presented' : frame);
                        }
                    }}
                />
                {isSnapshotShown && (
                    <UIImage
                        onLoad={() => console.log('time to show snap', Date.now() - now)}
                        source={{ uri: snapshotRef.current }}
                        resizeMode="contain"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                        }}
                    />
                )}
            </View>
        </ScreenshotView>
    );
}
