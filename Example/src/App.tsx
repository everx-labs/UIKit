/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { UILayoutManager } from '@tonlabs/uikit.components';
import { UICountryPicker, UIPopoverBackground } from '@tonlabs/uikit.navigation_legacy';
import {
    ColorVariants,
    DarkTheme,
    LightTheme,
    PortalManager,
    ThemeContext,
    UIBackgroundView,
    UILabel,
    UILinkButton,
    UILinkButtonType,
    UIStatusBarManager,
    useTheme,
    // @ts-ignore
    useWebFonts,
    UISwitcher,
    UISwitcherVariant,
} from '@tonlabs/uikit.hydrogen';
import {
    createSplitNavigator,
    ScrollView,
    UIAndroidNavigationBar,
    UILargeTitleHeader,
    UISearchBarButton,
} from '@tonlabs/uikit.navigation';

import { ButtonsScreen } from './screens/Buttons';
import { Checkbox } from './screens/Checkbox';
import { Inputs } from './screens/Inputs';
import { Design } from './screens/Design';
import { ListsScreen } from './screens/Lists';
import { Chart } from './screens/Chart';
import { Images } from './screens/Images';
import { Layouts } from './screens/Layouts';
import { Menus } from './screens/Menus';
import { NotificationsScreen } from './screens/Notifications';
import { Popups } from './screens/Popups';
import { Products } from './screens/Products';
import { Profile } from './screens/Profile';
import { TextScreen } from './screens/Text';
import { Browser } from './screens/Browser';
import { Chat } from './screens/Chat';
import { Carousel } from './screens/Carousel';
import { Navigation } from './screens/Navigation';
import { SectionsService } from './Search';
// import { KeyboardScreen } from './screens/Keyboard';
import { KeyboardScreen2 } from './screens/Keyboard2';
import { LargeHeaderScreen } from './screens/LargeHeader';
import { QRCodeScreen } from './screens/QRCode';
import { FinancesScreen } from './screens/Finances';
import { SkeletonsScreen } from './screens/Skeletons';

// eslint-disable-next-line react-hooks/rules-of-hooks
useWebFonts();

const Split = createSplitNavigator();

const ThemeSwitcher = React.createContext({
    isDarkTheme: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {},
});

const Main = ({ navigation }: { navigation: any }) => {
    const themeSwitcher = React.useContext(ThemeSwitcher);
    const [isSearchVisible, setIsSearchVisible] = React.useState(false);
    const { top, bottom } = useSafeAreaInsets();
    return (
        <UIBackgroundView style={{ flex: 1, paddingTop: top }}>
            <PortalManager id="search">
                <UILargeTitleHeader
                    title="Main"
                    headerRight={() => (
                        <View testID="theme_switcher">
                            <UISwitcher
                                variant={UISwitcherVariant.Toggle}
                                active={themeSwitcher.isDarkTheme}
                                onPress={() => themeSwitcher.toggleTheme()}
                            />
                        </View>
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
                                        data={SectionsService.shared.find(searchText)}
                                        keyExtractor={({ item: { title } }) => title}
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
                                                        setIsSearchVisible(false);
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
                    <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
                        <UILinkButton
                            title="Browser"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('browser')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Buttons"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('buttons')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Carousel"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('carousel')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Chart"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('chart')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Chat"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('chat')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Checkbox"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('checkbox')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Design"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('design')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Lists"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('lists')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Images"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('images')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Inputs"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('inputs')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Keyboard"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('keyboard')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Large header"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('large-header')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Layouts"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('layouts')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Menus"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('menus')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Navigation"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('navigation')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Notifications"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('notifications')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Popups"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('popups')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Products"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('products')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Profile"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('profile')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="QR code"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('qr-code')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Text"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('text')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Finances"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('finances')}
                            layout={styles.button}
                        />
                        <UILinkButton
                            title="Skeletons"
                            type={UILinkButtonType.Menu}
                            onPress={() => navigation.navigate('skeletons')}
                            layout={styles.button}
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
                    <NavigationContainer ref={navRef} linking={{ prefixes: ['/'] }}>
                        <Split.Navigator
                            initialRouteName="browser"
                            screenOptions={{
                                splitStyles: {
                                    body: [
                                        styles.body,
                                        {
                                            backgroundColor:
                                                theme[ColorVariants.BackgroundTertiary],
                                        },
                                    ],
                                    main: [styles.main],
                                    detail: [
                                        styles.detail,
                                        {
                                            backgroundColor: theme[ColorVariants.BackgroundPrimary],
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
                            <Split.Screen name="browser" component={Browser} />
                            <Split.Screen name="buttons" component={ButtonsScreen} />
                            <Split.Screen name="carousel" component={Carousel} />
                            <Split.Screen name="chart" component={Chart} />
                            <Split.Screen name="chat" component={Chat} />
                            <Split.Screen name="checkbox" component={Checkbox} />
                            <Split.Screen name="design" component={Design} />
                            <Split.Screen name="lists" component={ListsScreen} />
                            <Split.Screen name="images" component={Images} />
                            <Split.Screen name="inputs" component={Inputs} />
                            <Split.Screen name="keyboard" component={KeyboardScreen2} />
                            <Split.Screen name="large-header" component={LargeHeaderScreen} />
                            <Split.Screen name="layouts" component={Layouts} />
                            <Split.Screen name="main" component={Main} />
                            <Split.Screen name="menus" component={Menus} />
                            <Split.Screen name="navigation" component={Navigation} />
                            <Split.Screen name="notifications" component={NotificationsScreen} />
                            <Split.Screen name="popups" component={Popups} />
                            <Split.Screen name="products" component={Products} />
                            <Split.Screen name="profile" component={Profile} />
                            <Split.Screen name="qr-code" component={QRCodeScreen} />
                            <Split.Screen name="text" component={TextScreen} />
                            <Split.Screen name="finances" component={FinancesScreen} />
                            <Split.Screen name="skeletons" component={SkeletonsScreen} />
                        </Split.Navigator>
                    </NavigationContainer>
                    <UILayoutManager />
                    <UICountryPicker navigation={navRef.current} isShared />
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
    button: {
        marginLeft: 16,
        marginRight: 16,
    },
    detail: {
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    grid: {},
    main: {
        minWidth: 300,
        marginRight: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default AppWrapper;
