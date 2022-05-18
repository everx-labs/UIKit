import * as React from 'react';
import { ColorValue, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import {
    UILabel,
    UILabelRoles,
    ColorVariants,
    useTheme,
    TypographyVariants,
    makeStyles,
} from '@tonlabs/uikit.themes';

import { UIConstant } from '../constants';
import { UIIndicator } from '../UIIndicator';
import { UIShowMoreButtonHeight, UIShowMoreButtonType } from './constants';
import type { UIShowMoreButtonProps } from './types';
import { UIPressableArea } from '../UIPressableArea';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function getLabelRole(showMoreButtonHeight: UIShowMoreButtonHeight): TypographyVariants {
    switch (showMoreButtonHeight) {
        case UIShowMoreButtonHeight.Small:
            return UILabelRoles.NarrowHeadlineFootnote;
        case UIShowMoreButtonHeight.Medium:
        default:
            return UILabelRoles.Action;
    }
}

function useIndicatorSize(showMoreButtonHeight: UIShowMoreButtonHeight): number {
    return React.useMemo(() => {
        switch (showMoreButtonHeight) {
            case UIShowMoreButtonHeight.Small:
                return UIConstant.showMoreButtonIndicatorSizeSmall;
            case UIShowMoreButtonHeight.Medium:
            default:
                return UIConstant.showMoreButtonIndicatorSizeMedium;
        }
    }, [showMoreButtonHeight]);
}

function getSize(showMoreButtonHeight: UIShowMoreButtonHeight): number {
    switch (showMoreButtonHeight) {
        case UIShowMoreButtonHeight.Small:
            return UIConstant.showMoreButtonSizeSmall;
        case UIShowMoreButtonHeight.Medium:
        default:
            return UIConstant.showMoreButtonSizeMedium;
    }
}

export const UIShowMoreButton: React.FunctionComponent<UIShowMoreButtonProps> = ({
    label = uiLocalized.ShowMore,
    progress = false,
    height = UIShowMoreButtonHeight.Medium,
    onPress: onPressProp,
    type = UIShowMoreButtonType.Default,
    testID,
}: UIShowMoreButtonProps) => {
    const theme = useTheme();

    const onPress = React.useCallback(() => {
        if (onPressProp) {
            onPressProp();
        }
    }, [onPressProp]);

    React.useLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [progress]);

    const indicatorSize = useIndicatorSize(height);

    const contentColor = React.useMemo(() => {
        return type === UIShowMoreButtonType.Default
            ? ColorVariants.StaticTextPrimaryLight
            : ColorVariants.TextPrimary;
    }, [type]);

    const backgroundColor = React.useMemo(() => {
        return type === UIShowMoreButtonType.Default
            ? theme[ColorVariants.BackgroundOverlay]
            : theme[ColorVariants.Transparent];
    }, [theme, type]);

    const styles = useStyles(backgroundColor, height);

    return (
        <UIPressableArea onPress={onPress} disabled={progress} testID={testID}>
            <View style={styles.container}>
                <View style={styles.indicatorContainer}>
                    {progress ? <UIIndicator color={contentColor} size={indicatorSize} /> : null}
                </View>
                {progress ? null : (
                    <UILabel
                        style={styles.label}
                        role={getLabelRole(height)}
                        color={contentColor}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {label}
                    </UILabel>
                )}
            </View>
        </UIPressableArea>
    );
};

const useStyles = makeStyles(
    (backgroundColor: ColorValue, showMoreButtonHeight: UIShowMoreButtonHeight) => {
        const size = getSize(showMoreButtonHeight);
        return {
            container: {
                height: size,
                minWidth: size,
                backgroundColor,
                borderRadius: size,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                ...Platform.select({
                    web: {
                        userSelect: 'none',
                    },
                    default: null,
                }),
            },
            label: {
                paddingHorizontal: UILayoutConstant.contentInsetVerticalX3,
            },
            indicatorContainer: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
        };
    },
);
