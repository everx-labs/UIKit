// @flow
import React from 'react';
import { View, StyleSheet, Keyboard, Animated } from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UIBoxButton,
    UIBoxButtonType,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

export type UIAlertButton = {
    title: string,
    onPress: () => void,
};

export type UIAlertContent = {
    title?: string,
    description?: string,
    buttons: UIAlertButton[][],
};

type Props = {
    /**
    @default true
    */
    shared: boolean,

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

const AnimatedUIBackgroundView = Animated.createAnimatedComponent(
    UIBackgroundView,
);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 16777271,
    },
    alert: {
        flexShrink: 1,
        width: UIConstant.alertWidth(),
        borderRadius: UIConstant.mediumBorderRadius(),
        padding: UIConstant.mediumContentOffset(),
    },
});

const smallScale = 0.01;
const fullScale = 1.0;

let sharedRef = null;
export default class UIAlert extends UIComponent<Props, State> {
    static defaultProps: Props = {
        shared: true,
        content: null,
    };

    static showAlert(alertContent: UIAlertContent) {
        if (sharedRef) {
            sharedRef.showAlert(alertContent);
        }
    }

    static hideAlert() {
        if (sharedRef) {
            sharedRef.hideAlert();
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
        if (this.props.shared) {
            sharedRef = this;
        }
        this.showIfNeeded();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.shared) {
            sharedRef = null;
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isVisible !== prevProps.isVisible) {
            this.showIfNeeded();
        }
    }

    isAlertVisible(): boolean {
        return this.props.isVisible || this.state.isVisible;
    }

    getAlertContent(): ?UIAlertContent {
        return this.props.content || this.state.content;
    }

    canShowAlert(): boolean {
        const content = this.getAlertContent();
        const btns = content?.buttons;
        let canShow = false;

        if (content?.title?.length || content?.description?.length) {
            if (btns) {
                for (let i = 0; i < btns.length; i += 1) {
                    const row = btns[i];
                    if (row.length > 0) {
                        canShow = true;
                        break;
                    }
                }
            }
        }

        return canShow;
    }

    showIfNeeded() {
        if (this.props.isVisible) {
            if (this.props.content) {
                this.showAlert(this.props.content);
            }
        } else {
            this.hideAlert();
        }
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

    animatedValue = new Animated.Value(smallScale);
    alertAnimation(appear: boolean = true, callback: () => void = () => {}) {
        Animated.spring(this.animatedValue, {
            toValue: appear ? fullScale : smallScale,
            useNativeDriver: true,
        }).start(callback);
    }

    renderTitle() {
        const content = this.getAlertContent();
        if (!content?.title) {
            return null;
        }

        return (
            <UILabel
                color={UILabelColors.TextPrimary}
                role={UILabelRoles.HeadlineHead}
                style={UIStyle.margin.bottomSmall()}
            >
                {content?.title}
            </UILabel>
        );
    }

    renderDescription() {
        const content = this.getAlertContent();
        if (!content?.description) {
            return null;
        }

        return (
            <UILabel
                color={UILabelColors.TextSecondary}
                role={UILabelRoles.ParagraphNote}
                style={UIStyle.margin.bottomSmall()}
            >
                {content?.description}
            </UILabel>
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
            row.forEach((buttonInRow, btnIndex) => {
                btns.push(
                    <UIBoxButton
                        testID={`UIAlert_Button_${buttonInRow.title}`}
                        title={buttonInRow.title}
                        type={UIBoxButtonType.Tertiary}
                        onPress={() => { buttonInRow.onPress(); this.hideAlert(); }}
                        key={`alert_rowOfButtons_${index}_${btnIndex}`}
                    />
                );
            });
            btnRows.push((
                <View style={UIStyle.common.flexRow()} key={`alert_rowOfButtons_${index}`}>
                    {btns}
                </View>
            ));
        });

        return (
            <View style={[UIStyle.common.flexColumn(), UIStyle.margin.topSmall()]}>
                {btnRows}
            </View>
        );
    }

    render() {
        if (!this.isAlertVisible() || !this.canShowAlert()) {
            return null;
        }

        const animation = { transform: [{ scale: this.animatedValue }] };
        return (
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundOverlay}
                style={[UIStyle.container.absoluteFill(), styles.container]}
            >
                <AnimatedUIBackgroundView
                    color={UIBackgroundViewColors.BackgroundPrimary}
                    style={[styles.alert, animation]}
                >
                    {this.renderTitle()}
                    {this.renderDescription()}
                    {this.renderButtons()}
                </AnimatedUIBackgroundView>
            </UIBackgroundView>
        );
    }
}
