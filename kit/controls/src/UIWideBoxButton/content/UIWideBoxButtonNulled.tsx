import * as React from 'react';
import { ColorValue, ImageStyle, View } from 'react-native';
import { UILabelAnimated, UILabelRoles, makeStyles } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useAnimatedProps } from 'react-native-reanimated';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableContentColor } from '../../Pressable';
import { contentColors } from '../constants';

export function UIWideBoxButtonNulled({ title, icon, caption }: UIWideBoxButtonProps) {
    const contentColor = usePressableContentColor(contentColors.nulled);
    const animatedImageProps = useAnimatedProps(() => {
        return {
            tintColor: contentColor.value,
        };
    });
    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value as ColorValue,
        };
    });

    const styles = useStyles(!!caption);
    return (
        <View style={styles.container}>
            <UILabelAnimated role={UILabelRoles.Action} animatedProps={animatedLabelProps}>
                {title}
            </UILabelAnimated>
            {icon ? (
                <UIAnimatedImage
                    source={icon}
                    style={styles.image as ImageStyle}
                    animatedProps={animatedImageProps}
                />
            ) : null}
        </View>
    );
}

const useStyles = makeStyles((hasCaption: boolean) => ({
    container: {
        flexDirection: 'row',
        paddingTop: UILayoutConstant.contentInsetVerticalX4,
        paddingBottom: hasCaption ? 0 : UILayoutConstant.contentInsetVerticalX1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: UILayoutConstant.alertBorderRadius,
    },
    image: {
        marginLeft: UILayoutConstant.normalContentOffset,
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
}));
