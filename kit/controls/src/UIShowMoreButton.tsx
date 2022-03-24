import * as React from 'react';
import { LayoutAnimation, Platform, UIManager, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
    Theme,
    TypographyVariants,
    makeStyles,
} from '@tonlabs/uikit.themes';

import { TouchableOpacity } from './TouchableOpacity';
import { UIConstant } from './constants';
import { UIIndicator } from './UIIndicator';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export enum UIShowMoreButtonHeight {
    Medium = 'Medium',
    Small = 'Small',
}

export type UIShowMoreButtonProps = {
    label?: string;
    progress: boolean;
    height?: UIShowMoreButtonHeight;
    onPress?: () => void;
    background?: boolean;
    testID?: string;
};

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
    background = true,
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

    const styles = useStyles(theme, background, height);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            disabled={progress}
            testID={testID}
        >
            <View style={styles.indicatorContainer}>
                {progress ? (
                    <UIIndicator
                        color={
                            background
                                ? ColorVariants.StaticTextPrimaryLight
                                : ColorVariants.TextPrimary
                        }
                        size={indicatorSize}
                    />
                ) : null}
            </View>
            {progress ? null : (
                <UILabel
                    style={styles.label}
                    role={getLabelRole(height)}
                    color={
                        background
                            ? UILabelColors.StaticTextPrimaryLight
                            : UILabelColors.TextPrimary
                    }
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {label}
                </UILabel>
            )}
        </TouchableOpacity>
    );
};

const useStyles = makeStyles(
    (theme: Theme, background: boolean, showMoreButtonHeight: UIShowMoreButtonHeight) => {
        const size = getSize(showMoreButtonHeight);
        return {
            container: {
                height: size,
                minWidth: size,
                backgroundColor: background
                    ? theme[ColorVariants.BackgroundOverlay]
                    : theme[ColorVariants.Transparent],
                borderRadius: size,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
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
