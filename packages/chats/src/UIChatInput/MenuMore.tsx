import * as React from 'react';
import {
    Image, // TODO: use UIImage?
    View,
} from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIPopoverMenu } from '@tonlabs/uikit.navigation_legacy';
import { TouchableOpacity } from '@tonlabs/uikit.hydrogen';

import { commonStyles } from './styles';
import type { MenuItem } from './types';

type Props = {
    menuMore?: MenuItem[];
    menuMoreDisabled?: boolean;
};

export function MenuMore({ menuMore, menuMoreDisabled }: Props) {
    if (!menuMore || menuMore.length === 0) {
        return null;
    }

    let content = null;

    if (menuMoreDisabled) {
        content = <Image source={UIAssets.icons.ui.buttonDots} />;
    } else if (menuMore.length === 1) {
        content = (
            <TouchableOpacity onPress={menuMore[0].onPress}>
                <Image source={UIAssets.icons.ui.buttonDots} />
            </TouchableOpacity>
        );
    } else {
        content = (
            <UIPopoverMenu testID="menu_view_more" menuItemsList={menuMore} placement="top">
                <Image source={UIAssets.icons.ui.buttonDots} />
            </UIPopoverMenu>
        );
    }

    return (
        <View style={commonStyles.buttonContainer}>
            <View style={commonStyles.icon}>{content}</View>
        </View>
    );
}
