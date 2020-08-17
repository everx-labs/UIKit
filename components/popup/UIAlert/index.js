// @flow
import React from 'react';
import { View, StyleSheet, Keyboard, Animated } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UILabel from '../../text/UILabel';
import UITextButton from '../../buttons/UITextButton';

export type UIAlertButton = {
    title: string,
    onPress: () => void,
};

export type UIAlertContent = {
    title?: string,
    description?: string,
    buttons: [{ buttonA: UIAlertButton, buttonB?: UIAlertButton }],
};

type Props = {
    /**
    @default true
    */
    masterAlert: boolean,

    /**
    @default null
    */
   content: ?UIAlertContent,

   /**
    @default null
    */
   isVisible?: boolean,
};

type State = {
    isVisible: boolean,
    content: ?UIAlertContent,
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.overlay60(),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 16777271,
    },
    alert: {
        flexShrink: 1,
        width: UIConstant.alertWidth(),
        borderRadius: UIConstant.alertBorderRadius(),
        backgroundColor: UIColor.backgroundPrimary(),
        padding: UIConstant.mediumContentOffset(),
    },
});

let masterRef = null;
export default class UIAlert extends UIComponent<Props, State> {
    static defaultProps: Props = {
        masterAlert: true,
        content: null,
    };

    static showAlert(alertContent: UIAlertContent) {
        if (masterRef) {
            masterRef.showAlert(alertContent);
        }
    }

    static hideAlert() {
        if (masterRef) {
            masterRef.hideAlert();
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            content: null,
            isVisible: false,
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

    componentDidUpdate(oldProps: Props) {
        if (this.props.isVisible !== oldProps.isVisible) {
            if (this.props.isVisible) {
                if (this.props.content) {
                    this.showAlert(this.props.content);
                }
            } else {
                this.hideAlert();
            }
        }
    }

    isAlertVisible(): boolean {
        return this.props.isVisible || this.state.isVisible;
    }

    getAlertContent(): ?UIAlertContent {
        return this.props.content || this.state.content;
    }

    showAlert(content: UIAlertContent) {
        Keyboard.dismiss();
        this.setStateSafely({ content, isVisible: true }, () => {
            this.alertAnimation();
        });
    }

    hideAlert() {
        this.alertAnimation(
            false,
            () => {
                this.setStateSafely({ isVisible: false });
            },
        );
    }

    animatedValue = new Animated.Value(0.01);
    alertAnimation(appear: boolean = true, callback: () => void = () => {}) {
        Animated.spring(this.animatedValue, {
            toValue: appear ? 1.0 : 0.01,
            useNativeDriver: true,
        }).start(() => {
            callback();
        });
    }

    renderTitle() {
        const content = this.getAlertContent();
        if (!content?.title) {
            return null;
        }

        return (
            <UILabel
                style={UIStyle.margin.bottomSmall()}
                role={UILabel.Role.AlertTitle}
                text={content?.title}
            />
        );
    }

    renderDescription() {
        const content = this.getAlertContent();
        if (!content?.description) {
            return null;
        }

        return (
            <UILabel
                style={UIStyle.margin.bottomSmall()}
                role={UILabel.Role.DescriptionSmall}
                text={content?.description}
            />
        );
    }

    renderButtons() {
        const content = this.getAlertContent();
        if (!content) {
            return null;
        }

        const btnRows = [];

        const { buttons } = content;
        buttons.forEach((row, index) => {
            const btns = [];
            btns.push(<UITextButton
                align={UITextButton.align.center}
                title={row.buttonA.title}
                buttonStyle={UIStyle.common.flex()}
                onPress={() => { row.buttonA.onPress(); this.hideAlert(); }}
                key={`alert_rowOfButtons_${index}_buttonA`}
            />);
            if (row.buttonB) {
                const cb = row.buttonB.onPress;
                btns.push(<UITextButton
                    align={UITextButton.align.center}
                    title={row.buttonB.title}
                    buttonStyle={UIStyle.common.flex()}
                    onPress={() => { cb(); this.hideAlert(); }}
                    key={`alert_rowOfButtons_${index}_buttonB`}
                />);
            }
            btnRows.push(<View style={UIStyle.common.flexRow()} key={`alert_rowOfButtons_${index}`}>
                {btns}
            </View>);
        });

        return (
            <View style={[UIStyle.common.flexColumn(), UIStyle.margin.topSmall()]}>
                {btnRows}
            </View>
        );
    }

    render() {
        if (!this.isAlertVisible()) {
            return null;
        }

        const animation = { transform: [{ scale: this.animatedValue }] };
        return (
            <View style={[UIStyle.container.absoluteFill(), styles.container]}>
                <Animated.View style={[styles.alert, animation]}>
                    {this.renderTitle()}
                    {this.renderDescription()}
                    {this.renderButtons()}
                </Animated.View>
            </View>
        );
    }
}
