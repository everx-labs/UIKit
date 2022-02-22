import * as React from 'react';
import { View } from 'react-native';

import { ColorVariants } from '@tonlabs/uikit.themes';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIImage } from '@tonlabs/uikit.media';
import { UIPopup } from '@tonlabs/uikit.popups';
import type { UIMenuActionProps } from '@tonlabs/uikit.popups';

import { commonStyles } from './styles';

type Props = {
    menuPlus?: UIMenuActionProps[];
    menuPlusDisabled?: boolean;
};

export function MenuPlus({ menuPlus, menuPlusDisabled }: Props) {
    const [isMenuVisible, setMenuVisible] = React.useState<boolean>(false);

    const menuTriggerRef = React.useRef<View>(null);

    const showMenu = React.useCallback(() => setMenuVisible(true), []);

    const hideMenu = React.useCallback(() => setMenuVisible(false), []);

    if (!menuPlus || menuPlus.length === 0) {
        return null;
    }

    if (menuPlusDisabled) {
        return (
            <View style={commonStyles.buttonContainer}>
                <UIImage
                    source={UIAssets.icons.ui.buttonPlus}
                    style={commonStyles.icon}
                    tintColor={ColorVariants.IconNeutral}
                />
            </View>
        );
    }

    if (menuPlus.length === 1) {
        return (
            <TouchableOpacity
                testID="menu_view_plus"
                onPress={menuPlus[0].onPress}
                style={commonStyles.buttonContainer}
            >
                <UIImage
                    source={UIAssets.icons.ui.buttonPlus}
                    style={commonStyles.icon}
                    tintColor={ColorVariants.IconAccent}
                />
            </TouchableOpacity>
        );
    }

    return (
        <>
            {/* We disable hierarchy optimization for Android to make it possible
            to measure View's dimensions for the UIPopup.Menu triggerRef */}
            <View ref={menuTriggerRef} collapsable={false}>
                <TouchableOpacity
                    testID="menu_view_plus"
                    key={`menu_view_plus_items:${menuPlus.length}`}
                    onPress={showMenu}
                    style={commonStyles.buttonContainer}
                >
                    <UIImage
                        source={UIAssets.icons.ui.buttonPlus}
                        style={commonStyles.icon}
                        tintColor={ColorVariants.IconAccent}
                    />
                </TouchableOpacity>
            </View>

            <UIPopup.Menu visible={isMenuVisible} triggerRef={menuTriggerRef} onClose={hideMenu}>
                {menuPlus.map(item => (
                    <UIPopup.Menu.Action
                        testID={`${item.title}_action_button`}
                        key={`menu_view_plus_item:${item.title}`}
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
