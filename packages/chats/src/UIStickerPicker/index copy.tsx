// @flow
import React from 'react';
import {
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
    UIColor,
    UIConstant,
    UIController,
    UIDevice,
    UIImage,
    UIPureComponent,
    UIStyle,
} from '@kits/UIKit';
import type { UIStickerPackage, UISticker } from '@kits/UIKit';

// Unfortunately we have to import it as UICustomKeyboard doesn't accept functional props :(
import { UICustomKeyboardUtils } from '../UICustomKeyboard';

export type PickedSticker = { url: string, name: string, package: string };

type Props = {
    onPickSticker: ?(kbID: string, sticker: PickedSticker) => void,
    isCustomKeyboard: boolean,
    stickers: UIStickerPackage[],
};

type State = {
    safeAreaBottomInset: number,
}

const styles = StyleSheet.create({
    sticker: {
        width: UIConstant.largeCellHeight(),
        height: UIConstant.largeCellHeight(),
        marginVertical: UIConstant.normalContentOffset(),
        marginHorizontal: UIDevice.isDesktop()
            ? UIConstant.contentOffset()
            : UIConstant.normalContentOffset(),
    },
    packageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});

let sharedRef = null;

export default class UIStickerPicker extends UIPureComponent<Props, State> {
    static keyboardName = 'UIStickerPickerKeyboard';

    static defaultProps = {
        onPickSticker: undefined,
        isCustomKeyboard: false,
        stickers: [],
    };

    static async show() {
        if (sharedRef) {
            sharedRef.animate(true);
        }
    }

    static async hide() {
        if (sharedRef) {
            sharedRef.animate(false);
        }
    }

    animatedOpacity = new Animated.Value(0.0);
    animatedHeight = new Animated.Value(0.0);
    height = UIDevice.isDesktop() ? 180 : 270;
    state = {
        safeAreaBottomInset: 0,
    }

    componentDidMount() {
        super.componentDidMount();

        sharedRef = this;

        (async () => {
            const safeAreaInsets = await UIDevice.safeAreaInsets();
            this.setStateSafely({ safeAreaBottomInset: safeAreaInsets.bottom });
        })();

        if (this.props.isCustomKeyboard) {
            // A `show()` method doesn't work for custom keyboard.
            // Thus we are to animate it on mount.
            this.animate(true);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        sharedRef = null;
    }

    getStickers() {
        return this.props.stickers;
    }

    animate = (show: boolean) => {
        Animated.parallel([
            Animated.timing(this.animatedOpacity, {
                toValue: show ? 1.0 : 0.0,
                duration: UIConstant.animationDuration(),
                easing: UIController.getEasingFunction(LayoutAnimation.Types.keyboard),
                useNativeDriver: true,
            }),
            Animated.timing(this.animatedHeight, {
                toValue: show ? this.height : 0.0,
                duration: UIConstant.animationDuration(),
                easing: UIController.getEasingFunction(LayoutAnimation.Types.keyboard),
                useNativeDriver: false,
            }),
        ]).start();
    };

    // eslint-disable-next-line class-methods-use-this
    onPressSticker(sticker: PickedSticker) {
        const { isCustomKeyboard, onPickSticker } = this.props;
        if (onPickSticker) {
            onPickSticker(sticker);
        } else if (isCustomKeyboard) {
            UICustomKeyboardUtils.onItemSelected(UIStickerPicker.keyboardName, sticker);
        }
    }

    keyExtractor = (pkg: UIStickerPackage) => {
        return `set_stickers_pkg_${pkg.id}`;
    };

    renderSticker(sticker: UISticker, pkgID: string) {
        const stk: PickedSticker = { url: sticker.url, name: sticker.name, package: pkgID };
        const src = { uri: sticker.url };

        return (
            <TouchableOpacity
                testID={`stickers_btn_${sticker.url}`}
                onPress={() => this.onPressSticker(stk)}
                key={`pkg_${pkgID}_sticker_${stk.name}`}
            >
                <UIImage
                    style={styles.sticker}
                    source={src}
                />
            </TouchableOpacity>
        );
    }

    renderPackage = ({ item }: UIStickerPackage) => {
        return (
            <ScrollView
                contentContainerStyle={styles.packageContainer}
            >
                {item.stickers.map(sticker => (
                    this.renderSticker(sticker, item.id)
                ))}
            </ScrollView>
        );
    };

    renderList(backgroundColor: string = 'transparent') {
        const packages = this.getStickers();
        return (
            <FlatList
                testID="list_sticker_packages"
                data={packages}
                renderItem={this.renderPackage}
                keyExtractor={this.keyExtractor}
                // Apply overflowY style for web to make the scrollbar appear as an overlay
                // thus not affecting the content width of ScrollView to prevent layout issues
                style={[
                    Platform.select({ web: { overflowY: 'overlay' } }),
                    UIStyle.color.getBackgroundColorStyle(backgroundColor),
                ]}
                contentContainerStyle={{ paddingBottom: this.state.safeAreaBottomInset }}
            />
        );
    }

    render() {
        const { isCustomKeyboard } = this.props;
        if (isCustomKeyboard) {
            return (
                <Animated.View
                    style={{
                        opacity: this.animatedOpacity,
                    }}
                >
                    {this.renderList(UIColor.backgroundSecondary())}
                </Animated.View>
            );
        }

        return (
            <Animated.View>
                <Animated.View
                    style={[
                        {
                            height: this.animatedHeight,
                            opacity: this.animatedOpacity,
                        },
                    ]}
                >
                    {this.renderList(UIColor.backgroundWhiteLight())}
                </Animated.View>
            </Animated.View>
        );
    }
}
