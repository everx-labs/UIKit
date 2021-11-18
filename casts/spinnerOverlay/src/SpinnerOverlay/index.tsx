import React from 'react';
import { Platform, StyleSheet, View, Modal } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';

type Props = {
    visible: boolean;
};

const waveConfig = {
    size: 40,
    count: 2,
};

export function UISpinnerOverlay({ visible = false }: Props) {
    const renderSpinner = React.useMemo(() => {
        return (
            <View testID="spinner_loader" style={[styles.container]} key={`spinner~${Date.now()}`}>
                <WaveIndicator color="white" size={waveConfig.size} count={waveConfig.count} />
            </View>
        );
    }, []);

    if (!visible) {
        return null;
    }

    if (Platform.OS === 'web') {
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
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
