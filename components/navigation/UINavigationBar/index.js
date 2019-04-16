// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        height: UIDevice.navigationBarHeight(),
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titleText: {
        marginHorizontal: UIConstant.contentOffset(),
        ...UIFont.subtitleBold(),
        color: UIColor.black(),
    },
    navigatorHeader: {
        ...StyleSheet.flatten(UIStyle.navigatorHeader),
        height: UIDevice.navigationBarHeight() * 2,
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
}

export type CreateNavigationOptions = (options: { navigation: ReactNavigation }) => {};

export type AnyComponent = Object;

type UINavigationBarOptions = {
    title?: string,
    useDefaultStyle?: boolean,
    searchBar?: boolean,
    headerLeft?: AnyComponent,
    headerRight?: AnyComponent,
    headerStyle?: {},
}

type UINavigationBarProps = {
    title?: string,
    headerLeft?: AnyComponent,
    headerRight?: AnyComponent,
}

export default class UINavigationBar extends UIComponent<UINavigationBarProps, *> {
    static defaultProps = {
        title: null,
        headerLeft: null,
        headerRight: null,
    };

    static navigationOptions(navigation: ReactNavigation, options: UINavigationBarOptions) {
        let effective;
        // if headerLeft option unspecified, we use back button
        const headerLeft = ('headerLeft' in options)
            ? options.headerLeft
            : <UINavigationBackButton navigation={navigation} />;

        if (options.useDefaultStyle) {
            effective = {
                ...options,
                headerLeft,
            };
        } else {
            effective = {
                headerStyle: [styles.navigatorHeader, options.headerStyle || {}],
                headerLeft: null, // only way to suppress unattended back button
                headerTitle: <UINavigationBar
                    title={options.title}
                    headerLeft={headerLeft}
                    headerRight={options.headerRight}
                />,
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

    getHeaderLeft(): ?AnyComponent {
        return this.props.headerLeft;
    }

    getHeaderRight(): ?AnyComponent {
        return this.props.headerRight;
    }

    // Component
    render() {
        const title = this.getTitle();
        const testIDProp = title ? { testID: `navBar_headers_${title}` } : null;
        return (
            <View style={styles.container}>
                <View
                    {...testIDProp}
                    style={styles.buttonsContainer}
                >
                    {this.getHeaderLeft()}
                    {this.getHeaderRight()}
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.getTitle()}</Text>
                </View>
            </View>
        );
    }
}
