// @flow
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import UIPureComponent from '../UIPureComponent';

export type ActionState = {
    tapped: boolean,
    hover: boolean,
}

export type ActionProps = {
    testID?: string,
    disabled?: boolean,
    showIndicator?: boolean,
    onPress?: ?() => void,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
};

export default class UIActionComponent<Props, State>
    extends UIPureComponent<any & ActionProps, any & ActionState> {
    constructor(props: any & ActionProps) {
        super(props);

        this.state = {
            tapped: false,
            hover: false,
        };
    }

    // Events
    onPressIn = () => {
        this.setTapped();
        this.onTappedIn();
    };

    onPressOut = () => {
        this.setTapped(false);
        this.onTappedOut();
    };

    onPress = () => {
        this.onPressed();
        if (this.props.onPress) {
            this.props.onPress();
        }
    };

    onMouseEnter = () => {
        this.setHover();
        this.onEnter();
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter();
        }
    };

    onMouseLeave = () => {
        this.setHover(false);
        this.onLeave();
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave();
        }
    };

    // Virtual
    onEnter = (): void => {
    };

    onLeave = (): void => {
    };

    onPressed = (): void => {
    };

    onTappedIn = (): void => {
    };

    onTappedOut = (): void => {
    };

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
    renderContent(): React$Element<any> {
        throw new Error('Not implemented method `renderContent` of UIActionComponent');
    }

    render(): React$Node {
        const { onPress, testID } = this.props;

        const testIDProp = testID ? { testID } : null;

        const element = this.renderContent();

        return (
            <TouchableWithoutFeedback
                {...testIDProp}
                disabled={this.isDisabled() || this.shouldShowIndicator() || !onPress}
                onPress={this.onPress}
                onPressIn={this.onPressIn}
                onPressOut={this.onPressOut}
            >
                {React.cloneElement(element, {
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave,
                    style: [element.props.style, {
                        cursor: 'pointer',
                        touchAction: 'manipulation',
                    }],
                })}
            </TouchableWithoutFeedback>
        );
    }

    static defaultProps: Props;
}

UIActionComponent.defaultProps = {
    testID: '',
    disabled: false,
    showIndicator: false,
    onPress: null,
};
