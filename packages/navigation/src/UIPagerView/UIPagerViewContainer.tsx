import * as React from 'react';
import {
    ColorValue,
    LayoutChangeEvent,
    LayoutRectangle,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import {
    NavigationState,
    Route,
    SceneMap,
    SceneRendererProps,
    TabBar,
    TabView,
} from 'react-native-tab-view';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
    ColorVariants,
} from '@tonlabs/uikit.hydrogen';
import { CONTENT_OFFSET, PAGER_VIEW_HEIGHT } from '../constants';
import type {
    UIPagerViewContainerProps,
    UIPagerViewContainerType,
    UIPagerViewPageProps,
} from '../UIPagerView';
import { UIPagerViewPage } from './UIPagerViewPage';

type SceneProps = SceneRendererProps & {
    route: Route;
};

type SceneList = {
    [key: string]: React.ComponentType<SceneProps>;
};

type SceneComponent = (props: SceneProps) => React.ReactNode;

type TabBarProps = SceneRendererProps & {
    navigationState: NavigationState<Route>;
};

type TabBarComponent = (props: TabBarProps) => React.ReactElement;

type LabelProps = {
    route: Route;
    focused: boolean;
};

const useRoutes = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
): Route[] => {
    return React.useMemo((): Route[] => {
        return pages.map(
            (child: React.ReactElement<UIPagerViewPageProps>): Route => {
                return {
                    key: child.props.id,
                    title: child.props.title,
                };
            },
        );
    }, [pages]);
};

const getPages = (
    children: React.ReactNode,
): React.ReactElement<UIPagerViewPageProps>[] => {
    const childElements: React.ReactElement<
        UIPagerViewPageProps
    >[] = React.Children.toArray(children).reduce<
        React.ReactElement<UIPagerViewPageProps>[]
    >(
        (
            acc: React.ReactElement<UIPagerViewPageProps>[],
            child: React.ReactNode,
        ): React.ReactElement<UIPagerViewPageProps>[] => {
            if (React.isValidElement(child)) {
                const pages: React.ReactElement<UIPagerViewPageProps>[] = acc;
                if (child.type === UIPagerViewPage) {
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
                    `UIPagerViewContainer can only contain 'UIPagerView.Page' components as its direct children (found ${
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

const usePages = (
    children:
        | React.ReactElement<UIPagerViewPageProps>
        | React.ReactElement<UIPagerViewPageProps>[],
): React.ReactElement<UIPagerViewPageProps>[] => {
    return React.useMemo((): React.ReactElement<UIPagerViewPageProps>[] => {
        const pages: React.ReactElement<UIPagerViewPageProps>[] = getPages(
            children,
        );
        return pages;
    }, [children]);
};

const getSceneList = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
): SceneList => {
    return pages.reduce(
        (
            sceneMap: SceneList,
            page: React.ReactElement<UIPagerViewPageProps>,
        ): SceneList => {
            const updatedSceneMap: SceneList = sceneMap;
            updatedSceneMap[page.props.id] = page.props.component;
            return updatedSceneMap;
        },
        {},
    );
};

const useScene = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
): SceneComponent => {
    return React.useMemo((): SceneComponent => {
        return SceneMap(getSceneList(pages));
    }, [pages]);
};

const getLabelColor = (
    focused: boolean,
    page: React.ReactElement<UIPagerViewPageProps>,
): ColorVariants => {
    if (page.props.isDestructive) {
        return UILabelColors.TextNegative;
    }
    if (focused) {
        return UILabelColors.TextPrimary;
    }
    return UILabelColors.TextSecondary;
};

const renderLabel = (pages: React.ReactElement<UIPagerViewPageProps>[]) => (
    props: LabelProps,
): React.ReactElement<typeof UILabel> | null => {
    const currentPage:
        | React.ReactElement<UIPagerViewPageProps>
        | undefined = pages.find(
        (page: React.ReactElement<UIPagerViewPageProps>): boolean =>
            page.props.id === props.route.key,
    );

    if (!currentPage) {
        return null;
    }

    const color: ColorVariants = getLabelColor(props.focused, currentPage);

    return (
        <UILabel
            testID={`uiPagerView_label-${currentPage.props.testID}`}
            color={color}
            role={UILabelRoles.ActionCallout}
            style={styles.labelStyle}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {props.route.title}
        </UILabel>
    );
};

const renderFixedTabBar = (
    props: TabBarProps,
    pages: React.ReactElement<UIPagerViewPageProps>[],
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
    type: UIPagerViewContainerType,
): React.ReactElement => {
    const tabBarStyle: StyleProp<ViewStyle> =
        type === 'FixedPadded' ? styles.fixedPaddedTabBar : styles.fixedTabBar;
    return (
        <TabBar
            {...props}
            indicatorStyle={[
                styles.indicator,
                {
                    backgroundColor: indicatorColor,
                },
            ]}
            style={tabBarStyle}
            renderLabel={renderLabel(pages)}
            tabStyle={[styles.tab, styles.fixedTab]}
            indicatorContainerStyle={[
                styles.indicatorContainer,
                {
                    backgroundColor: indicatorContainerColor,
                },
            ]}
        />
    );
};

const renderScrollableTabBar = (
    props: TabBarProps,
    pages: React.ReactElement<UIPagerViewPageProps>[],
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
): React.ReactElement => {
    return (
        <TabBar
            {...props}
            scrollEnabled
            pressColor="transparent"
            indicatorStyle={[
                styles.indicator,
                {
                    backgroundColor: indicatorColor,
                },
            ]}
            style={styles.scrollableTabBar}
            renderLabel={renderLabel(pages)}
            indicatorContainerStyle={[
                styles.indicatorContainer,
                {
                    backgroundColor: indicatorContainerColor,
                },
            ]}
            tabStyle={[styles.tab, styles.scrollableTab]}
        />
    );
};

const useTabBar = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
    type: UIPagerViewContainerType,
): TabBarComponent =>
    React.useCallback(
        (props: TabBarProps): React.ReactElement => {
            switch (type) {
                case 'Scrollable':
                    return renderScrollableTabBar(
                        props,
                        pages,
                        indicatorColor,
                        indicatorContainerColor,
                    );
                case 'Fixed':
                case 'FixedPadded':
                default:
                    return renderFixedTabBar(
                        props,
                        pages,
                        indicatorColor,
                        indicatorContainerColor,
                        type,
                    );
            }
        },
        [pages, indicatorColor, indicatorContainerColor, type],
    );

export const UIPagerViewContainer: React.FC<UIPagerViewContainerProps> = ({
    type,
    initialPageIndex = 0,
    onPageIndexChange,
    children,
    testID,
}: UIPagerViewContainerProps) => {
    const theme = useTheme();
    const [layout, setLayout] = React.useState<LayoutRectangle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [currentIndex, setCurrentIndex] = React.useState<number>(
        initialPageIndex,
    );

    const onLayout: (event: LayoutChangeEvent) => void = React.useCallback(
        (event: LayoutChangeEvent): void => {
            setLayout(event.nativeEvent.layout);
        },
        [],
    );

    React.useEffect((): void => {
        if (onPageIndexChange) {
            onPageIndexChange(currentIndex);
        }
    }, [currentIndex, onPageIndexChange]);

    const pages: React.ReactElement<UIPagerViewPageProps>[] = usePages(
        children,
    );

    const routes: Route[] = useRoutes(pages);

    const renderScene: SceneComponent = useScene(pages);

    const renderTabBar: TabBarComponent = useTabBar(
        pages,
        theme.TextPrimary,
        theme.LinePrimary,
        type,
    );

    if (pages.length === 0) {
        console.error(
            `UIPagerViewContainer: children must have at least 1 item`,
        );
        return null;
    }

    return (
        <View onLayout={onLayout} style={styles.container} testID={testID}>
            <TabView<Route>
                navigationState={{ index: currentIndex, routes }}
                renderScene={renderScene}
                onIndexChange={setCurrentIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
                style={{
                    backgroundColor: theme.BackgroundPrimary,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicator: {
        height: 1,
    },
    fixedTabBar: {
        height: PAGER_VIEW_HEIGHT,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        elevation: 0,
        justifyContent: 'center',
    },
    fixedPaddedTabBar: {
        height: PAGER_VIEW_HEIGHT,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        elevation: 0,
        justifyContent: 'center',
        marginHorizontal: CONTENT_OFFSET,
    },
    tab: {
        minHeight: 40,
        paddingVertical: 10,
        paddingHorizontal: CONTENT_OFFSET,
    },
    fixedTab: {
        alignItems: 'stretch',
    },
    indicatorContainer: {
        top: undefined,
        bottom: 16,
        height: 1,
    },
    scrollableTabBar: {
        height: PAGER_VIEW_HEIGHT,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        elevation: 0,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    scrollableTab: {
        width: 'auto',
    },
    labelStyle: {
        textAlign: 'center',
    },
});
