import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';
import { UIPopup } from '@tonlabs/uikit.popups';
import type { UIMenuActionProps } from '@tonlabs/uikit.popups';

import { commonStyles } from './styles';

type Props = {
    menuMore?: UIMenuActionProps[];
    menuMoreDisabled?: boolean;
};

export function MenuMore({ menuMore, menuMoreDisabled }: Props) {
    const [isMenuVisible, setMenuVisible] = React.useState<boolean>(false);

    const menuTriggerRef = React.useRef<View>(null);

    const showMenu = React.useCallback(() => setMenuVisible(true), []);

    const hideMenu = React.useCallback(() => setMenuVisible(false), []);

    if (!menuMore || menuMore.length === 0) {
        return null;
    }

    if (menuMoreDisabled) {
        return (
            <View style={commonStyles.buttonContainer}>
                <View style={styles.iconWrapper}>
                    <UIImage
                        source={UIAssets.icons.ui.buttonDots}
                        tintColor={ColorVariants.IconNeutral}
                    />
                </View>
            </View>
        );
    }

    if (menuMore.length === 1) {
        return (
            <TouchableOpacity
                testID="menu_view_more"
                onPress={menuMore[0].onPress}
                style={commonStyles.buttonContainer}
            >
                <View style={styles.iconWrapper}>
                    <UIImage
                        source={UIAssets.icons.ui.buttonDots}
                        tintColor={ColorVariants.BackgroundAccent}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <>
            {/* We disable hierarchy optimization for Android to make it possible
            to measure View's dimensions for the UIPopup.Menu triggerRef */}
            <View ref={menuTriggerRef} collapsable={false}>
                <TouchableOpacity
                    testID="menu_view_more"
                    key={`menu_view_more_items:${menuMore.length}`}
                    onPress={showMenu}
                    style={commonStyles.buttonContainer}
                >
                    <View style={styles.iconWrapper}>
                        <UIImage
                            source={UIAssets.icons.ui.buttonDots}
                            tintColor={ColorVariants.BackgroundAccent}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <UIPopup.Menu visible={isMenuVisible} triggerRef={menuTriggerRef} onClose={hideMenu}>
                {menuMore.map(item => (
                    <UIPopup.Menu.Action
                        testID={`${item.title}_action_button`}
                        key={`menu_view_more_item:${item.title}`}
                        type={item.type}
                        title={item.title}
                        onPress={() => {
                            hideMenu();
                            item.onPress();
                        }}
                    />
                ))}
            </UIPopup.Menu>
        </>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
