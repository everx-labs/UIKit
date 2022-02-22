/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { FlatList, TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { I18nManager, NativeModules, Platform, StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';

import { UIPopoverBackground } from '@tonlabs/uikit.navigation_legacy';
import { PortalManager } from '@tonlabs/uikit.layout';
import {
    UILinkButton,
    UILinkButtonType,
    UISwitcher,
    UISwitcherVariant,
} from '@tonlabs/uikit.controls';
import {
    useWebFonts,
    UIBackgroundView,
    UILabel,
    DarkTheme,
    LightTheme,
    ColorVariants,
    ThemeContext,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UISearchBarButton } from '@tonlabs/uicast.bars';
import { ScrollView } from '@tonlabs/uikit.scrolls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { createSplitNavigator, useSplitTabBarHeight } from '@tonlabs/uicast.split-navigator';
import { UIModalPortalManager } from '@tonlabs/uikit.popups';

import { ButtonsScreen } from './screens/Buttons';
import { Checkbox } from './screens/Checkbox';
import { Inputs } from './screens/Inputs';
import { Design } from './screens/Design';
import { ListsScreen } from './screens/Lists';
import { Chart } from './screens/Chart';
import { CardsScreen } from './screens/Cards';
import { Images } from './screens/Images';
import { Layouts } from './screens/Layouts';
import { Menus } from './screens/Menus';
import { NotificationsScreen } from './screens/Notifications';
import { Products } from './screens/Products';
import { TextScreen } from './screens/Text';
import { VideosScreen } from './screens/Videos';
import { Browser } from './screens/Browser';
import { Chat } from './screens/Chat';
import { CarouselScreen } from './screens/Carousel';
import { CellsScreen } from './screens/Cells';
import { Navigation } from './screens/Navigation';
import { SectionsService } from './Search';
import { KeyboardScreen } from './screens/Keyboard';
import { LargeHeaderScreen } from './screens/LargeHeader';
import { QRCodeScreen } from './screens/QRCode';
import { RowsScreen } from './screens/Rows';
import { FinancesScreen } from './screens/Finances';
import { SkeletonsScreen } from './screens/Skeletons';

import { StoreProvider, updateStore } from './useStore';
import { AutomaticInsetsTest } from './screens/AutomaticInsetsTest';

// Optimize React rendering
enableFreeze();

// eslint-disable-next-line react-hooks/rules-of-hooks
useWebFonts();

const Split = createSplitNavigator();

const ThemeSwitcher = React.createContext({
    isDarkTheme: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleTheme: () => {},
});

const Main = ({ navigation }: { navigation: any }) => {
    const [isSearchVisible, setIsSearchVisible] = React.useState(false);
    const { bottom } = useSafeAreaInsets();
    const tabBarBottomInset = useSplitTabBarHeight();
    return (
        <UIBackgroundView style={{ flex: 1 }}>
            <PortalManager id="search">
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
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: Math.max(bottom, tabBarBottomInset),
                    }}
                >
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
                        title="Cells"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('cells')}
                        layout={styles.button}
                    />
                    <UILinkButton
                        title="Chart"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('chart')}
                        layout={styles.button}
                    />
                    <UILinkButton
                        title="Cards"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('cards')}
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
                    {/* <UILinkButton
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
                        /> */}
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
                        title="Products"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('products')}
                        layout={styles.button}
                    />
                    <UILinkButton
                        title="QR code"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('qr-code')}
                        layout={styles.button}
                    />
                    <UILinkButton
                        title="Rows"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('rows')}
                        layout={styles.button}
                    />
                    <UILinkButton
                        title="Text"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('text')}
                        layout={styles.button}
                    />
                    <UILinkButton
                        title="Videos"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('videos')}
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
                    {/* <UILinkButton
                        title="Automatic insets test"
                        type={UILinkButtonType.Menu}
                        onPress={() => navigation.navigate('automatic-insets-test')}
                        layout={styles.button}
                    /> */}
                </ScrollView>
            </PortalManager>
        </UIBackgroundView>
    );
};

const App = () => {
    const navRef = React.useRef(null);
    useReduxDevToolsExtension(navRef);

    const theme = useTheme();
    const themeSwitcher = React.useContext(ThemeSwitcher);

    React.useEffect(() => {
        StatusBar.setTranslucent(true);
    }, []);

    return (
        <StoreProvider>
            <UIModalPortalManager maxMobileWidth={900}>
                <NavigationContainer ref={navRef} linking={{ prefixes: ['/'] }}>
                    <Split.Navigator
                        initialRouteName="browser"
                        styles={{
                            body: [
                                styles.body,
                                {
                                    backgroundColor: theme[ColorVariants.BackgroundTertiary],
                                },
                            ],
                            main: [styles.main],
                            detail: [
                                styles.detail,
                                {
                                    backgroundColor: theme[ColorVariants.BackgroundPrimary],
                                },
                            ],
                        }}
                        mainWidth={900}
                    >
                        <Split.Screen
                            name="browser"
                            component={Browser}
                            options={{
                                title: 'Browser',
                                headerRightItems: [
                                    {
                                        label: 'Add',
                                        onPress: () => {
                                            updateStore(({ menuVisible }) => ({
                                                menuVisible: !menuVisible,
                                            }));
                                        },
                                    },
                                ],
                            }}
                        />
                        <Split.Screen
                            name="buttons"
                            component={ButtonsScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Buttons',
                            }}
                        />
                        <Split.Screen
                            name="carousel"
                            component={CarouselScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Carousel',
                            }}
                        />
                        <Split.Screen
                            name="cells"
                            component={CellsScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Cells',
                            }}
                        />
                        <Split.Screen
                            name="chart"
                            component={Chart}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Chart',
                            }}
                        />
                        <Split.Screen
                            name="cards"
                            component={CardsScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Cards',
                            }}
                        />
                        <Split.Screen
                            name="chat"
                            component={Chat}
                            options={{
                                title: 'Chat',
                                backgroundColor: ColorVariants.BackgroundPrimary,
                            }}
                        />
                        <Split.Screen
                            name="checkbox"
                            component={Checkbox}
                            options={{
                                title: 'Checkbox',
                            }}
                        />
                        <Split.Screen
                            name="design"
                            component={Design}
                            options={{
                                title: 'Design',
                            }}
                        />
                        <Split.Screen
                            name="lists"
                            component={ListsScreen}
                            options={{
                                headerVisible: false,
                            }}
                        />
                        <Split.Screen
                            name="images"
                            component={Images}
                            options={{
                                title: 'Images',
                            }}
                        />
                        <Split.Screen
                            name="inputs"
                            component={Inputs}
                            options={{
                                title: 'Inputs',
                            }}
                        />
                        <Split.Screen
                            name="keyboard"
                            component={KeyboardScreen}
                            options={{
                                title: 'Keyboard',
                            }}
                        />
                        <Split.Screen
                            name="large-header"
                            component={LargeHeaderScreen}
                            options={{ headerVisible: false }}
                        />
                        <Split.Screen
                            name="layouts"
                            component={Layouts}
                            options={{
                                title: 'Layouts',
                            }}
                        />
                        <Split.Screen
                            name="main"
                            component={Main}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Main',
                                headerRightItems: [
                                    {
                                        iconElement: (
                                            <View testID="theme_switcher">
                                                <UISwitcher
                                                    variant={UISwitcherVariant.Toggle}
                                                    active={themeSwitcher.isDarkTheme}
                                                    onPress={() => themeSwitcher.toggleTheme()}
                                                />
                                            </View>
                                        ),
                                    },
                                ],
                            }}
                        />
                        <Split.Screen
                            name="menus"
                            component={Menus}
                            options={{
                                title: 'Menus',
                            }}
                        />
                        <Split.Screen
                            name="navigation"
                            component={Navigation}
                            options={{
                                title: 'Navigation',
                            }}
                        />
                        <Split.Screen
                            name="notifications"
                            component={NotificationsScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Notifications',
                            }}
                        />
                        <Split.Screen
                            name="products"
                            component={Products}
                            options={{
                                title: 'Products',
                            }}
                        />
                        <Split.Screen
                            name="qr-code"
                            component={QRCodeScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'QR code',
                            }}
                        />
                        <Split.Screen
                            name="rows"
                            component={RowsScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Rows',
                                headerRightItems: [
                                    {
                                        label: 'Loading',
                                        onPress: () =>
                                            updateStore(({ rowsLoading }) => ({
                                                rowsLoading: !rowsLoading,
                                            })),
                                    },
                                ],
                            }}
                        />
                        <Split.Screen name="text" component={TextScreen} />
                        <Split.Screen
                            name="finances"
                            component={FinancesScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Finances',
                                ...(Platform.OS === 'ios'
                                    ? {
                                          headerRightItems: [
                                              {
                                                  label: `${
                                                      I18nManager.isRTL ? 'Disable' : 'Enable'
                                                  } RTL`,
                                                  onPress: () => {
                                                      I18nManager.forceRTL(!I18nManager.isRTL);
                                                      NativeModules.DevSettings.reload();
                                                  },
                                              },
                                          ],
                                      }
                                    : {}),
                                tabBarActiveIcon: UIAssets.icons.ui.buttonStickerEnabled,
                                tabBarDisabledIcon: UIAssets.icons.ui.buttonStickerDisabled,
                            }}
                        />
                        <Split.Screen
                            name="skeletons"
                            component={SkeletonsScreen}
                            options={{
                                useHeaderLargeTitle: true,
                                title: 'Skeletons',
                                tabBarActiveIcon: UIAssets.icons.ui.checkboxSquareActive,
                                tabBarDisabledIcon: UIAssets.icons.ui.checkboxSquareInactive,
                            }}
                        />
                        <Split.Screen
                            name="videos"
                            component={VideosScreen}
                            options={{
                                title: 'Videos',
                            }}
                        />
                        <Split.Screen
                            name="automatic-insets-test"
                            component={AutomaticInsetsTest}
                            options={{
                                // headerVisible: false,
                                useHeaderLargeTitle: true,
                                title: 'Carousel',
                            }}
                        />
                    </Split.Navigator>
                </NavigationContainer>
            </UIModalPortalManager>
        </StoreProvider>
    );
};

const AppWrapper = () => {
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);

    if (isHidden) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <UIPopoverBackground>
                        <SafeAreaProvider>
                            <App />
                        </SafeAreaProvider>
                    </UIPopoverBackground>
                </ThemeSwitcher.Provider>
            </ThemeContext.Provider>
        </GestureHandlerRootView>
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
