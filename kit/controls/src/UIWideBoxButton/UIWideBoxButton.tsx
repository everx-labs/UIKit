import * as React from 'react';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { StyleSheet, View } from 'react-native';
import { Pressable } from '../Pressable';
import type { UIWideBoxButtonProps } from './types';
import { UIWideBoxButtonSecondary } from './content/UIWideBoxButtonSecondary';
import { Caption } from './Caption';
import { UIWideBoxButtonType } from './constants';
import { UIWideBoxButtonPrimary } from './content/UIWideBoxButtonPrimary';
import { UIWideBoxButtonNulled } from './content/UIWideBoxButtonNulled';

export function UIWideBoxButton(props: UIWideBoxButtonProps) {
    const {
        type = UIWideBoxButtonType.Primary,
        caption,
        onPress,
        disabled,
        layout,
        loading,
        testID,
    } = props;

    const Content = React.useMemo(
        function Content() {
            switch (type) {
                case UIWideBoxButtonType.Secondary:
                    return UIWideBoxButtonSecondary;
                case UIWideBoxButtonType.Nulled:
                    return UIWideBoxButtonNulled;
                case UIWideBoxButtonType.Primary:
                default:
                    return UIWideBoxButtonPrimary;
            }
        },
        [type],
    );
    if (type === UIWideBoxButtonType.Nulled) {
        return (
            <Pressable
                testID={testID}
                disabled={disabled}
                loading={loading}
                onPress={onPress}
                style={[style.container, layout]}
            >
                <Content {...props} />
                <Caption title={caption} wideBoxButtonType={type} />
            </Pressable>
        );
    }
    return (
        <View style={style.container}>
            <Pressable testID={testID} disabled={disabled} loading={loading} onPress={onPress}>
                <Content {...props} />
            </Pressable>
            <Caption title={caption} wideBoxButtonType={type} />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        borderRadius: UILayoutConstant.alertBorderRadius,
    },
});
