import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import {
    ColorVariants,
    UILabel,
    UILabelRoles,
    UILabelColors,
    useTheme,
    TouchableOpacity,
    PortalManager,
    Portal,
    makeStyles,
    Theme,
} from '@tonlabs/uikit.hydrogen';

import { Header } from './Header';

import { useDaysCalendar, DayCells } from '../useCalendar';
import { UIConstant } from '../../../constants';

const Column = React.memo(function Column({
    id,
    items,
    selected,
    selectedRow,
    onSelect,
}: {
    id: number;
    items: DayCells[];
    selected: boolean;
    selectedRow: number;
    onSelect: (column: number, row: number) => void;
}) {
    const theme = useTheme();
    return (
        <View style={styles.column}>
            {items.map((day, index) => {
                if (day.type === 'dayLabel') {
                    return (
                        <UILabel
                            key={day.label}
                            role={UILabelRoles.ActionFootnote}
                            color={ColorVariants.TextSecondary}
                        >
                            {day.label}
                        </UILabel>
                    );
                }

                if (day.type === 'dayFiller') {
                    return (
                        <View style={styles.day}>
                            <UILabel role={UILabelRoles.Action} color={UILabelColors.TextPrimary}>
                                {' '}
                            </UILabel>
                        </View>
                    );
                }

                // const isSelected = day != null && selectedDate.isSame(day.date, 'day');
                const isSelected = selected && index === selectedRow;
                return (
                    <TouchableOpacity
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={[
                            styles.day,
                            isSelected && {
                                backgroundColor: theme[ColorVariants.StaticBackgroundAccent],
                            },
                        ]}
                        disabled={day.disabled || isSelected}
                        onPress={() => onSelect(id, index)}
                        activeOpacity={0.8}
                    >
                        <UILabel
                            role={isSelected ? UILabelRoles.HeadlineHead : UILabelRoles.Action}
                            color={
                                isSelected ? UILabelColors.TextAccent : UILabelColors.TextPrimary
                            }
                        >
                            {day.dayString}
                        </UILabel>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
});

function UpperLayer({ visible, children }: { visible: boolean; children: () => React.ReactNode }) {
    const [isVisible, setIsVisible] = React.useState(false);

    const dismiss = React.useCallback(() => {
        setIsVisible(false);
    }, []);

    const opacity = useSharedValue(0);

    React.useEffect(() => {
        if (!visible) {
            opacity.value = withTiming(
                0,
                {
                    duration: 100,
                    easing: Easing.in(Easing.ease),
                },
                isFinished => {
                    if (isFinished) {
                        runOnJS(dismiss)();
                    }
                },
            );
            return;
        }

        setIsVisible(true);
        opacity.value = withTiming(1, {
            duration: 100,
            easing: Easing.in(Easing.ease),
        });
    }, [visible, dismiss, opacity]);

    const style = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const theme = useTheme();
    const styles = useStyles(theme);

    if (!isVisible) {
        return null;
    }

    return (
        <Portal absoluteFill forId="calendar">
            <Animated.View style={[styles.container, style]}>{children()}</Animated.View>
        </Portal>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
        paddingHorizontal: UIConstant.contentOffset,
    },
}));

export function Calendar() {
    const { activeDayColumn, activeDayRow, daysMatrix, month, year, onSelect, onPrev, onNext } =
        useDaysCalendar();
    const [isMonthsVisible, setIsMonthsVisible] = React.useState(false);
    const [isYearsVisible, setIsYearsVisible] = React.useState(false);

    return (
        <>
            <Header
                title="Day"
                onPressMonth={() => setIsMonthsVisible(!isMonthsVisible)}
                onPressYear={() => setIsYearsVisible(!isYearsVisible)}
                onPrev={onPrev}
                onNext={onNext}
                month={isMonthsVisible ? undefined : month}
                year={isYearsVisible ? undefined : year}
            />
            <View style={styles.container}>
                <PortalManager id="calendar">
                    {daysMatrix.map((column, index) => (
                        <Column
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            id={index}
                            selected={index === activeDayColumn}
                            selectedRow={activeDayRow}
                            items={column}
                            onSelect={onSelect}
                        />
                    ))}
                    <UpperLayer visible={isMonthsVisible}>{() => null}</UpperLayer>
                    <UpperLayer visible={isYearsVisible}>{() => null}</UpperLayer>
                </PortalManager>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: UIConstant.contentOffset,
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    day: {
        paddingVertical: UIConstant.calendar.dayCellPadding,
        aspectRatio: 1,
        borderRadius: UIConstant.calendar.dayCellPaddingBorderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: UIConstant.contentOffset,
    },
});
