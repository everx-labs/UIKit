// @flow
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { RouteProp, NavigationProp, ParamListBase } from '@react-navigation/native';
// import { TransitionPresets, Header } from '@react-navigation/stack';
import type { StackHeaderProps } from '@react-navigation/stack';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIDevice from '../../../helpers/UIDevice';
import UIFont from '../../../helpers/UIFont';
import UIStyle from '../../../helpers/UIStyle';
import UIReactNavigationBackButton from '../UIReactNavigationBackButton';
import UISearchBar from '../../input/UISearchBar';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignSelf: 'flex-start',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: UIDevice.navigationBarHeight(),
    },
    titleContainer: {
        marginHorizontal: UIConstant.contentOffset(),
        height: UIDevice.navigationBarHeight(),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        ...UIFont.subtitleBold(),
        color: UIColor.black(),
    },
    navigatorHeader: {
        ...StyleSheet.flatten(UIStyle.reactNavigationHeader),
    },
    defaultNavigationHeader: {
        borderBottomWidth: 0,
        elevation: Platform.select({
            android: 0,
        }),
    },
    headerCenter: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '20%', // to leave some space for headerLeft
        right: '20%', // to leave some space for headerRight
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export interface ReactNavigation {
    navigate(string): void;

    goBack(): void;

    addListener(event: any, callback: (payload: any) => void): () => void;

    isFocused(): boolean;

    state(): {};

    setParams(params: {}): void;

    getParam(name: string): any;

    dispatch(action: {}): void;

    dangerouslyGetParent(): any;

    push(routeName: string): void;
}

export type CreateNavigationOptions = (options: {
    navigation: ReactNavigation,
}) => {};

type UINavigationBarOptions = {
    title?: string,
    titleRight?: React$Node,
    useDefaultStyle?: boolean,
    searchBar?: boolean,
    headerLeft?: () => React$Node,
    headerRight?: () => React$Node,
    headerCenter?: React$Node,
    headerStyle?: {},
    headerTitleContainerStyle: ViewStyleProp,
};

type UINavigationBarProps = {
    title?: string,
    titleRight?: React$Node,
    headerLeft: React$Node,
    headerRight?: React$Node,
    headerCenter?: React$Node,
    containerStyle?: ViewStyleProp,
    buttonsContainerStyle?: ViewStyleProp,
};

export default class UIReactNavigationBar extends UIComponent<UINavigationBarProps, *> {
    static defaultProps = {
        title: '',
        headerLeft: null,
        headerRight: null,
        headerCenter: null,
    };

    static navigationOptions(
        navigation: NavigationProp<ParamListBase>,
        route: RouteProp<empty, string>,
        options: UINavigationBarOptions,
    ) {
        let effective;
        // if headerLeft option unspecified, we use back button
        let headerLeft;

        if ('headerLeft' in options && options.headerLeft != null) {
            ({ headerLeft } = options);
        } else {
            headerLeft = () => (
                <UIReactNavigationBackButton
                    navigation={navigation}
                    route={route}
                    testID={`back_btn_${options.title || ''}`}
                />
            );
        }

        const hasLeftOrRight = headerLeft || options.headerRight;

        if (options.useDefaultStyle) {
            effective = {
                headerStyle: styles.defaultNavigationHeader,
                ...options,
                headerLeft,
            };
        } else {
            // This is a hack around navigation height
            // Problem is with safe area insets that kinda hard to get
            // at that point, as this function is
            // - sync (it wouldn't be possible to use UIDevice.safeAreaInsets())
            // - not a react component (so hooks is not available)
            // Also I didn't want to pass it in options explicitly,
            // as it required to modify a lot of places
            let headerTopInset = 0;
            effective = {
                header: (props: StackHeaderProps) => {
                    if (props.insets?.top) {
                        headerTopInset = props.insets?.top;
                    }
                    return null; /* <Header {...props} />; */
                },
                headerStyle: [
                    styles.navigatorHeader,
                    {
                        get height() {
                            return (
                                headerTopInset +
                                (UIDevice.navigationBarHeight() * (hasLeftOrRight ? 2 : 1))
                            );
                        },
                    },
                    options.headerStyle || {},
                ],
                headerLeft: null, // only way to suppress unattended back button
                headerTitle: () => (
                    <UIReactNavigationBar
                        title={options.title}
                        titleRight={options.titleRight}
                        headerLeft={headerLeft()}
                        headerRight={options.headerRight && options.headerRight()}
                        headerCenter={options.headerCenter}
                    />
                ),
                headerTitleContainerStyle: {
                    left: 0,
                    right: 0,
                    position: 'absolute',
                    marginHorizontal: 0,
                    ...StyleSheet.flatten(options.headerTitleContainerStyle || {}),
                },
            };
        }
        if (options.searchBar) {
            effective = {
                ...effective,
                // $FlowFixMe
                ...UISearchBar.handleHeader(navigation),
            };
        }
        return {
            ...effective,
            // https://reactnavigation.org/docs/stack-navigator#pre-made-configs
            ...Platform.select({
                android: {},
                // default: TransitionPresets.SlideFromRightIOS,
            }),
            animationEnabled: true,
        };
    }

    // Getters
    getTitle(): ?string {
        return this.props.title;
    }

    getHeaderLeft(): React$Node {
        return this.props.headerLeft;
    }

    getHeaderCenter(): ?React$Node {
        return <View style={styles.headerCenter}>{this.props.headerCenter}</View>;
    }

    getHeaderRight(): ?React$Node {
        return this.props.headerRight;
    }

    renderTitleView(): React$Node {
        const { title, titleRight } = this.props;
        if (!title) {
            return null;
        }

        return (
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
                {titleRight}
            </View>
        );
    }

    // Component
    render(): React$Node {
        const { title, containerStyle, buttonsContainerStyle } = this.props;

        const testIDProp = title ? { testID: `navBar_headers_${title}` } : null;
        const hasButtons = this.getHeaderLeft() || this.getHeaderRight();

        return (
            <View style={containerStyle || styles.container}>
                {hasButtons && (
                    <View {...testIDProp} style={[styles.buttonsContainer, buttonsContainerStyle]}>
                        {this.getHeaderCenter() /* `absolute` container, rendered bellow buttons */}
                        {this.getHeaderLeft()}
                        {this.getHeaderRight()}
                    </View>
                )}
                {this.renderTitleView()}
            </View>
        );
    }
}
