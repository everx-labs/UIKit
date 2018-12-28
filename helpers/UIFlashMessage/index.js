// this component isn't used now, all logic included into UINotice
import React, { Component } from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';

let masterRef = null;

export default class UIFlashMessage extends Component {
    static Position = {
        Bottom: 'bottom',
        Top: 'top',
    }

    static showMessage(messageObject, messageComponent) {
        masterRef.showMessage(messageObject, messageComponent);
    }

    constructor(props) {
        super(props);

        this.state = {
            messageComponent: null,
        };
    }

    componentDidMount() {
        masterRef = this;
    }

    componentWillUnmount() {
        masterRef = null;
    }

    // Setters
    setMessageComponent(messageComponent) {
        this.setState({ messageComponent });
    }

    // Getters
    getMessageComponent() {
        return this.state.messageComponent;
    }

    // Actions
    showMessage({
        position, animated, duration, autoHide,
    }, messageComponent) {
        this.setMessageComponent(messageComponent);
        showMessage({
            message: '', // unused but required param
            position,
            animated,
            duration,
            autoHide,
        });
    }

    // Render
    render() {
        return (
            <FlashMessage
                MessageComponent={() => this.getMessageComponent()}
            />
        );
    }
}
