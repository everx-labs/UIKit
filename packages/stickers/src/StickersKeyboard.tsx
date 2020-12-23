import * as React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { UIConstant, UIDevice, UIStyle } from '@tonlabs/uikit.core';
import { UIImage } from '@tonlabs/uikit.components';
import { ColorVariants, useTheme } from '@tonlabs/uikit.hydrogen';
import { UICustomKeyboardUtils } from '@tonlabs/uikit.keyboard';

// Unfortunately we have to import it as UICustomKeyboard doesn't accept functional props :(
import type {
    UISticker,
    UIStickerPackage,
    PickedSticker,
    OnPickSticker,
} from './types';

type Props = {
    isCustomKeyboard?: boolean;
    stickers: UIStickerPackage[];
    onPick: OnPickSticker;
};

export const UIStickerPickerKeyboardName = 'UIStickerPickerKeyboard';

function Sticker({
    sticker,
    pkgID,
    onPress,
}: {
    sticker: UISticker;
    pkgID: string;
    onPress: (stk: PickedSticker) => void;
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
        >
            <UIImage style={styles.sticker} source={src} />
        </TouchableOpacity>
    );
}

export function StickersList(props: Props) {
    // Unfortunately we can't use react-native-safe-area-context
    // coz we show the picker in UICustomKeyboard and it can't find
    // SafeAreaContextProvider during a render
    const [safeAreaBottomInset, setSafeAreaBottomInset] = React.useState(0);
    React.useEffect(() => {
        UIDevice.safeAreaInsets().then((insets: { bottom: number }) => {
            setSafeAreaBottomInset(insets.bottom);
        });
    });
    const theme = useTheme();

    return (
        <FlatList
            testID="list_sticker_packages"
            data={props.stickers}
            renderItem={({ item }) => {
                return (
                    <ScrollView contentContainerStyle={styles.packageContainer}>
                        {item.stickers.map((sticker) => (
                            <Sticker
                                key={`pkg_${item.id}_sticker_${sticker.name}`}
                                sticker={sticker}
                                pkgID={item.id}
                                onPress={(stk) => {
                                    const { isCustomKeyboard, onPick } = props;
                                    if (onPick) {
                                        onPick(stk);
                                    } else if (isCustomKeyboard) {
                                        UICustomKeyboardUtils.onItemSelected(
                                            UIStickerPickerKeyboardName,
                                            stk,
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
                UIStyle.color.getBackgroundColorStyle(
                    theme[ColorVariants.BackgroundSecondary],
                ),
            ]}
            contentContainerStyle={{
                paddingBottom: safeAreaBottomInset,
            }}
        />
    );
}

UICustomKeyboardUtils.registerCustomKeyboard(
    UIStickerPickerKeyboardName,
    StickersList,
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
