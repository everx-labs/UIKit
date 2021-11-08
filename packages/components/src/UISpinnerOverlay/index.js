// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { Platform, StyleSheet, View, Modal } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';

import { UIColor } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';

import UIComponent from '../UIComponent';

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
        // height: 50,
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
        // height: 50,
        textAlign: 'center',
        color: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        overflow: 'hidden',
    },
});

let masterRef = null;

type Props = {
    visible: boolean,
    modal: boolean,
    titleContent: string,
    textContent: string,
    color: string,
    size: number,
    overlayColor: string,
    titleStyle: ViewStyleProp,
    textStyle: ViewStyleProp,
    containerStyle: ViewStyleProp,
    masterSpinner: boolean,
};

type State = {
    visible: boolean,
};

export default class UISpinnerOverlay extends UIComponent<Props, State> {
    static defaultProps: Props = {
        visible: false,
        modal: false,
        titleContent: '',
        textContent: '',
        color: 'white',
        size: 40, // default for Indicator
        overlayColor: 'rgba(0,0,0,0.15)',
        titleStyle: {},
        textStyle: {},
        containerStyle: {},
        masterSpinner: false,
    };

    static show() {
        if (masterRef) {
            masterRef.show();
        }
    }

    static hide() {
        if (masterRef) {
            masterRef.hide();
        }
    }

    // Constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            visible: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterSpinner) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterSpinner) {
            masterRef = null;
        }
    }

    // Setters
    setVisible(visible: boolean = true) {
        this.setStateSafely({ visible });
    }

    // Getters
    getVisible() {
        return this.state.visible;
    }

    // Actions
    show() {
        this.setVisible();
    }

    hide() {
        this.setVisible(false);
    }

    // Render
    renderTitleContent() {
        const { titleContent } = this.props;
        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.ParagraphText}
                style={[
                    styles.titleContent,
                    this.props.titleStyle,
                    {
                        backgroundColor: !titleContent ? 'transparent' : 'white',
                    },
                ]}
            >
                {titleContent}
            </UILabel>
        );
    }

    renderTextContent() {
        const { textContent } = this.props;
        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.ParagraphText}
                style={[
                    styles.textContent,
                    this.props.textStyle,
                    {
                        backgroundColor: !textContent ? 'transparent' : UIColor.primary(),
                    },
                ]}
            >
                {textContent}
            </UILabel>
        );
    }

    renderContent() {
        return (
            <View style={styles.background}>
                <WaveIndicator color={this.props.color} size={this.props.size} count={2} />
                <View style={styles.textContainer}>
                    {this.renderTitleContent()}
                    {this.renderTextContent()}
                </View>
            </View>
        );
    }

    renderSpinner() {
        return (
            <View
                testID="spinner_loader"
                style={[
                    styles.container,
                    this.props.containerStyle,
                    { backgroundColor: this.props.overlayColor },
                ]}
                key={`spinner~${Date.now()}`}
            >
                {this.renderContent()}
            </View>
        );
    }

    render() {
        if (!this.getVisible() && !this.props.visible) {
            return null;
        }
        if (Platform.OS === 'web' || !this.props.modal) {
            return this.renderSpinner();
        }
        return (
            <Modal
                supportedOrientations={['landscape', 'portrait']}
                hardwareAccelerated
                transparent
                visible={this.getVisible()}
            >
                {this.renderSpinner()}
            </Modal>
        ); // onRequestClose={() => this.close()}
    }
}
