import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, Text, Modal } from 'react-native';
import StylePropType from 'react-style-proptype';
import { WaveIndicator } from 'react-native-indicators';

import UITextStyle from '../../helpers/UITextStyle';
import UIColor from '../../helpers/UIColor';

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

export default class UISpinnerOverlay extends Component {
    static show() {
        if (masterRef) {
            masterRef.setVisible(true);
        }
    }

    static hide() {
        if (masterRef) {
            masterRef.setVisible(false);
        }
    }

    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            titleContent: this.props.titleContent,
            textContent: this.props.textContent,
            visible: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.masterSpinner) {
            masterRef = this;
        }
        this.processProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.processProps(nextProps);
    }

    componentWillUnmount() {
        if (this.props.masterSpinner) {
            masterRef = null;
        }
        this.mounted = false;
    }

    // Setters
    setTitleContent(titleContent) {
        if (!this.mounted) {
            return;
        }
        this.setState({
            titleContent,
        });
    }

    setTextContent(textContent) {
        if (!this.mounted) {
            return;
        }
        this.setState({
            textContent,
        });
    }

    setVisible(visible) {
        this.setState({ visible });
    }

    // Getters
    getVisible() {
        return this.state.visible;
    }

    // Processing
    processProps(props) {
        this.setTitleContent(props.titleContent);
        this.setTextContent(props.textContent);
        this.setVisible(props.visible);
    }

    // Render
    renderTitleContent() {
        return (
            <Text
                style={[
                    UITextStyle.primaryBodyRegular,
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
                    UITextStyle.primaryBodyRegular,
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
        if (!this.getVisible()) {
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

UISpinnerOverlay.defaultProps = {
    visible: false,
    modal: false,
    titleContent: '',
    textContent: '',
    color: 'white',
    size: 40, // dafault for Indicator
    overlayColor: 'rgba(0,0,0,0.15)',
    titleStyle: {},
    textStyle: {},
    containerStyle: {},
    masterSpinner: false,
};

UISpinnerOverlay.propTypes = {
    visible: PropTypes.bool,
    modal: PropTypes.bool,
    titleContent: PropTypes.string,
    textContent: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    overlayColor: PropTypes.string,
    titleStyle: StylePropType,
    textStyle: StylePropType,
    containerStyle: StylePropType,
    masterSpinner: PropTypes.bool,
};
