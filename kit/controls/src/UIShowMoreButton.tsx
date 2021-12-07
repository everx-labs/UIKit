import * as React from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
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

function getIndicatorSize(showMoreButtonHeight: UIShowMoreButtonHeight): number {
    switch (showMoreButtonHeight) {
        case UIShowMoreButtonHeight.Small:
            return UIConstant.showMoreButtonIndicatorSizeSmall;
        case UIShowMoreButtonHeight.Medium:
        default:
            return UIConstant.showMoreButtonIndicatorSizeMedium;
    }
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

const Indicator = React.memo(
    ({
        showMoreButtonHeight,
        color,
    }: {
        showMoreButtonHeight: UIShowMoreButtonHeight;
        color: string;
    }) => {
        return (
            <MaterialIndicator
                style={{ position: 'absolute' }}
                color={color}
                size={getIndicatorSize(showMoreButtonHeight)}
            />
        );
    },
);

export const UIShowMoreButton: React.FunctionComponent<UIShowMoreButtonProps> = ({
    label = uiLocalized.ShowMore,
    progress = false,
    height = UIShowMoreButtonHeight.Medium,
    onPress: onPressProp,
    background = true,
    testID,
}: UIShowMoreButtonProps) => {
    const theme = useTheme();
    const styles = useStyles(theme, background, height, progress);

    const onPress = React.useCallback(() => {
        if (onPressProp) {
            onPressProp();
        }
    }, [onPressProp]);

    React.useLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [progress]);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            disabled={progress}
            testID={testID}
        >
            <View style={styles.indicatorContainer}>
                <Indicator
                    color={
                        background
                            ? (theme[ColorVariants.StaticTextPrimaryLight] as string)
                            : (theme[ColorVariants.TextPrimary] as string)
                    }
                    showMoreButtonHeight={height}
                />
            </View>
            <UILabel
                style={styles.label}
                role={getLabelRole(height)}
                color={
                    background ? UILabelColors.StaticTextPrimaryLight : UILabelColors.TextPrimary
                }
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {label}
            </UILabel>
        </TouchableOpacity>
    );
};

const useStyles = makeStyles(
    (
        theme: Theme,
        background: boolean,
        showMoreButtonHeight: UIShowMoreButtonHeight,
        progress: boolean,
    ) => {
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
                width: progress ? 0 : undefined,
                opacity: progress ? 0 : 1,
                paddingHorizontal: UILayoutConstant.contentInsetVerticalX3,
            },
            indicatorContainer: {
                ...StyleSheet.absoluteFillObject,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: progress ? 1 : 0,
            },
        };
    },
);
