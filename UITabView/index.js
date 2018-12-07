// @flow
import type { ComponentType, Node } from 'react';
import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { NavigationState, Scene, SceneRendererProps } from 'react-native-tab-view';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import UIColor from '../UIColor';
import UIConstant from '../UIConstant';
import UIStyle from '../UIStyle';

type PageScreen = ComponentType<*>;
type PageCollection = {
    [string]: {
        title: string,
        screen: PageScreen,
    },
};

type UITabViewProps = {
    tabWidth?: number,
    pages: PageCollection,
};

const styles = StyleSheet.create({
    icon: {
        height: 24,
        width: 24,
    },
    label: {
        textAlign: 'center',
        margin: UIConstant.smallContentOffset(),
        backgroundColor: 'transparent',
    },
});

export default class UITabView extends Component<UITabViewProps, NavigationState<*>> {
    static defaultProps = {
        tabWidth: 80,
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
        this.renderScene = SceneMap(screens);
        const tabWidth = props.tabWidth || UITabView.defaultProps.tabWidth;
        this.tabBarProps = {
            activeTintColor: UIColor.primary(),
            inactiveTintColor: UIColor.dark(),
            style: {
                alignSelf: 'center',
                backgroundColor: 'transparent',
                width: tabWidth * this.state.routes.length,
            },
            tabStyle: {
                width: tabWidth,
                paddingHorizontal: 0,
            },
            labelStyle: UIStyle.textPrimarySmallBold,
            scrollEnabled: false,
            upperCaseLabel: false,
            indicatorStyle: {
                backgroundColor: UIColor.primary(),
            },
        };
    }

    // Events
    onIndexChange(index: number) {
        this.setState({ index });
    }

    // Getters
    getRoutes() {
        return this.state.routes;
    }

    getIndex() {
        return this.state.index;
    }

    // Fields
    tabBarProps: {
        activeTintColor: string,
        inactiveTintColor: string,
        labelStyle: TextStyleProp,
    };
    renderScene: (props: SceneRendererProps<*> & Scene<*>) => Node;

    // Render
    renderLabel(props: { route: { title: string } }) {
        const { route } = props;
        const {
            activeTintColor,
            inactiveTintColor,
            labelStyle,
        } = this.tabBarProps;

        const index = this.getRoutes().indexOf(route);
        const color = index === this.getIndex() ? activeTintColor : inactiveTintColor;
        const label = route.title;
        return (
            <Animated.Text style={[styles.label, labelStyle, { color }]}>
                {label}
            </Animated.Text>);
    }

    renderHeader(props: SceneRendererProps<*>) {
        return (
            <TabBar
                {...props}
                {...this.tabBarProps}
                renderLabel={labelProps => this.renderLabel(labelProps)}
            />
        );
    }

    render() {
        const navigationState = {
            index: this.state.index,
            routes: this.state.routes,
        };
        return (
            <TabView
                navigationState={navigationState}
                renderScene={this.renderScene}
                renderTabBar={(props: SceneRendererProps<*>) => this.renderHeader(props)}
                onIndexChange={index => this.onIndexChange(index)}
            />
        );
    }
}
