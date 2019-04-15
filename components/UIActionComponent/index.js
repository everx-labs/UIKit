// @flow
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import UIComponent from '../UIComponent';
import type { EventProps } from '../../types';

export type ActionState = {
    tapped: boolean,
    hover: boolean,
}

export type ActionProps = {
    testId: string,
    disabled?: boolean,
    showIndicator?: boolean,
    onPress: () => void,
};

export default class UIActionComponent<Props, State>
    extends UIComponent<any & ActionProps, any & ActionState> {
    constructor(props: any & ActionProps) {
        super(props);

        this.state = {
            tapped: false,
            hover: false,
        };
    }

    // Setters
    setTapped(tapped: boolean = true) {
        this.setStateSafely({ tapped });
    }

    setHover(hover: boolean = true) {
        this.setStateSafely({ hover });
    }

    // Getters
    isTapped() {
        return this.state.tapped;
    }

    isHover() {
        return this.state.hover;
    }

    isDisabled() {
        return this.props.disabled;
    }

    shouldShowIndicator() {
        return this.props.showIndicator;
    }

    // Render
    // Virtual
    renderContent(): React$Node {
        return null;
    }

    render(): React$Node {
        const { onPress, testID } = this.props;
        const eventProps: EventProps = {
            onMouseEnter: () => this.setHover(),
            onMouseLeave: () => this.setHover(false),
        };
        const testIDProp = testID ? { testID } : null;
        return (
            <TouchableWithoutFeedback
                {...testIDProp}
                disabled={this.isDisabled() || this.shouldShowIndicator()}
                onPress={onPress}
                onPressIn={() => this.setTapped()}
                onPressOut={() => this.setTapped(false)}
                {...eventProps}
            >
                {this.renderContent()}
            </TouchableWithoutFeedback>
        );
    }

    static defaultProps: Props;
}

UIActionComponent.defaultProps = {
    testId: '',
    disabled: false,
    showIndicator: false,
    onPress: () => {},
};
