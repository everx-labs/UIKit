import * as React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
    isVisible: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

export const ResourceSavingScene = ({ isVisible, children, style }: Props) => {
    return (
        <View
            style={[
                styles.container,
                Platform.OS === 'web' ? { display: isVisible ? 'flex' : 'none' } : null,
                style,
            ]}
            collapsable={false}
            removeClippedSubviews={
                // On iOS, set removeClippedSubviews to true only when not focused
                // This is an workaround for a bug where the clipped view never re-appears
                Platform.OS === 'ios' ? !isVisible : true
            }
            pointerEvents={isVisible ? 'auto' : 'none'}
            accessibilityElementsHidden={!isVisible}
            importantForAccessibility={isVisible ? 'auto' : 'no-hide-descendants'}
        >
            <View style={isVisible ? styles.attached : styles.detached}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    attached: {
        flex: 1,
    },
    detached: {
        flex: 1,
        top: FAR_FAR_AWAY,
    },
});
