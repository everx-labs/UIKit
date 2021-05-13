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
import { UILabel, UILabelColors, UILabelRoles, useTheme } from '@tonlabs/uikit.hydrogen';
import type {
    UIPagerViewContainerProps,
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
            Page: React.ReactElement<UIPagerViewPageProps>,
        ): SceneList => {
            const scene: React.FC = () => Page;
            return {
                ...sceneMap,
                [Page.props.title]: scene,
            };
        },
        {},
    );
};

const renderLabel = (
    scene: {
        route: Route,
        focused: boolean;
        color: string;
    },
) => {
    return (
        <UILabel
            testID="uiPagerView_label"
            color={scene.focused ? UILabelColors.TextPrimary : UILabelColors.TextSecondary}
            role={UILabelRoles.ActionCallout}
        >
            {scene.route.title}
        </UILabel>
    );
};

const renderTabBar = (
    indicatorColor: ColorValue,
    indicatorContainerColor: ColorValue,
) => (
    props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
    },
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
                width: 'none',
            }}
            contentContainerStyle={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    );
};

export const UIPagerViewContainer: React.FC<UIPagerViewContainerProps> = ({
    // type,
    initialPageIndex,
    onPageIndexChange,
    children,
    testID,
}: UIPagerViewContainerProps) => {
    const theme = useTheme()
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
                navigationState={{ index: currentIndex, routes }}
                renderScene={renderScene}
                onIndexChange={setCurrentIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar(theme.TextPrimary, theme.LinePrimary)}
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
