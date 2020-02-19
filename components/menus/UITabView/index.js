// @flow
import type { ComponentType, Node } from 'react';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { NavigationState, Scene, SceneRendererProps } from 'react-native-tab-view';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';

type PageScreen = ComponentType<*>;
type PageCollection = {
    [string]: {
        title: string,
        screen: PageScreen,
    },
};

type RouteType = {
    key: string,
    title: string,
    testID?: string,
}

type SceneProps = SceneRendererProps<*> & Scene<*>;

type TabBarProps = SceneRendererProps<*>;

type UITabViewProps = {
    contentStyle: ViewStyleProp,
    tabWidth: number,
    pages: PageCollection,
    barAlign?: string,
    labelStyle?: TextStyleProp,
    inactiveTintColor?: string,
    onSwitchTab?: (index: number) => void,
};

type UITypeViewState = {
    index: number,
    routes: RouteType[],
} & NavigationState<*>;

const styles = StyleSheet.create({
    label: {
        textAlign: 'center',
        margin: UIConstant.smallContentOffset(),
        backgroundColor: 'transparent',
    },
});

export default class UITabView extends UIComponent<UITabViewProps, UITypeViewState> {
    static defaultProps = {
        tabWidth: 80,
        barAlign: 'center',
        labelStyle: UIStyle.text.primarySmallBold(),
        inactiveTintColor: UIColor.dark(),
    };

    constructor(props: UITabViewProps) {
        super(props);
        this.state = {
            index: 0,
            routes: [],
        };
        const screens: { [string]: PageScreen } = {};
        Object.keys(props.pages).forEach((key) => {
            const page = props.pages[key];
            this.state.routes.push({
                key,
                title: page.title,
                testID: undefined,
            });
            screens[key] = page.screen;
        });
        // $FlowExpectedError
        this.renderScene = SceneMap(screens);
    }

    // Events
    onIndexChange = (index: number) => {
        this.setStateSafely({ index });
        if (this.props.onSwitchTab) {
            this.props.onSwitchTab(index);
        }
    };

    // Getters
    getRoutes() {
        return this.state.routes;
    }

    getIndex() {
        return this.state.index;
    }

    getTapBarProps() {
        const {
            tabWidth, inactiveTintColor, barAlign, labelStyle,
        } = this.props;
        return {
            activeTintColor: UIColor.primary(),
            inactiveTintColor,
            style: {
                alignSelf: barAlign,
                backgroundColor: 'transparent',
                width: tabWidth * this.state.routes.length,
                shadowColor: 'transparent',
                shadowRadius: 0,
                borderWidth: 0, // maybe we need this
            },
            tabStyle: {
                backgroundColor: 'transparent', // maybe we need this
                borderWidth: 0, // maybe we need this
                width: tabWidth,
                paddingHorizontal: 0,
            },
            labelStyle,
            scrollEnabled: false,
            upperCaseLabel: false,
            indicatorStyle: {
                backgroundColor: UIColor.primary(),
            },
        };
    }

    // Fields
    tabBarProps: {
        activeTintColor: string,
        inactiveTintColor: string,
        labelStyle: TextStyleProp,
    };
    renderScene: (props: SceneProps) => Node;

    // Render
    // don't know why Scene<string> doesn't work
    renderLabel(props: any) {
        const { route } = props;
        const {
            activeTintColor,
            inactiveTintColor,
            labelStyle,
        } = this.getTapBarProps();

        const index = this.getRoutes().indexOf(route);
        const color = index === this.getIndex() ? activeTintColor : inactiveTintColor;
        const label = route.title;
        return (
            <Animated.Text style={[styles.label, labelStyle, { color }]}>
                {label}
            </Animated.Text>);
    }

    renderTabBar = (props: TabBarProps) => {
        return (
            <TabBar
                {...props}
                {...this.getTapBarProps()}
                renderLabel={labelProps => this.renderLabel(labelProps)}
            />
        );
    };

    render() {
        const navigationState = {
            index: this.state.index,
            routes: this.state.routes,
        };
        return (
            <TabView
                sceneContainerStyle={this.props.contentStyle}
                navigationState={navigationState}
                renderScene={this.renderScene}
                renderTabBar={this.renderTabBar}
                onIndexChange={this.onIndexChange}
            />
        );
    }
}
