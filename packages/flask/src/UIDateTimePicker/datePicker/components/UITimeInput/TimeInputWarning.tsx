import React from 'react';
import { View } from 'react-native';

import { UIAssets } from '@tonlabs/uikit.assets';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TypographyVariants,
    UIImage,
    UILabel,
    useTheme,
} from '@tonlabs/uikit.hydrogen';

import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { UIConstant } from '../../../../constants';
import { useCalendar } from '../../calendarContext';

const iconSize = {
    height: UIConstant.timeInput.warningIconSize,
    width: UIConstant.timeInput.warningIconSize,
};

export function TimeInputWarning({ isValidTime = true }: { isValidTime: boolean }) {
    const { utils, min, max, isAmPmTime } = useCalendar();
    const theme = useTheme();
    const styles = useStyles(theme, isValidTime);

    const formatTime = React.useCallback(
        (value: Date | Dayjs | undefined) => {
            if (value) {
                return isAmPmTime
                    ? `${utils.convertToAmPm(value)} ${dayjs(value).format('A')}`
                    : dayjs(value).format('HH.mm');
            }
            return null;
        },
        [isAmPmTime, utils],
    );

    const minTime = React.useMemo(() => formatTime(min), [min, formatTime]);
    const maxTime = React.useMemo(() => formatTime(max), [max, formatTime]);

    const color = React.useMemo(() => {
        return isValidTime ? ColorVariants.TextAccent : ColorVariants.TextNegative;
    }, [isValidTime]);

    const image = React.useMemo(() => {
        return isValidTime ? UIAssets.icons.ui.info : UIAssets.icons.ui.warn;
    }, [isValidTime]);

    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <UIImage
                    height={iconSize.height}
                    width={iconSize.width}
                    source={image}
                    tintColor={color}
                    resizeMode="contain"
                />
            </View>
            <UILabel style={styles.label} role={TypographyVariants.ParagraphNote} color={color}>
                {`Choose a time between ${minTime} and ${maxTime}`}
            </UILabel>
        </View>
    );
}

const useStyles = makeStyles((theme: Theme, isValidTime: boolean) => ({
    container: {
        backgroundColor: theme[
            isValidTime
                ? ColorVariants.StaticBackgroundAccent
                : ColorVariants.StaticBackgroundNegative
        ] as string,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        ...iconSize,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        flex: 1,
    },
}));
