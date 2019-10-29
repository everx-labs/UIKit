// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { Platform, StyleSheet, View, Text, Modal } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';

import UIStyle from '../../helpers/UIStyle';
import UIColor from '../../helpers/UIColor';
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
}

type State = {
    titleContent: string,
    textContent: string,
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
            titleContent: this.props.titleContent,
            textContent: this.props.textContent,
            visible: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterSpinner) {
            masterRef = this;
        }
        this.processProps(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.processProps(nextProps);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterSpinner) {
            masterRef = null;
        }
    }

    // Setters
    setTitleContent(titleContent: string) {
        this.setStateSafely({ titleContent });
    }

    setTextContent(textContent: string) {
        this.setStateSafely({ textContent });
    }

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

    // Processing
    processProps(props: Props) {
        this.setTitleContent(props.titleContent);
        this.setTextContent(props.textContent);
    }

    // Render
    renderTitleContent() {
        return (
            <Text
                style={[
                    UIStyle.text.primaryBodyRegular(),
                    styles.titleContent,
                    this.props.titleStyle,
                    {
                        backgroundColor: !this.state.titleContent
                            ? 'transparent'
                            : 'white',
                    },
                ]}
            >
                {this.state.titleContent}
            </Text>
        );
    }

    renderTextContent() {
        return (
            <Text
                style={[
                    UIStyle.text.primaryBodyRegular(),
                    styles.textContent,
                    this.props.textStyle,
                    {
                        backgroundColor: !this.state.textContent
                            ? 'transparent'
                            : UIColor.primary(),
                    },
                ]}
            >
                {this.state.textContent}
            </Text>
        );
    }

    renderContent() {
        return (
            <View style={styles.background}>
                <WaveIndicator
                    color={this.props.color}
                    size={this.props.size}
                    count={2}
                />
                <View style={styles.textContainer}>
                    {this.renderTitleContent()}
                    {this.renderTextContent()}
                </View>
            </View>);
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
