// @flow
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import UIComponent from '../UIComponent';
import type EventProps from '../../types';

type ActionState = {
    tapped: boolean,
    hover: boolean,
}

class UIActionComponent<Props, State> extends UIComponent<Props, any & ActionState> {
    constructor(props: Props) {
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

    // Render
    // Virtual
    renderContent() {
        return null;
    }

    render(): React$Node {
        const eventProps: EventProps = {
            onMouseEnter: () => this.setHover(),
            onMouseLeave: () => this.setHover(false),
        };
        return (
            <TouchableWithoutFeedback
                onPressIn={() => this.setTapped()}
                onPressOut={() => this.setTapped(false)}
                {...eventProps}
            >
                {this.renderContent()}
            </TouchableWithoutFeedback>
        );
    }
}

export default UIActionComponent;
