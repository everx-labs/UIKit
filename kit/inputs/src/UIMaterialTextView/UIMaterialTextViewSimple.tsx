import * as React from 'react';
import { TextInput, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles, useTheme, Theme, ColorVariants } from '@tonlabs/uikit.themes';
import Animated from 'react-native-reanimated';
import { UITextView } from '../UITextView';

import type { UIMaterialTextViewLayoutProps } from './types';
import { UIMaterialTextViewComment } from './UIMaterialTextViewComment';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const UIMaterialTextViewSimple = React.forwardRef<TextInput, UIMaterialTextViewLayoutProps>(
    function UIMaterialTextViewSimpleForwarded(props: UIMaterialTextViewLayoutProps, passedRef) {
        const {
            onLayout,
            children,
            onMouseEnter,
            onMouseLeave,
            borderViewRef,
            isHovered,
            ...rest
        } = props;
        const theme = useTheme();

        const styles = useStyles(theme);

        return (
            <UIMaterialTextViewComment {...props}>
                <View
                    style={styles.container}
                    onLayout={onLayout}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    ref={borderViewRef}
                >
                    <Animated.View style={styles.input} /* layout={Layout} */>
                        <UITextViewAnimated
                            ref={passedRef}
                            {...rest}
                            placeholder={props.placeholder}
                            placeholderTextColor={
                                isHovered ? ColorVariants.TextSecondary : ColorVariants.TextTertiary
                            }
                            // layout={Layout}
                            scrollEnabled={false}
                        />
                    </Animated.View>
                    {children}
                </View>
            </UIMaterialTextViewComment>
        );
    },
);

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor: theme[ColorVariants.BackgroundBW],
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    input: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: UILayoutConstant.smallContentOffset,
    },
}));
