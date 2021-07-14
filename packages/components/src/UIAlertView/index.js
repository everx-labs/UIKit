// @flow
// @deprecated
import React from 'react';
import { StyleSheet, BackHandler, Platform } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { UIConstant } from '@tonlabs/uikit.core';
import { ColorVariants, Typography, TypographyVariants, useTheme } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    containerStyle: {
        borderRadius: UIConstant.mediumBorderRadius(),
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

type Props = {
    masterAlert: boolean,
};

type AlertButtons = { title: string, color?: ColorVariants, onPress?: () => void }[];

type State = {
    alertVisible: boolean,
    alertTitle: string,
    alertMessage: string,
    alertButtons: AlertButtons,
}

function Alert({
    cancelButton,
    confirmButton,
    onCancel,
    onConfirm,
    zIndex,
    visible,
    title,
    message,
}: *) {
    const theme = useTheme();
    return (
        <AwesomeAlert
            useNativeDriver
            alertContainerStyle={{ overflow: 'hidden', zIndex }}
            overlayStyle={[
                styles.overlayStyle,
                { backgroundColor: theme[ColorVariants.BackgroundOverlay] },
            ]}
            contentContainerStyle={[
                styles.containerStyle,
                { backgroundColor: theme[ColorVariants.BackgroundPrimary] },
            ]}
            show={visible}
            showProgress={false}
            title={title}
            message={message}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            titleStyle={[
                styles.titleStyle,
                Typography[TypographyVariants.TitleSmall],
                { color: theme[ColorVariants.TextPrimary]}
            ]}
            messageStyle={[
                styles.messageStyle,
                Typography[TypographyVariants.ParagraphNote],
                { color: theme[ColorVariants.TextPrimary] }
            ]}
            showCancelButton={!!cancelButton}
            showConfirmButton={!!confirmButton}
            cancelText={cancelButton && cancelButton.title}
            confirmText={confirmButton && confirmButton.title}
            cancelButtonStyle={styles.buttonStyle}
            confirmButtonStyle={styles.buttonStyle}
            cancelButtonTextStyle={[
                styles.buttonTextStyle,
                Typography[TypographyVariants.Action],
                cancelButton && cancelButton.color
                    ? { color: theme[cancelButton.color] }
                    : { color: theme[ColorVariants.TextAccent] },
            ]}
            confirmButtonTextStyle={[
                styles.buttonTextStyle,
                Typography[TypographyVariants.Action],
                confirmButton && confirmButton.color
                    ? { color: theme[confirmButton.color] }
                    : { color: theme[ColorVariants.TextAccent] },
            ]}
            cancelButtonColor="transparent"
            confirmButtonColor="transparent"
            onCancelPressed={onCancel}
            onConfirmPressed={onConfirm}
        />
    );
}

export default class UIAlertView extends UIComponent<Props, State> {
    // Pick `zIndex` for UIAlertView thus to overlap all components
    // http://softwareas.com/whats-the-maximum-z-index/ (as per Safari 0-3 threshold)
    static zIndex = 16777271;

    static showAlert(alertTitle: string, alertMessage: string, alertButtons: AlertButtons) {
        if (masterRef) {
            masterRef.showAlert(alertTitle, alertMessage, alertButtons);
        }
    }

    static hideAlert() {
        if (masterRef) {
            masterRef.hideAlert();
        }
    }

    static defaultProps = {
        masterAlert: true,
    };

    // constructor
    constructor(props: Props) {
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

    onConfirmPressed = () => {
        this.hideAlert();

        const confirmButton = this.state.alertButtons[1];
        if (confirmButton && confirmButton.onPress) {
            confirmButton.onPress();
        }
    };

    // actions
    showAlert(alertTitle: string, alertMessage: string, alertButtons: AlertButtons) {
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
        const {
            alertVisible,
            alertTitle,
            alertMessage,
            alertButtons: [ cancelButton, confirmButton ],
        } = this.state;
        return (
            <Alert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                zIndex={UIAlertView.zIndex}
                cancelButton={cancelButton}
                confirmButton={confirmButton}
                onCancel={this.onCancelPressed}
                onConfirm={this.onConfirmPressed}
            />
        );
    }
}
