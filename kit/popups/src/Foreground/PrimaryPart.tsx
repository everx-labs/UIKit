import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type {
    PrimaryPartProps,
    SecondaryPartProps,
    ForegroundPrimaryElements,
    IconElement as IconElementType,
    ActionElement as ActionElementType,
} from './types';

export function PrimaryPart({ children }: PrimaryPartProps) {
    const [onActionPress, setOnActionPress] = React.useState<(() => void) | undefined>();

    const checkIfPressable = React.useCallback(function checkIfPressable(
        child: IconElementType | ForegroundPrimaryElements,
    ) {
        if (child.type.toString().includes(' ActionElement(')) {
            const actionElement = child as ActionElementType;
            if (!actionElement.props.disabled) {
                setOnActionPress(() => (child as ActionElementType).props.onPress);
            }
        }
    },
    []);

    React.useEffect(() => {
        React.Children.forEach(children, checkIfPressable);
    });

    return (
        <TouchableOpacity
            style={styles.primaryPart}
            disabled={!onActionPress}
            onPress={onActionPress}
        >
            {children}
        </TouchableOpacity>
    );
}
export function SecondaryPart({ children }: SecondaryPartProps) {
    return <View>{children}</View>;
}

const styles = StyleSheet.create({
    primaryPart: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
    },
});
