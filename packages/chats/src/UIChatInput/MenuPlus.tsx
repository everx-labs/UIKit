import * as React from 'react';
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
    View,
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIPopoverMenu } from '@tonlabs/uikit.navigation';

import { commonStyles } from './styles';
import type { MenuItem } from './types';

type Props = {
    menuPlus?: MenuItem[];
    menuPlusDisabled?: boolean;
};

export function MenuPlus({ menuPlus, menuPlusDisabled }: Props) {
    if (!menuPlus || menuPlus.length === 0) {
        return null;
    }

    if (menuPlusDisabled) {
        return (
            <View style={commonStyles.buttonContainer}>
                <Image
                    source={UIAssets.icons.ui.buttonPlusDisabled}
                    style={commonStyles.icon}
                />
            </View>
        );
    }

    if (menuPlus.length === 1) {
        return (
            <TouchableOpacity
                testID="menu_view"
                onPress={menuPlus[0].onPress}
                style={commonStyles.buttonContainer}
            >
                <Image
                    source={UIAssets.icons.ui.buttonPlus}
                    style={commonStyles.icon}
                />
            </TouchableOpacity>
        );
    }

    return (
        <UIPopoverMenu
            testID="menu_view"
            menuItemsList={menuPlus}
            placement="top"
            containerStyle={commonStyles.buttonContainer}
        >
            <Image
                source={UIAssets.icons.ui.buttonPlus}
                style={commonStyles.icon}
            />
        </UIPopoverMenu>
    );
}
