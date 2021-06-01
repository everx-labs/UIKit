/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
// $FlowFixMe
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
// $FlowFixMe
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
// $FlowFixMe
import { createSurfSplitNavigator } from 'react-navigation-surf';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UIColor } from '@tonlabs/uikit.core';
import {
    UIButton,
    UILayoutManager,
    UIToggle,
    UINotice,
    UIAlert,
    UIAlertView,
    UIDropdownAlert,
} from '@tonlabs/uikit.components';
import {
    UICountryPicker,
    UIActionSheet,
    UIPopoverBackground,
} from '@tonlabs/uikit.navigation_legacy';
import {
    // @ts-ignore
    useWebFonts,
    useTheme,
    UILabel,
    ThemeContext,
    DarkTheme,
    LightTheme,
    ColorVariants,
    PortalManager,
    UIBackgroundView,
    UIStatusBarManager,
} from '@tonlabs/uikit.hydrogen';
import {
    UISearchBarButton,
    UIAndroidNavigationBar,
    UILargeTitleHeader,
    ScrollView,
} from '@tonlabs/uikit.navigation';

import { Buttons } from './screens/Buttons';
import { Checkbox } from './screens/Checkbox';
import { Inputs } from './screens/Inputs';
import { Design } from './screens/Design';
import { Chart } from './screens/Chart';
import { Images } from './screens/Images';
import { Layouts } from './screens/Layouts';
import { Menus, actionSheet } from './screens/Menus';
import { Notifications } from './screens/Notifications';
import { Popups } from './screens/Popups';
import { Products } from './screens/Products';
import { Profile } from './screens/Profile';
import { TextScreen } from './screens/Text';
import { Browser } from './screens/Browser';
import { Chat } from './screens/Chat';
import { Navigation } from './screens/Navigation';
import { SectionsService } from './Search';
import { KeyboardScreen } from './screens/Keyboard';
import { LargeHeaderScreen } from './screens/LargeHeader';

// eslint-disable-next-line react-hooks/rules-of-hooks
useWebFonts();

const SurfSplit = createSurfSplitNavigator();

const ThemeSwitcher = React.createContext({
    isDarkTheme: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {},
});

const Main = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const themeSwitcher = React.useContext(ThemeSwitcher);
    const [isSearchVisible, setIsSearchVisible] = React.useState(false);
    return (
        <UIBackgroundView style={{ flex: 1 }}>
            <PortalManager id="search">
                <UILargeTitleHeader
                    title="Main"
                    headerRight={() => (
                        <UIToggle
                            testID="theme_switcher"
                            active={themeSwitcher.isDarkTheme}
                            onPress={() => themeSwitcher.toggleTheme()}
                        />
                    )}
                >
                    <View style={{ paddingHorizontal: 10 }}>
                        <UISearchBarButton
                            forId="search"
                            visible={isSearchVisible}
                            onOpen={() => {
                                setIsSearchVisible(true);
                            }}
                            onClose={() => {
                                setIsSearchVisible(false);
                            }}
                        >
                            {(searchText: string) => {
                                return (
                                    <FlatList
                                        style={{ flex: 1 }}
                                        data={SectionsService.shared.find(
                                            searchText,
                                        )}
                                        keyExtractor={({ item: { title } }) =>
                                            title
                                        }
                                        renderItem={({
                                            item: {
                                                item: { title, routeKey },
                                            },
                                        }) => {
                                            return (
                                                <TouchableOpacity
                                                    key={title}
                                                    style={{
                                                        width: '100%',
                                                        padding: 10,
                                                    }}
                                                    onPress={() => {
                                                        navigation.navigate({
                                                            key: routeKey,
                                                        });
                                                        setIsSearchVisible(
                                                            false,
                                                        );
                                                    }}
                                                >
                                                    <UILabel>{title}</UILabel>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />
                                );
                            }}
                        </UISearchBarButton>
                    </View>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    >
                        {/* <UIButton
                            onPress={() => navigation.navigate('large-header')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Large header"
                        /> */}
                        <UIButton
                            onPress={() => navigation.navigate('keyboard')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Keyboard"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('buttons')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Buttons"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('checkbox')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Checkbox"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('inputs')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Inputs"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('design')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Design"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('chart')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Chart"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('images')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Images"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('layouts')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Layouts"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('menus')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Menus"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('notifications')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Notifications"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('popups')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Popups"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('products')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Products"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('profile')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Profile"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('text')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Text"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('chat')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Chat"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('browser')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Browser"
                        />
                        <UIButton
                            onPress={() => navigation.navigate('navigation')}
                            buttonStyle={UIButton.ButtonStyle.Link}
                            title="Navigation"
                        />
                    </ScrollView>
                </UILargeTitleHeader>
            </PortalManager>
        </UIBackgroundView>
    );
};

const App = () => {
    const navRef = React.useRef(null);
    useReduxDevToolsExtension(navRef);

    const theme = useTheme();

    const main = (
        <UIStatusBarManager>
            <SafeAreaProvider>
                <PortalManager>
                    <NavigationContainer
                        ref={navRef}
                        linking={{ prefixes: ['/'] }}
                    >
                        <SurfSplit.Navigator
                            initialRouteName="buttons"
                            screenOptions={{
                                splitStyles: {
                                    body: [
                                        styles.body,
                                        {
                                            backgroundColor:
                                                theme[
                                                    ColorVariants
                                                        .BackgroundTertiary
                                                ],
                                        },
                                    ],
                                    main: [styles.main],
                                    detail: [
                                        styles.detail,
                                        {
                                            backgroundColor:
                                                theme[
                                                    ColorVariants
                                                        .BackgroundPrimary
                                                ],
                                        },
                                    ],
                                },
                                ...Platform.select({
                                    android: {
                                        stackAnimation: 'slide_from_right',
                                    },
                                    default: null,
                                }),
                            }}
                            mainWidth={900}
                        >
                            <SurfSplit.Screen name="main" component={Main} />
                            <SurfSplit.Screen
                                name="buttons"
                                component={Buttons}
                            />
                            <SurfSplit.Screen
                                name="checkbox"
                                component={Checkbox}
                            />
                            <SurfSplit.Screen
                                name="inputs"
                                component={Inputs}
                            />
                            <SurfSplit.Screen
                                name="design"
                                component={Design}
                            />
                            <SurfSplit.Screen
                                name="chart"
                                component={Chart}
                            />
                            <SurfSplit.Screen
                                name="images"
                                component={Images}
                            />
                            <SurfSplit.Screen
                                name="layouts"
                                component={Layouts}
                            />
                            <SurfSplit.Screen name="menus" component={Menus} />
                            <SurfSplit.Screen
                                name="notifications"
                                component={Notifications}
                            />
                            <SurfSplit.Screen
                                name="popups"
                                component={Popups}
                            />
                            <SurfSplit.Screen
                                name="products"
                                component={Products}
                            />
                            <SurfSplit.Screen
                                name="profile"
                                component={Profile}
                            />
                            <SurfSplit.Screen
                                name="text"
                                component={TextScreen}
                            />
                            <SurfSplit.Screen name="chat" component={Chat} />
                            <SurfSplit.Screen
                                name="browser"
                                component={Browser}
                            />
                            <SurfSplit.Screen
                                name="navigation"
                                component={Navigation}
                            />
                            <SurfSplit.Screen
                                name="keyboard"
                                component={KeyboardScreen}
                            />
                            <SurfSplit.Screen
                                name="large-header"
                                component={LargeHeaderScreen}
                            />
                        </SurfSplit.Navigator>
                    </NavigationContainer>
                    <UILayoutManager />
                    <UIActionSheet ref={actionSheet} masterSheet={false} />
                    <UIActionSheet />
                    <UICountryPicker navigation={navRef.current} isShared />
                    <View
                        style={StyleSheet.absoluteFill}
                        pointerEvents="box-none"
                    >
                        <UINotice />
                    </View>
                    <UIAlert />
                    <UIAlertView />
                    <UIDropdownAlert />
                    <UIAndroidNavigationBar />
                </PortalManager>
            </SafeAreaProvider>
        </UIStatusBarManager>
    );

    return <UIPopoverBackground>{main}</UIPopoverBackground>;
};

const AppWrapper = () => {
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);

    if (isHidden) {
        return null;
    }

    return (
        <ThemeContext.Provider value={isDarkTheme ? DarkTheme : LightTheme}>
            <ThemeSwitcher.Provider
                value={{
                    isDarkTheme,
                    toggleTheme: () => {
                        if (isDarkTheme) {
                            UIColor.switchCurrentTheme('light');
                        } else {
                            UIColor.switchCurrentTheme('dark');
                        }
                        setIsDarkTheme(!isDarkTheme);
                        setIsHidden(true);
                        setImmediate(() => setIsHidden(false));
                    },
                }}
            >
                <App />
            </ThemeSwitcher.Provider>
        </ThemeContext.Provider>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    main: {
        minWidth: 300,
        marginRight: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    detail: {
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    grid: {},
});

export default AppWrapper;
