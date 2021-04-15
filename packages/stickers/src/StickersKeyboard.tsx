import * as React from 'react';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { UIConstant, UIDevice } from '@tonlabs/uikit.core';
import { ColorVariants, useTheme, UIImage } from '@tonlabs/uikit.hydrogen';
import { registerKeyboardComponent } from '@tonlabs/uikit.keyboard';

// Unfortunately we have to import it as UICustomKeyboard doesn't accept functional props :(
import type {
    UISticker,
    UIStickerPackage,
    PickedSticker,
    OnPickSticker,
    // OnPickSticker,
} from './types';

export const StickerPickerKeyboardName = 'UIStickerPickerKeyboard';

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

type Props = {
    stickers: UIStickerPackage[];
    theme?: any;
    onEvent: OnPickSticker;
};

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

    // theme is passed as a prop here in order to have its actual values, because context is missed for the native keyboard
    const theme = useTheme();
    const { stickers, theme: themeProp } = props;
    const backgroundColor: ViewStyle = React.useMemo(
        () => ({
            backgroundColor: themeProp
                ? themeProp[ColorVariants.BackgroundSecondary]
                : theme[ColorVariants.BackgroundSecondary],
        }),
        [theme, themeProp],
    );

    return (
        <FlatList
            testID="list_sticker_packages"
            data={stickers}
            renderItem={({ item }) => {
                return (
                    <ScrollView contentContainerStyle={styles.packageContainer}>
                        {item.stickers.map((sticker) => (
                            <Sticker
                                key={`pkg_${item.id}_sticker_${sticker.name}`}
                                sticker={sticker}
                                pkgID={item.id}
                                onPress={props.onEvent}
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
                backgroundColor,
            ]}
            contentContainerStyle={{
                paddingBottom: safeAreaBottomInset,
            }}
        />
    );
}

export const StickersKeyboard = registerKeyboardComponent(
    StickerPickerKeyboardName,
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
