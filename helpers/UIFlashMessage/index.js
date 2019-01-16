// this component isn't used now, all logic included into UINotice
import React from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import UIComponent from '../../components/UIComponent';

let masterRef = null;

export default class UIFlashMessage extends UIComponent {
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
        super.componentDidMount();
        masterRef = this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        masterRef = null;
    }

    // Setters
    setMessageComponent(messageComponent) {
        this.setStateSafely({ messageComponent });
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
