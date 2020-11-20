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

export type PickedSticker = { url: string; name: string; package: string };

type Props = {
    isCustomKeyboard: boolean;
    stickers: UIStickerPackage[];
    onPick: (sticker: PickedSticker) => void;
};

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

export function UIStickerPicker(props: Props) {
    const theme = useTheme();
    const height = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    const { isCustomKeyboard } = props;
    if (isCustomKeyboard) {
        return (
            <Animated.View
                style={{
                    opacity,
                }}
            >
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
                                                    UIStickerPicker.keyboardName,
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
                        Platform.select({ web: { overflowY: 'overlay' } }),
                        UIStyle.color.getBackgroundColorStyle(
                            UIColor.backgroundSecondary(theme)
                        ),
                    ]}
                    contentContainerStyle={{
                        paddingBottom: this.state.safeAreaBottomInset,
                    }}
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
                {this.renderList(UIColor.backgroundWhiteLight())}
            </Animated.View>
        </Animated.View>
    );
}
