import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, BackHandler, Platform } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import UIColor from '../../../helpers/UIColor';
import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    containerStyle: {
        borderRadius: UIConstant.smallBorderRadius(),
        paddingTop: UIConstant.smallContentOffset(),
        paddingHorizontal: UIConstant.contentOffset(),
        paddingBottom: 0,
    },
    overlayStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: null,
        height: null,
        backgroundColor: UIColor.overlay60(),
    },
    titleStyle: {
        paddingVertical: UIConstant.smallContentOffset(),
        textAlign: 'center',
    },
    messageStyle: {
        paddingVertical: UIConstant.smallContentOffset(),
        textAlign: 'center',
    },
    buttonStyle: {
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        margin: 0,
        paddingHorizontal: 0,
    },
    buttonTextStyle: {
        textAlign: 'center',
    },
});

let masterRef = null;

export default class UIAlertView extends UIComponent {
    // Pick `zIndex` for UIAlertView thus to overlap all components
    // http://softwareas.com/whats-the-maximum-z-index/ (as per Safari 0-3 threshold)
    static zIndex = 16777271;

    static showAlert(alertTitle, alertMessage, alertButtons) {
        if (masterRef) {
            masterRef.showAlert(alertTitle, alertMessage, alertButtons);
        }
    }

    static hideAlert() {
        if (masterRef) {
            masterRef.hideAlert();
        }
    }

    // constructor
    constructor(props) {
        super(props);

        this.state = {
            alertVisible: false,
            alertTitle: '',
            alertMessage: '',
            alertButtons: [],
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.masterAlert) {
            masterRef = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.masterAlert) {
            masterRef = null;
        }
    }

    // Back button
    backHandler: any;
    startListeningToBackButton() {
        if (Platform.OS !== 'android') {
            return;
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.onCancelPressed();
            return true;
        });
    }

    stopListeningToBackButton() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    onCancelPressed = () => {
        this.hideAlert();

        const cancelButton = this.state.alertButtons[0];
        if (cancelButton && cancelButton.onPress) {
            cancelButton.onPress();
        }
    };

    // actions
    showAlert(alertTitle, alertMessage, alertButtons) {
        this.startListeningToBackButton();
        this.setState({
            alertVisible: true, alertTitle, alertMessage, alertButtons,
        });
    }

    hideAlert() {
        this.stopListeningToBackButton();
        this.setState({ alertVisible: false });
    }

    // render
    render() {
        const cancelButton = this.state.alertButtons[0];
        const confirmButton = this.state.alertButtons[1];
        const { primaryBodyBold, secondarySmallRegular, actionSmallMedium } = UITextStyle;
        const {
            overlayStyle, containerStyle, titleStyle, messageStyle, buttonStyle, buttonTextStyle,
        } = styles;
        return (<AwesomeAlert
            useNativeDriver
            alertContainerStyle={{ overflow: 'hidden', zIndex: UIAlertView.zIndex }}
            overlayStyle={overlayStyle}
            contentContainerStyle={containerStyle}
            show={this.state.alertVisible}
            showProgress={false}
            title={this.state.alertTitle}
            message={this.state.alertMessage}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            titleStyle={[primaryBodyBold, titleStyle]}
            messageStyle={[secondarySmallRegular, messageStyle]}
            // closeOnTouchOutside={false}
            // closeOnHardwareBackPress={false}
            showCancelButton={!!cancelButton}
            showConfirmButton={!!confirmButton}
            cancelText={cancelButton && cancelButton.title}
            confirmText={confirmButton && confirmButton.title}
            cancelButtonStyle={buttonStyle}
            confirmButtonStyle={buttonStyle}
            cancelButtonTextStyle={[
                actionSmallMedium,
                buttonTextStyle,
                (cancelButton && cancelButton.color ? { color: cancelButton.color } : {}),
            ]}
            confirmButtonTextStyle={[
                actionSmallMedium,
                buttonTextStyle,
                (confirmButton && confirmButton.color ? { color: confirmButton.color } : {}),
            ]}
            cancelButtonColor="transparent"
            confirmButtonColor="transparent"
            onCancelPressed={this.onCancelPressed}
            onConfirmPressed={() => {
                this.hideAlert();

                if (confirmButton && confirmButton.onPress) {
                    confirmButton.onPress();
                }
            }}
        />);
    }
}

UIAlertView.defaultProps = {
    masterAlert: true,
};

UIAlertView.propTypes = {
    masterAlert: PropTypes.bool,
};
