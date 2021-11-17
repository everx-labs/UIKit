import React from 'react';
import { Platform, StyleSheet, View, Modal, TextStyle } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';

import { UIColor } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

type Props = {
    visible: boolean;
    titleContent: string;
    textContent: string;
};

const waveConfig = {
    size: 40,
    count: 2,
};

export function UISpinnerOverlay({ visible = false, titleContent, textContent }: Props) {
    const renderTitleContent = React.useMemo(() => {
        const backgroundColor: TextStyle = {
            backgroundColor: !titleContent ? 'transparent' : 'white',
        };
        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.ParagraphText}
                style={[styles.titleContent, backgroundColor]}
            >
                {titleContent}
            </UILabel>
        );
    }, [titleContent]);

    const renderTextContent = React.useMemo(() => {
        const backgroundColor: TextStyle = {
            backgroundColor: !textContent ? 'transparent' : UIColor.primary(),
        };

        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.ParagraphText}
                style={[styles.textContent, backgroundColor]}
            >
                {textContent}
            </UILabel>
        );
    }, [textContent]);

    const renderSpinner = React.useMemo(() => {
        return (
            <View testID="spinner_loader" style={[styles.container]} key={`spinner~${Date.now()}`}>
                <View style={styles.background}>
                    <WaveIndicator color="white" size={waveConfig.size} count={waveConfig.count} />
                    <View style={styles.textContainer}>
                        {renderTitleContent}
                        {renderTextContent}
                    </View>
                </View>
            </View>
        );
    }, [renderTextContent, renderTitleContent]);

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
    textContainer: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    titleContent: {
        marginBottom: 80,
        textAlign: 'center',
        color: 'red',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        overflow: 'hidden',
    },
    textContent: {
        marginTop: 80,
        textAlign: 'center',
        color: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        overflow: 'hidden',
    },
});
