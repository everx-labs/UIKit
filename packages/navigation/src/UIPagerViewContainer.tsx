import * as React from 'react';
import {
    StyleSheet,
    View,
    useWindowDimensions,
    ScaledSize,
    ColorValue,
} from 'react-native';
import {
    TabBar,
    TabView,
    SceneMap,
    Route,
    SceneRendererProps,
    NavigationState,
} from 'react-native-tab-view';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    useTheme,
} from '@tonlabs/uikit.hydrogen';
import type {
    UIPagerViewContainerProps,
    UIPagerViewPageProps,
    UIPagerViewContainerType,
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
            Page: React.ReactElement<UIPagerViewPageProps>,
        ): SceneList => {
            return {
                ...sceneMap,
                [Page.props.title]: Page.props.component,
            };
        },
        {},
    );
};

const renderLabel = (scene: {
    route: Route;
    focused: boolean;
    color: string;
}): React.ReactElement => {
    return (
        <UILabel
            testID="uiPagerView_label"
            color={
                scene.focused
                    ? UILabelColors.TextPrimary
                    : UILabelColors.TextSecondary
            }
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
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
) => {
    return (
        <TabBar
            {...props}
            indicatorStyle={{
                height: 1,
                backgroundColor: indicatorColor,
            }}
            style={{
                height: 72,
                backgroundColor: 'transparent',
                shadowColor: 'none',
                justifyContent: 'center',
                marginHorizontal: 16,
            }}
            renderLabel={renderLabel}
            indicatorContainerStyle={{
                top: 'none',
                bottom: 16,
                height: 1,
                backgroundColor: indicatorContainerColor,
            }}
        />
    );
};

const renderLeftTabBar = (
    props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
    },
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
) => {
    return (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{
                height: 1,
                backgroundColor: indicatorColor,
            }}
            style={{
                height: 72,
                backgroundColor: 'transparent',
                shadowColor: 'none',
                justifyContent: 'center',
                overflow: 'hidden',
                marginHorizontal: 16,
            }}
            renderLabel={renderLabel}
            indicatorContainerStyle={{
                top: 'none',
                bottom: 16,
                height: 1,
                backgroundColor: indicatorContainerColor,
            }}
            tabStyle={{
                paddingHorizontal: 8,
                width: 'auto',
            }}
        />
    );
};

const renderTabBar = (
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
    type: UIPagerViewContainerType,
) => (
    props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
    },
) => {
    switch (type) {
        case 'Left':
            return renderLeftTabBar(
                props,
                indicatorColor,
                indicatorContainerColor,
            );
        case 'Center':
        default:
            return renderCenterTabBar(
                props,
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
    const [currentIndex, setCurrentIndex] = React.useState(initialPageIndex);

    React.useEffect(() => {
        onPageIndexChange(currentIndex);
    }, [currentIndex, onPageIndexChange]);

    const layout: ScaledSize = useWindowDimensions();

    const pages: React.ReactElement<UIPagerViewPageProps>[] = Array.isArray(
        children,
    )
        ? children
        : [children];

    if (!pages || pages.length === 0) {
        console.error(
            `UIPagerViewContainer: children must have at least 1 item`,
        );
        return null;
    }

    const routes: Route[] = getRoutes(pages);

    const renderScene = SceneMap(getSceneList(pages));

    return (
        <View style={styles.container} testID={testID}>
            <TabView<Route>
                // lazy
                navigationState={{ index: currentIndex, routes }}
                renderScene={renderScene}
                onIndexChange={setCurrentIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar(
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
        height: 500,
        width: 400,
    },
});
