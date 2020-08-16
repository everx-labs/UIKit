// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';

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

    isAlertVisible(): boolean {
        return this.props.isVisible || this.state.isVisible;
    }

    getAlertContent(): ?UIAlertContent {
        return this.props.content || this.state.content;
    }

    showAlert(content: UIAlertContent) {
        this.setStateSafely({ content, isVisible: true });
    }

    hideAlert() {
        this.setStateSafely({ isVisible: false });
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

        return (
            <View style={[UIStyle.container.absoluteFill(), styles.container]}>
                <View style={styles.alert} >
                    {this.renderTitle()}
                    {this.renderDescription()}
                    {this.renderButtons()}
                </View>
            </View>
        );
    }
}
