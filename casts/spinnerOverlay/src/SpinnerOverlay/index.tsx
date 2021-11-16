import React from 'react';
import { Platform, StyleSheet, View, Modal } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';

type Props = {
    visible: boolean;
    modal: boolean;
    color: string;
    size: number;
    overlayColor: string;
};

export function UISpinnerOverlay({
    visible = false,
    modal = false,
    color = 'white',
    size = 40,
    overlayColor = 'rgba(0,0,0,0.15)',
}: Props) {
    const renderSpinner = React.useMemo(() => {
        return (
            <View
                testID="spinner_loader"
                style={[styles.container, { backgroundColor: overlayColor }]}
                key={`spinner~${Date.now()}`}
            >
                <View style={styles.background}>
                    <WaveIndicator color={color} size={size} count={2} />
                </View>
            </View>
        );
    }, [color, overlayColor, size]);

    if (!visible) {
        return null;
    }

    if (Platform.OS === 'web' || !modal) {
        return renderSpinner;
    }

    return (
        <Modal
            supportedOrientations={['landscape', 'portrait']}
            hardwareAccelerated
            transparent
            visible={visible}
        >
            {renderSpinner}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
