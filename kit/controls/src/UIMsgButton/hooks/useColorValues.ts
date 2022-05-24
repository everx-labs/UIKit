import { usePressableContentColor } from '../../Pressable';
import {
    ContentColors,
    BackgroundOverlayColors,
    UIMsgButtonType,
    UIMsgButtonVariant,
} from '../constants';

export function useColorValues(type: UIMsgButtonType, variant: UIMsgButtonVariant) {
    const contentColor = usePressableContentColor(ContentColors[type][variant].content);
    if (type === UIMsgButtonType.Primary) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const backgroundColor = usePressableContentColor(ContentColors[type][variant].background);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const backgroundOverlayColor = usePressableContentColor(BackgroundOverlayColors);

        return {
            backgroundColor,
            borderColor: null,
            contentColor,
            backgroundOverlayColor,
        };
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const borderColor = usePressableContentColor(ContentColors[type][variant].border);

    return {
        backgroundColor: null,
        borderColor,
        contentColor,
        backgroundOverlayColor: null,
    };
}
