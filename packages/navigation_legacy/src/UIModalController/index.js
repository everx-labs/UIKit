// @flow
/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    NativeModules,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import {
    PanGestureHandler,
    TapGestureHandler,
    State as RNGHState,
} from 'react-native-gesture-handler';

import { UIConstant, UIDevice, UIFunction, UIStyle } from '@tonlabs/uikit.core';
import type { SafeAreaInsets } from '@tonlabs/uikit.core';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIBackgroundView, UIBackgroundViewColors } from '@tonlabs/uikit.themes';
import { useHasScroll, ScrollableContext } from '@tonlabs/uikit.scrolls';
import { NestedInDismissibleModalContext } from '@tonlabs/uicast.modal-navigator';

import type {
    AnimationParameters,
    ContentInset,
    ControllerProps,
    ControllerState,
} from '../UIController';

import UIController from '../UIController';

const { fullScreenDialogWidth, fullScreenDialogHeight } = UIConstant;
const HARDWARE_BACK_PRESS_EVENT = 'hardwareBackPress';

type OnLayoutEventArgs = {
    nativeEvent: {
        layout: {
            x: number,
            y: number,
            width: number,
            height: number,
        },
    },
};

type RNGHEvent<T> = { nativeEvent: T };

export type ModalControllerProps = ControllerProps & {
    onWillAppear?: () => void,
    onDidAppear?: () => void,
    onWillHide?: () => void,
    onDidHide?: () => void,
};

export type ModalControllerState = ControllerState & {
    width?: ?number,
    height?: ?number,
    controllerVisible?: boolean,
    header?: React$Node,
};

export type ModalControllerShowArgs =
    | ?boolean
    | {
          open?: boolean,
          onCancel?: () => void,
          onSubmit?: () => void,
          onSelect?: any => void,
      };

const styles = StyleSheet.create({
    containerCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerToTheEnd: {
        justifyContent: 'flex-end',
    },
    dialog: {
        borderRadius: UIConstant.mediumBorderRadius(),
    },
    dialogOverflow: {
        overflow: 'hidden',
    },
    dialogBorders: {
        borderTopLeftRadius: Platform.select({
            ios: UIConstant.mediumBorderRadius(),
            android: 0,
            web: UIConstant.mediumBorderRadius(),
        }),
        borderTopRightRadius: Platform.select({
            ios: UIConstant.mediumBorderRadius(),
            android: 0,
            web: UIConstant.mediumBorderRadius(),
        }),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    smallDismissStripe: {
        width: UIConstant.iconSize(),
        height: UIConstant.tinyBorderRadius(),
        borderRadius: UIConstant.tinyBorderRadius() / 2,
    },
    defaultDismissStripe: {
        width: UIConstant.iconSize() * 2,
        height: UIConstant.tinyBorderRadius(),
        borderRadius: UIConstant.tinyBorderRadius() / 2,
    },
});

const AnimatedViewWithColor = Animated.createAnimatedComponent(UIBackgroundView);

function ModalControllerContainer({
    testID,
    containerStyle,
    dialogStyle,
    backgroundColor,
    dYDependentOpacity,
    dismissible,
    shouldSwipeToDismiss,
    adjustKeyboardInsetDynamically,
    onTapHandlerStateChange,
    onPan,
    onPanHandlerStateChange,
    onLayout,
    marginBottom,
    children,
}: {
    testID: ?string,
    containerStyle: ViewStyleProp,
    dialogStyle: ViewStyleProp,
    backgroundColor: any,
    dYDependentOpacity: number,
    dismissible: boolean,
    shouldSwipeToDismiss: boolean,
    adjustKeyboardInsetDynamically: boolean,
    onTapHandlerStateChange: any,
    onPanHandlerStateChange: any,
    onPan: any,
    onLayout: any,
    marginBottom: Animated.Value,
    children: any,
}) {
    const testIDProp = React.useMemo(
        () => (testID ? { testID: `${testID}_dialog` } : null),
        [testID],
    );
    const panHandlerRef = React.useRef<PanGestureHandler>(null);
    const scrollPanGestureHandlerRef = React.useRef<PanGestureHandler>(null);

    const { hasScroll, setHasScroll } = useHasScroll();

    const scrollableContextValue = React.useMemo(
        () => ({
            ref: null,
            panGestureHandlerRef: scrollPanGestureHandlerRef,
            scrollHandler: null,
            gestureHandler: null,
            onWheel: null,
            hasScroll,
            setHasScroll,
            registerScrollable: null,
            unregisterScrollable: null,
        }),
        [scrollPanGestureHandlerRef, hasScroll, setHasScroll],
    );

    return (
        <NestedInDismissibleModalContext.Provider value={dismissible}>
            <Animated.View style={containerStyle}>
                <TapGestureHandler
                    enabled={dismissible}
                    {...(dismissible && shouldSwipeToDismiss
                        ? {
                              waitFor: panHandlerRef,
                          }
                        : null)}
                    onHandlerStateChange={onTapHandlerStateChange}
                >
                    <PanGestureHandler
                        enabled={dismissible && shouldSwipeToDismiss}
                        ref={panHandlerRef}
                        onGestureEvent={onPan}
                        onHandlerStateChange={onPanHandlerStateChange}
                    >
                        <AnimatedViewWithColor
                            color={backgroundColor}
                            style={[
                                // DO NOT USE UIStyle.absoluteFillObject here, as it has { overflow: 'hidden' }
                                // And this brings a layout bug to Safari
                                UIStyle.Common.absoluteFillContainer(),
                                { opacity: dYDependentOpacity },
                            ]}
                            onLayout={onLayout}
                        />
                    </PanGestureHandler>
                </TapGestureHandler>
                <PanGestureHandler
                    enabled={dismissible && shouldSwipeToDismiss}
                    onGestureEvent={onPan}
                    onHandlerStateChange={onPanHandlerStateChange}
                    {...(Platform.OS === 'android' && hasScroll
                        ? { waitFor: scrollPanGestureHandlerRef }
                        : null)}
                >
                    <AnimatedViewWithColor
                        {...testIDProp}
                        color={UIBackgroundViewColors.BackgroundPrimary}
                        style={dialogStyle}
                    >
                        <Animated.View
                            style={[
                                UIStyle.common.flex(),
                                adjustKeyboardInsetDynamically
                                    ? { paddingBottom: marginBottom }
                                    : null,
                            ]}
                        >
                            <View style={UIStyle.common.flex()}>
                                <ScrollableContext.Provider value={scrollableContextValue}>
                                    {children}
                                </ScrollableContext.Provider>
                            </View>
                        </Animated.View>
                    </AnimatedViewWithColor>
                </PanGestureHandler>
            </Animated.View>
        </NestedInDismissibleModalContext.Provider>
    );
}

export default class UIModalController<Props, State> extends UIController<
    ModalControllerProps & Props,
    ModalControllerState & State,
> {
    fullscreen: boolean;
    dismissible: boolean;
    fromBottom: boolean;
    smallStripe: boolean;
    half: boolean;
    adjustBottomSafeAreaInsetDynamically: boolean;
    adjustKeyboardInsetDynamically: boolean;
    onCancel: ?() => void;
    onSelect: ?(any) => void;
    onSubmit: ?() => void;
    marginBottom: Animated.Value;
    dy: Animated.Value;
    animation: 'slide' | 'fade';
    testID: ?string;
    minWidth: number = 0;
    minHeight: number = 0;
    maxWidth: number = Number.MAX_SAFE_INTEGER;
    maxHeight: number = Number.MAX_SAFE_INTEGER;
    modalOnWeb: boolean;
    zIndex: ?number;
    closeAnimation: ?{ stop: () => void, start: (...any) => any };

    static animations = {
        fade: () => 'fade',
        slide: () => 'slide',
    };

    constructor(props: ModalControllerProps & Props) {
        super(props);
        this.testID = '[UIModalController]';
        this.fullscreen = false;
        this.dismissible = true;
        this.adjustBottomSafeAreaInsetDynamically = true;
        this.adjustKeyboardInsetDynamically = true;
        this.onCancel = null;
        this.onSubmit = null;
        this.onSelect = null;
        this.fromBottom = false;
        this.smallStripe = false;
        this.half = false;
        this.marginBottom = new Animated.Value(0);
        this.dy = new Animated.Value(0);
        this.animation = UIModalController.animations.slide();
        this.modalOnWeb = false;
    }

    async loadSafeAreaInsets(): Promise<SafeAreaInsets> {
        const safeArea = await super.loadSafeAreaInsets();
        this.marginBottom.setValue(safeArea.bottom);
        return safeArea;
    }

    // Events
    onWillAppear() {
        const { onWillAppear } = this.props;
        if (onWillAppear) {
            onWillAppear();
        }

        BackHandler.addEventListener(HARDWARE_BACK_PRESS_EVENT, this.hardwareBackEventHandler);
    }

    onDidAppear() {
        this.initKeyboardListeners();

        const { onDidAppear } = this.props;
        if (onDidAppear) {
            onDidAppear();
        }
    }

    onWillHide() {
        this.deinitKeyboardListeners();
        BackHandler.removeEventListener(HARDWARE_BACK_PRESS_EVENT, this.hardwareBackEventHandler);

        const { onWillHide } = this.props;
        if (onWillHide) {
            onWillHide();
        }
    }

    onDidHide() {
        this.setControllerVisible(false);

        const { onDidHide } = this.props;
        if (onDidHide) {
            onDidHide();
        }
    }

    onDidAppearHandler = () => {
        this.onDidAppear();
    };

    onDidHideHandler = () => {
        this.onDidHide();
    };

    onCancelPress = () => {
        this.hide();
        if (this.onCancel) {
            this.onCancel();
        }
    };

    hardwareBackEventHandler = (): boolean => {
        if (this.dismissible) {
            // If the modal screen is dismissible, the back button should emulate a cancel press.
            this.onCancelPress();
        } else {
            // Otherwise user cannot return to the previous screen by pressing the back button,
            // hence it should fold the app on Android when the modal screen cannot be dismissed.

            // For that purpose we should have ExitAndroid native modules installed in the app.
            if (NativeModules.ExitAndroid) {
                NativeModules.ExitAndroid.sendToBackApp();
            } else {
                // If there is no any, just exit the app.
                BackHandler.exitApp();
            }
        }
        // Return `true` as the back button event was handled.
        return true;
    };

    onLayout = (e: OnLayoutEventArgs) => {
        const { layout } = e.nativeEvent;
        const { width, height } = layout;
        this.setSize(width, height);
    };

    // Getters
    getNavigationBarHeight() {
        return this.shouldSwipeToDismiss() ? 30 : 48;
    }

    isControllerVisible(): boolean {
        return this.state.controllerVisible || false;
    }

    getDialogStyle() {
        let { width, height } = this.state;
        if (!width || !height) {
            ({ width, height } = Dimensions.get('window'));
        }

        const outerNavBarHeight = this.dismissible ? UIDevice.navigationBarHeight() : 0; // navigation bar height above the modal controller

        let containerPaddingTop = outerNavBarHeight;

        const dialogStyle = [
            styles.dialog, // general style for dialog with all rounded corners and background color
            styles.dialogOverflow,
            this.animation === UIModalController.animations.slide()
                ? { transform: [{ translateY: this.dy }] }
                : { opacity: this.getDYDependentOpacity() },
        ];

        const containerStyle = [
            UIStyle.Common.absoluteFillContainer(),
            this.zIndex ? { zIndex: this.zIndex } : null,
        ];

        if (UIDevice.isDesktop() || UIDevice.isTablet()) {
            // Center the container
            containerStyle.push(styles.containerCentered);

            if (!this.fullscreen) {
                // On the desktop and the tablet we need to show a modal with fixed width and height
                width = Math.min(width, fullScreenDialogWidth);
                height = Math.min(height, fullScreenDialogHeight);
                // -------
                // Basically we are trying to make a modal with the standard size
                // (i.e fullScreenDialogWidth), but sometimes controller could specify minimum size
                width = Math.max(width, this.minWidth);
                height = Math.max(height, this.minHeight);
                // or maximum size
                width = Math.min(width, this.maxWidth);
                height = Math.min(height, this.maxHeight);
                // -------
                if (this.fromBottom) {
                    const screenHeight = Dimensions.get('window').height;
                    height = Math.min(screenHeight, screenHeight - (screenHeight - height) / 2);
                    // Change borders when opening from the bottom
                    dialogStyle.push(styles.dialogBorders);
                    // Change container when opening from the bottom
                    containerStyle.push(styles.containerToTheEnd);
                }
            } else {
                // Count on status bar when fullscreen
                containerPaddingTop += UIDevice.statusBarHeight();
                height -= UIDevice.statusBarHeight();
                // Add padding for container
                containerStyle.push({ paddingTop: containerPaddingTop });
            }

            // Add calculated width & height
            dialogStyle.push({ width, height });
            // Calculate content height
            const contentHeight = height - containerPaddingTop;

            return {
                width,
                height,
                dialogStyle,
                contentHeight,
                containerStyle,
            };
        }

        // Mobile (always fullscreen)
        containerPaddingTop += UIDevice.statusBarHeight(); // count on status bar (as fullscreen)
        const bottomInset = this.fromBottom ? 0 : this.getSafeAreaInsets().bottom;
        const innerNavBarHeight = this.getNavigationBarHeight();
        const contentHeight = height - containerPaddingTop - innerNavBarHeight - bottomInset;

        // Change borders when opening from the mobile
        dialogStyle.push(styles.dialogBorders);
        // "Flex" the dialog & container when opening from the mobile (as fullscreen)
        dialogStyle.push(UIStyle.common.flex());
        containerStyle.push(UIStyle.common.flex());
        // Add padding for container
        containerStyle.push({ paddingTop: containerPaddingTop });

        // Looks like it's something that used before
        // Grep across the project didn't get any use of it
        // if (this.half) {
        //     height /= 2;
        //     containerStyle.push({ justifyContent: 'flex-end' });
        // } else {
        //     // height -= statusBarHeight + navBarHeight;
        // }

        return {
            width,
            height,
            contentHeight,
            containerStyle,
            dialogStyle,
        };
    }

    getCancelImage(): ?ImageSource {
        return UIAssets.icons.ui.buttonClose;
    }

    // Override if needed!
    shouldSwipeToDismiss() {
        return Platform.OS !== 'web'; // this.dismissible;
    }

    getMaxHeight() {
        const { height } = Dimensions.get('window');
        return height - UIDevice.statusBarHeight();
    }

    getDYDependentOpacity(): number {
        const maxHeight = this.getMaxHeight();
        return (this.dy: any).interpolate({
            inputRange: [0, maxHeight],
            outputRange: [1, 0],
        });
    }

    // Setters
    setContentInset(contentInset: ContentInset, animation: ?AnimationParameters) {
        super.setContentInset(contentInset);
        let bottomInset = contentInset.bottom;
        // If bottom inset is greater than zero (keyboard is visible),
        // OR dynamic adjustment is enabled,
        // then append the bottom safe area value
        if (bottomInset > 0 || this.adjustBottomSafeAreaInsetDynamically) {
            bottomInset += this.getSafeAreaInsets().bottom;
        }

        if (animation) {
            // TODO: think how to use `useNativeDriver` here
            Animated.timing(this.marginBottom, {
                toValue: bottomInset,
                duration: animation.duration,
                easing: UIController.getEasingFunction(animation.easing),
                useNativeDriver: false,
            }).start();
        } else {
            // TODO: think how to use `useNativeDriver` here
            Animated.spring(this.marginBottom, {
                toValue: bottomInset,
                duration: UIConstant.animationDuration(),
                useNativeDriver: false,
            }).start();
        }
    }

    setControllerVisible(controllerVisible: boolean, callback?: () => void) {
        this.setStateSafely({ controllerVisible }, callback);
    }

    setSize(width: number, height: number) {
        this.setStateSafely({
            width,
            height,
        });
    }

    setHeader(header: React$Node) {
        this.setStateSafely({ header });
    }

    // Getters
    getBackgroundColor() {
        if (Platform.OS === 'web' && this.modalOnWeb) {
            return UIBackgroundViewColors.BackgroundOverlay;
        }
        return Platform.OS === 'web' && this.fullscreen
            ? UIBackgroundViewColors.Transparent
            : UIBackgroundViewColors.BackgroundOverlay;
    }

    isHeaderLineVisible() {
        return false;
    }

    // Events

    // Actions
    moveToTop(onFinish: ?() => void) {
        Animated.spring(this.dy, {
            toValue: 0,
            velocity: 0,
            tension: 15,
            friction: 10,
            useNativeDriver: true,
        }).start(onFinish);
    }

    moveToBottom(onFinish: ?() => void) {
        this.closeAnimation = Animated.spring(this.dy, {
            toValue: this.getMaxHeight(),
            velocity: 0,
            tension: 15,
            friction: 10,
            // Spring animation finishing could take some time
            // so tuning it up a little, more details here:
            // https://github.com/facebook/react-native/issues/20783
            restSpeedThreshold: 100,
            restDisplacementThreshold: 40,
            useNativeDriver: true,
        });

        this.closeAnimation.start(({ finished }) => {
            if (!finished) {
                this.closeAnimation = null;
                return;
            }

            if (onFinish != null) {
                onFinish();
            }

            // Clean the `closeAnimation` variable once it's not animating
            // We use it to identify if the modal is in process of closing
            this.closeAnimation = null;
        });
    }

    openDialog() {
        this.onWillAppear();

        if (this.closeAnimation != null) {
            // Stop the closing animation if it was started
            this.closeAnimation.stop();
        }

        // Open the modal
        this.dy.setValue(this.getMaxHeight());
        this.moveToTop(this.onDidAppearHandler);
    }

    async show(arg: ModalControllerShowArgs) {
        let open;
        if (!arg) {
            open = true;
        } else if (typeof arg === 'boolean') {
            open = arg;
        } else if (arg && typeof arg === 'object') {
            if (!arg.open) {
                open = true;
            } else {
                ({ open } = arg);
            }
            if (arg.onCancel) {
                this.onCancel = arg.onCancel;
            }
            if (arg.onSubmit) {
                this.onSubmit = arg.onSubmit;
            }
            if (arg.onSelect) {
                this.onSelect = arg.onSelect;
            }
        }
        await UIFunction.makeAsync(this.setControllerVisible.bind(this))(true);
        if (open) {
            this.openDialog();
        }
    }

    async hide() {
        if (this.closeAnimation != null) {
            // Already closing, no further actions are required
            return;
        }

        if (this.state.controllerVisible) {
            this.onWillHide();
            this.moveToBottom(this.onDidHideHandler);
        }
    }

    // Render
    renderLeftHeader() {
        return null;
    }

    renderCentralHeader() {
        return null;
    }

    renderRightHeader() {
        return null;
    }

    // eslint-disable-next-line no-unused-vars
    renderContentView(contentHeight: number): React$Node {
        return null;
    }

    onReleaseSwipe = (dy: number) => {
        if (this.closeAnimation != null) {
            // Do not process the swipe release as the modal is already closing
            return;
        }

        if (dy > UIConstant.swipeThreshold()) {
            this.onCancelPress();
        } else {
            this.moveToTop();
        }
    };

    onPan = ({ nativeEvent: { translationY } }: RNGHEvent<{ translationY: number }>) => {
        if (translationY > 0 && this.dismissible && this.shouldSwipeToDismiss()) {
            this.dy.setValue(translationY);
        }
    };

    onPanHandlerStateChange = ({
        nativeEvent: { state, translationY },
    }: RNGHEvent<{ state: RNGHState, translationY: number }>) => {
        if (
            (state === RNGHState.END || state === RNGHState.CANCELLED) &&
            this.dismissible &&
            this.shouldSwipeToDismiss()
        ) {
            this.onReleaseSwipe(translationY);
        }
    };

    onTapHandlerStateChange = ({ nativeEvent: { state } }: RNGHEvent<{ state: RNGHState }>) => {
        if (state === RNGHState.ACTIVE && this.dismissible) {
            this.onCancelPress();
        }
    };

    renderContainer() {
        const { containerStyle, contentHeight, dialogStyle } = this.getDialogStyle();

        return (
            <ModalControllerContainer
                testID={this.testID}
                containerStyle={containerStyle}
                dialogStyle={dialogStyle}
                backgroundColor={this.getBackgroundColor()}
                dYDependentOpacity={this.getDYDependentOpacity()}
                dismissible={this.dismissible}
                shouldSwipeToDismiss={this.shouldSwipeToDismiss()}
                adjustKeyboardInsetDynamically={this.adjustKeyboardInsetDynamically}
                onTapHandlerStateChange={this.onTapHandlerStateChange}
                onPanHandlerStateChange={this.onPanHandlerStateChange}
                onPan={this.onPan}
                onLayout={this.onLayout}
                marginBottom={this.marginBottom}
            >
                {this.renderContentView(contentHeight)}
            </ModalControllerContainer>
        );
    }

    render() {
        if (!this.state.controllerVisible) {
            return null;
        }

        return this.renderContainer();
    }
}
