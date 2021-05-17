import * as React from 'react';
import {
    ColorValue,
    ScaledSize,
    View,
    useWindowDimensions,
    StyleSheet,
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
import type {
    UIPagerViewContainerProps,
    UIPagerViewContainerType,
    UIPagerViewPageProps,
} from './UIPagerView';

const getRoutes = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
): Route[] => {
    return pages.map(
        (child: React.ReactElement<UIPagerViewPageProps>): Route => {
            return {
                key: child.props.title,
                title: child.props.title,
            };
        },
    );
};

type SceneProps = SceneRendererProps & {
    route: Route;
};

type SceneList = {
    [key: string]: React.ComponentType<SceneProps>;
};

const getSceneList = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
): SceneList => {
    return pages.reduce(
        (
            sceneMap: SceneList,
            page: React.ReactElement<UIPagerViewPageProps>,
        ): SceneList => {
            return {
                ...sceneMap,
                [page.props.title]: page.props.component,
            };
        },
        {},
    );
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

const renderLabel = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
) => (scene: {
    route: Route;
    focused: boolean;
    color: string;
}): React.ReactElement<typeof UILabel> | null => {
    const currentPage:
        | React.ReactElement<UIPagerViewPageProps>
        | undefined = pages.find(
        (page: React.ReactElement<UIPagerViewPageProps>): boolean =>
            page.props.title === scene.route.title,
    );

    if (!currentPage) {
        return null;
    }

    const color: ColorVariants = getLabelColor(scene.focused, currentPage);

    return (
        <UILabel
            testID={`uiPagerView_label-${currentPage.props.testID}`}
            color={color}
            role={UILabelRoles.ActionCallout}
        >
            {scene.route.title}
        </UILabel>
    );
};

const renderCenterTabBar = (
    props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
    },
    pages: React.ReactElement<UIPagerViewPageProps>[],
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
): React.ReactElement => {
    return (
        <TabBar
            {...props}
            indicatorStyle={[
                styles.indicator,
                {
                    backgroundColor: indicatorColor,
                },
            ]}
            style={styles.centerTabBar}
            renderLabel={renderLabel(pages)}
            indicatorContainerStyle={[
                styles.indicatorContainer,
                {
                    backgroundColor: indicatorContainerColor,
                },
            ]}
        />
    );
};

const renderLeftTabBar = (
    props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
    },
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
            style={styles.leftTabBar}
            renderLabel={renderLabel(pages)}
            indicatorContainerStyle={[
                styles.indicatorContainer,
                {
                    backgroundColor: indicatorContainerColor,
                },
            ]}
            tabStyle={styles.leftTab}
        />
    );
};

const renderTabBar = (
    pages: React.ReactElement<UIPagerViewPageProps>[],
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
    type: UIPagerViewContainerType,
) => (
    props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
    },
): React.ReactElement => {
    switch (type) {
        case 'Left':
            return renderLeftTabBar(
                props,
                pages,
                indicatorColor,
                indicatorContainerColor,
            );
        case 'Center':
        default:
            return renderCenterTabBar(
                props,
                pages,
                indicatorColor,
                indicatorContainerColor,
            );
    }
};

export const UIPagerViewContainer: React.FC<UIPagerViewContainerProps> = ({
    type,
    initialPageIndex,
    onPageIndexChange,
    children,
    testID,
}: UIPagerViewContainerProps) => {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = React.useState<number>(
        initialPageIndex,
    );

    React.useEffect(() => {
        onPageIndexChange(currentIndex);
    }, [currentIndex, onPageIndexChange]);

    const layout: ScaledSize = useWindowDimensions();

    const pages: React.ReactElement<UIPagerViewPageProps>[] = Array.isArray(
        children,
    )
        ? children
        : [children];

    if (pages.length === 0) {
        console.error(
            `UIPagerViewContainer: children must have at least 1 item`,
        );
        return null;
    }

    const routes: Route[] = getRoutes(pages);

    const renderScene: (
        props: SceneRendererProps & {
            route: Route;
        },
    ) => React.ReactNode = SceneMap(getSceneList(pages));

    return (
        <View style={styles.container} testID={testID}>
            <TabView<Route>
                navigationState={{ index: currentIndex, routes }}
                renderScene={renderScene}
                onIndexChange={setCurrentIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar(
                    pages,
                    theme.TextPrimary,
                    theme.LinePrimary,
                    type,
                )}
                style={{
                    backgroundColor: theme.BackgroundPrimary,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    indicator: {
        height: 1,
    },
    centerTabBar: {
        height: 72,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        elevation: 0,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    indicatorContainer: {
        top: undefined,
        bottom: 16,
        height: 1,
    },
    leftTabBar: {
        height: 72,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        elevation: 0,
        justifyContent: 'center',
        overflow: 'hidden',
        marginHorizontal: 16,
    },
    leftTab: {
        paddingHorizontal: 8,
        width: 'auto',
    },
});
