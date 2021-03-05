import * as React from 'react';
import {
    requireNativeComponent,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from 'react-native';

type Props = {
    // eslint-disable-next-line react/no-unused-prop-types
    style: StyleProp<ViewStyle>;
    children: React.ReactNode;
};

const NativeUIInputAccessoryView = requireNativeComponent<Props>(
    'UIInputAccessoryView',
);

export function UIInputAccessoryView({ children }: Props) {
    return (
        <NativeUIInputAccessoryView style={styles.container}>
            {children}
        </NativeUIInputAccessoryView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});
