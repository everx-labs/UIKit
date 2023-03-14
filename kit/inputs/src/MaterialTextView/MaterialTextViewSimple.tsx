import * as React from 'react';
import { Platform, TextStyle, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated from 'react-native-reanimated';
import { UITextView, UITextViewRef } from '../UITextView';

import type { BackgroundColors, MaterialTextViewLayoutProps } from './types';
import { MaterialTextViewComment } from './MaterialTextViewComment';
import { defaultBackgroundColors } from './constants';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const MaterialTextViewSimple = React.forwardRef<UITextViewRef, MaterialTextViewLayoutProps>(
    function MaterialTextViewSimpleForwarded(props: MaterialTextViewLayoutProps, passedRef) {
        const {
            children,
            onMouseEnter,
            onMouseLeave,
            borderViewRef,
            isHovered,
            backgroundColors = defaultBackgroundColors,
            ...rest
        } = props;
        const { editable = true } = rest;
        const theme = useTheme();

        const styles = useStyles(theme, editable, backgroundColors);

        return (
            <MaterialTextViewComment {...props}>
                <View
                    style={styles.container}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    ref={borderViewRef}
                >
                    <Animated.View style={styles.inputContainer} /* layout={Layout} */>
                        <UITextViewAnimated
                            ref={passedRef}
                            {...rest}
                            placeholder={props.placeholder}
                            placeholderTextColor={
                                isHovered && editable
                                    ? ColorVariants.TextSecondary
                                    : ColorVariants.TextTertiary
                            }
                            style={styles.input}
                        />
                    </Animated.View>
                    {children}
                </View>
            </MaterialTextViewComment>
        );
    },
);

const useStyles = makeStyles(
    (theme: Theme, editable: boolean, backgroundColors: BackgroundColors) => ({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: UILayoutConstant.input.borderRadius,
            backgroundColor: editable
                ? theme[backgroundColors.regular]
                : theme[backgroundColors.disabled],
            paddingHorizontal: UILayoutConstant.contentOffset,
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: UILayoutConstant.contentInsetVerticalX4,
            paddingRight: UILayoutConstant.smallContentOffset,
        },
        input: {
            ...Platform.select({
                web: {
                    ...(!editable ? ({ cursor: 'default' } as TextStyle) : null),
                },
            }),
        },
    }),
);
