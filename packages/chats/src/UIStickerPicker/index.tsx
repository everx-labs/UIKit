import * as React from 'react';
import {
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { UIColor, UIConstant, UIDevice, UIStyle } from '@tonlabs/uikit.core';
import { UIImage } from '@tonlabs/uikit.components';
import { UIController } from '@tonlabs/uikit.navigation';

// Unfortunately we have to import it as UICustomKeyboard doesn't accept functional props :(
import { UICustomKeyboardUtils } from '../UICustomKeyboard';
import { useTheme } from '../useTheme';

export type UISticker = {
    name: string;
    keywords?: string[];
    url: string;
};

export type UIStickerPackage = {
    id: string;
    date: number;
    description: string;
    name: string;
    stickers: UISticker[];
};

export type OnPickSticker = (sticker: PickedSticker) => void;

export type PickedSticker = { url: string; name: string; package: string };

export const UIStickerPickerKeyboardName = 'UIStickerPickerKeyboard';
const UIStickerPickerKeyboardHeight = UIDevice.isDesktop() ? 180 : 270;

function Sticker({
    sticker,
    pkgID,
    onPress,
}: {
    sticker: UISticker;
    pkgID: string;
    onPress: (sticker: PickedSticker) => void;
}) {
    const stk: PickedSticker = {
        url: sticker.url,
        name: sticker.name,
        package: pkgID,
    };
    const src = { uri: sticker.url };

    return (
        <TouchableOpacity
            testID={`stickers_btn_${sticker.url}`}
            onPress={() => onPress(stk)}
            key={`pkg_${pkgID}_sticker_${stk.name}`}
        >
            <UIImage style={styles.sticker} source={src} />
        </TouchableOpacity>
    );
}

function StickerList(
    props: Props & {
        style: StyleProp<ViewStyle>;
    }
) {
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <FlatList
                    testID="list_sticker_packages"
                    data={props.stickers}
                    renderItem={({ item }) => {
                        return (
                            <ScrollView
                                contentContainerStyle={styles.packageContainer}
                            >
                                {item.stickers.map((sticker) => (
                                    <Sticker
                                        sticker={sticker}
                                        pkgID={item.id}
                                        onPress={(sticker) => {
                                            const {
                                                isCustomKeyboard,
                                                onPick,
                                            } = props;
                                            if (onPick) {
                                                onPick(sticker);
                                            } else if (isCustomKeyboard) {
                                                UICustomKeyboardUtils.onItemSelected(
                                                    UIStickerPickerKeyboardName,
                                                    sticker
                                                );
                                            }
                                        }}
                                    />
                                ))}
                            </ScrollView>
                        );
                    }}
                    keyExtractor={(sticker) => sticker.id}
                    // Apply overflowY style for web to make the scrollbar appear as an overlay
                    // thus not affecting the content width of ScrollView to prevent layout issues
                    style={[
                        // @ts-ignore
                        Platform.select({ web: { overflowY: 'overlay' } }),
                        props.style,
                    ]}
                    contentContainerStyle={{
                        paddingBottom: insets?.bottom ?? 0,
                    }}
                />
            )}
        </SafeAreaInsetsContext.Consumer>
    );
}

export type UIStickerPickerRef = {
    show: () => void;
    hide: () => void;
};

function usePickerAnimations(
    ref: React.Ref<UIStickerPickerRef>,
    isCustomKeyboard?: boolean
) {
    const height = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    const animate = React.useCallback((show: boolean) => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: show ? 1.0 : 0.0,
                duration: UIConstant.animationDuration(),
                easing: UIController.getEasingFunction(
                    LayoutAnimation.Types.keyboard
                ),
                useNativeDriver: true,
            }),
            Animated.timing(height, {
                toValue: show ? UIStickerPickerKeyboardHeight : 0.0,
                duration: UIConstant.animationDuration(),
                easing: UIController.getEasingFunction(
                    LayoutAnimation.Types.keyboard
                ),
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    React.useImperativeHandle(ref, () => ({
        show: () => {
            animate(true);
        },
        hide: () => {
            animate(false);
        },
    }));

    React.useEffect(() => {
        if (isCustomKeyboard) {
            animate(true);
        }
    }, []);

    return {
        height,
        opacity,
    };
}

type Props = {
    isCustomKeyboard?: boolean;
    stickers: UIStickerPackage[];
    onPick: OnPickSticker;
};

export const UIStickerPicker = React.forwardRef<UIStickerPickerRef, Props>(
    function UIStickerPickerForwarded(props, ref) {
        const theme = useTheme();
        const { height, opacity } = usePickerAnimations(
            ref,
            props.isCustomKeyboard
        );

        if (props.isCustomKeyboard) {
            return (
                <Animated.View
                    style={{
                        opacity,
                    }}
                >
                    <StickerList
                        {...props}
                        style={UIStyle.color.getBackgroundColorStyle(
                            UIColor.backgroundSecondary(theme)
                        )}
                    />
                </Animated.View>
            );
        }

        return (
            <Animated.View>
                <Animated.View
                    style={[
                        {
                            height,
                            opacity,
                        },
                    ]}
                >
                    <StickerList
                        {...props}
                        style={UIStyle.color.getBackgroundColorStyle(
                            UIColor.backgroundWhiteLight(theme)
                        )}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
);

UICustomKeyboardUtils.registerCustomKeyboard(
    UIStickerPickerKeyboardName,
    UIStickerPicker
);

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
