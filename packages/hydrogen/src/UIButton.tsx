import * as React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

import { UILabel, UILabelColors, UILabelRoles } from './UILabel';
import { useHover } from './useHover';

type UIButtonProps = {
    onPress: () => void;
    style?: ViewStyle;
    title?: string;
};

export function UIButton({
    onPress,
    style,
    title,
}: UIButtonProps) {
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();
    const content = React.useMemo(
        () => {
            return (
                <UILabel
                    color={isHovered ? UILabelColors.TextAccent : UILabelColors.TextPrimary}
                    role={UILabelRoles.Action}
                >
                    {title}
                </UILabel>
            );
        },
        [title, isHovered]
    );

    return (
        <TouchableOpacity
            // @ts-expect-error
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPress={onPress}
            style={style}
        >
            {content}
        </TouchableOpacity>
    );
}
