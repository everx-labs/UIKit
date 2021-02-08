import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';

import { ColorVariants, useTheme } from './Colors'

import { UIConstant } from './constants';

const checked = require('../assets/icons/checkbox/checkbox-on.png');
const unchecked = require('../assets/icons/checkbox/checkbox-off.png');

type UICheckboxProps = {
    editable?: boolean,
    selected: boolean,
    onPress?: () => void,
    containerStyle?: ViewStyle,
};

const getImage = (
    selected: boolean,
): ImageSourcePropType => {
    if (selected) {
        return checked;
    }
    return unchecked;
};

const getTintColor = (
    editable: boolean,
    selected: boolean,
): ColorVariants => {
    if (editable) {
        if (selected) {
            return ColorVariants.TextPrimary;
        }
        return ColorVariants.TextTertiary;
    }
    return ColorVariants.TextNeutral;
};

export function UICheckbox({
    editable = true,
    selected = false,
    onPress,
    containerStyle,
}: UICheckboxProps) {
    const theme = useTheme();

    const renderCheckbox = React.useMemo(() => {
            return (
                <Image
                    source={getImage(selected)}
                    style={[
                        styles.checkbox,
                        {
                            tintColor: theme[getTintColor(editable, selected)],
                        }
                    ]}
                />
            );
        }, [theme, editable, selected]
    );

    if (onPress && editable) {
        return (
            <View style={containerStyle}>
                <TouchableWithoutFeedback onPress={onPress}>
                    {renderCheckbox}
                </TouchableWithoutFeedback>
            </View>
        );
    }

    return (
        <View style={containerStyle}>
            {renderCheckbox}
        </View>
    );
}

const styles = StyleSheet.create({
    checkbox: {
        width: UIConstant.iconSize,
        height: UIConstant.iconSize,
    },
});
