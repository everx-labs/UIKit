// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIDevice from '../../../helpers/UIDevice';
import UIFont from '../../../helpers/UIFont';
import UIStyle from '../../../helpers/UIStyle';
import UINavigationBackButton from '../UINavigationBackButton';
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
        ...StyleSheet.flatten(UIStyle.navigatorHeader),
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

    addListener(event: any, callback: (payload: any) => void): { remove(): void };

    isFocused(): boolean;

    state(): {};

    setParams(params: {}): void;

    getParam(name: string): any;

    dispatch(action: {}): void;

    dangerouslyGetParent(): any;

    push(routeName: string): void;

    pop(num: number): void;
}

export type CreateNavigationOptions = (options: { navigation: ReactNavigation }) => {};

type UINavigationBarOptions = {
    title?: string,
    titleRight?: React$Node,
    useDefaultStyle?: boolean,
    searchBar?: boolean,
    headerLeft?: React$Node,
    headerRight?: React$Node,
    headerCenter?: React$Node,
    headerStyle?: {},
}

type UINavigationBarProps = {
    title?: string,
    titleRight?: React$Node,
    headerLeft?: React$Node,
    headerRight?: React$Node,
    headerCenter?: React$Node,
    containerStyle?: ViewStyleProp,
    buttonsContainerStyle?: ViewStyleProp,
};

/**
 * @deprecated utility for navigation used with react-navigation v2
 *
 * Actual version is for react-navigation v5 - UIReactNavigationBar
 */
export default class UINavigationBar extends UIComponent<
    UINavigationBarProps,
    *,
> {
    static defaultProps = {
        title: '',
        headerLeft: null,
        headerRight: null,
        headerCenter: null,
    };

    static navigationOptions(navigation: ReactNavigation, options: UINavigationBarOptions) {
        let effective;
        // if headerLeft option unspecified, we use back button
        const headerLeft = ('headerLeft' in options)
            ? options.headerLeft
            : (<UINavigationBackButton
                navigation={navigation}
                testID={`back_btn_${options.title || ''}`}
            />);

        const hasLeftOrRight = headerLeft || options.headerRight;

        if (options.useDefaultStyle) {
            effective = {
                ...options,
                headerLeft,
            };
        } else {
            effective = {
                headerStyle: [
                    styles.navigatorHeader,
                    { height: UIDevice.navigationBarHeight() * (hasLeftOrRight ? 2 : 1) },
                    options.headerStyle || {},
                ],
                headerLeft: null, // only way to suppress unattended back button
                headerTitle: (
                    <UINavigationBar
                        title={options.title}
                        titleRight={options.titleRight}
                        headerLeft={headerLeft}
                        headerRight={options.headerRight}
                        headerCenter={options.headerCenter}
                    />
                ),
            };
        }
        if (options.searchBar) {
            effective = {
                ...effective,
                ...UISearchBar.handleHeader(navigation),
            };
        }
        return effective;
    }

    // Getters
    getTitle(): ?string {
        return this.props.title;
    }

    getHeaderLeft(): ?React$Node {
        return this.props.headerLeft;
    }

    getHeaderCenter(): ?React$Node {
        return (
            <View style={styles.headerCenter} >
                {this.props.headerCenter}
            </View>
        );
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
        const {
            title, containerStyle, buttonsContainerStyle,
        } = this.props;

        const testIDProp = title ? { testID: `navBar_headers_${title}` } : null;
        const hasButtons = (this.getHeaderLeft() || this.getHeaderRight());

        return (
            <View style={containerStyle || styles.container}>
                {hasButtons &&
                    <View
                        {...testIDProp}
                        style={[styles.buttonsContainer, buttonsContainerStyle]}
                    >
                        {this.getHeaderCenter() /* `absolute` container, rendered bellow buttons */}
                        {this.getHeaderLeft()}
                        {this.getHeaderRight()}
                    </View>
                }
                {this.renderTitleView()}
            </View>
        );
    }
}
