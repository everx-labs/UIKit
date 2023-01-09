import { UIActionButton } from './UIActionButton';
import { UIBoxButton } from './UIBoxButton';
import { UILinkButton } from './UILinkButton';
import { UILoadMoreButton } from './UILoadMoreButton';
import { UIMsgButton } from './UIMsgButton';
import { UIPillButton } from './UIPillButton';
import { TouchableOpacity } from './TouchableOpacity';
import { UIIndicator } from './UIIndicator';
import { UIShowMoreButton } from './UIShowMoreButton';
import { UISwitcher } from './UISwitcher';
import { UIWideBoxButton } from './UIWideBoxButton';
import { UIPressableArea } from './UIPressableArea';
import { UIButtonGroup } from './UIButtonGroup';

import * as Haptics from './Haptics/Haptics';
import * as useHover from './useHover';

export * from './UIActionButton';
export * from './UIBoxButton';
export * from './UILinkButton';
export * from './UILoadMoreButton';
export * from './UIMsgButton';
export * from './UIPillButton';
export * from './TouchableOpacity';
export * from './UIIndicator';
export * from './UIShowMoreButton';
export * from './UISwitcher';
export * from './UIWideBoxButton';
export * from './UIPressableArea';
export * from './Pressable';
export * from './UIButtonGroup';

export * from './Haptics/Haptics';
export * from './useHover';
export * from './addNativeProps';
export * from './types';
export { UIConstant } from './constants';

export const UIControl = {
    UIActionButton,
    UIBoxButton,
    UILinkButton,
    UILoadMoreButton,
    UIMsgButton,
    UIPillButton,
    TouchableOpacity,
    UIIndicator,
    UIShowMoreButton,
    UISwitcher,
    UIWideBoxButton,
    UIPressableArea,
    UIButtonGroup,

    Haptics,
    useHover,
};
export default UIControl;
