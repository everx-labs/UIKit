// @flow
import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIEmailInput from '../../input/UIEmailInput';

import icoTonLabs from '../../../assets/logo/tonlabs/tonlabs-primary-minus.png';
import UIToastMessage from '../../notifications/UIToastMessage';
import UIBackgroundView from '../UIBackgroundView';
import UIBottomBar from '../UIBottomBar';

const styles = StyleSheet.create({
    container: {
        backgroundColor: UIColor.primary(),
        flex: 1,
    },
    bottomIcon: {
        position: 'absolute',
        bottom: UIConstant.contentOffset(),
        right: UIConstant.contentOffset(),
    },
    description: {
        maxWidth: UIConstant.elasticWidthRegular(),
    },
});

const customStyles = {
    contentContainer: [
        UIStyle.Common.pageContainer(),
        UIStyle.Common.justifyCenter(),
        UIStyle.Common.flex(),
    ],
    description: [
        UIStyle.height.majorCell(),
        UIStyle.Common.justifyEnd(),
        UIStyle.margin.topDefault(),
        UIStyle.width.threeQuarters(),
        styles.description,
    ],
};

type Props = {
    presetName: string,
    needBottomIcon: boolean,
    title: string,
    label: string,
    caption: string,
    disclaimer: string,
    titleClassName?: string,
    onSubmit: (string) => void,
};

type State = {
    screenWidth: number,
    email: string,
    submitted: boolean,
};

export default class UIStubPage extends UIComponent<Props, State> {
    static defaultProps: Props = {
        presetName: UIBackgroundView.PresetNames.Primary,
        needBottomIcon: true,
        title: '',
        label: '',
        caption: UILocalized.GetNotifiedWhenWeLaunch,
        disclaimer: '',
        onSubmit: () => {},
    };

    emailInput: ?UIEmailInput;
    constructor(props: Props) {
        super(props);

        this.state = {
            screenWidth: 0,
            email: '',
            submitted: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.emailInput) {
            this.emailInput.focus();
        }
    }

    // Events
    onLayout = (e: any) => {
        const { width } = e.nativeEvent.layout;
        if (width !== this.getScreenWidth()) {
            this.setScreenWidth(width);
        }
    };

    onSubmit = () => {
        this.setSubmitted();
        setTimeout(() => {
            UIToastMessage.showMessage(UILocalized.ThanksForCooperation);
        }, UIConstant.feedbackDelay());
        const email = this.getEmail();
        // ReactGA.event({ category: 'Form', action: 'onSubmit' });
        this.props.onSubmit(email);
    };

    // Setters
    setScreenWidth(screenWidth: number) {
        this.setStateSafely({ screenWidth });
    }

    setEmail(email: string) {
        this.setStateSafely({ email });
    }

    setSubmitted(submitted: boolean = true) {
        this.setStateSafely({ submitted });
    }

    // Getters
    getScreenWidth() {
        return this.state.screenWidth;
    }

    getEmail() {
        return this.state.email;
    }

    isSubmitted() {
        return this.state.submitted;
    }

    getColumnsNumber() {
        const screenWidth = this.getScreenWidth();
        if (screenWidth > UIConstant.elasticWidthWide()) {
            return 12;
        }
        if (screenWidth > UIConstant.elasticWidthMedium()) {
            return 8;
        }
        if (screenWidth > UIConstant.elasticWidthRegular()) {
            return 4;
        }
        return 1;
    }

    getWidthStyle() {
        const columns = this.getColumnsNumber();
        if (columns === 12) {
            return UIStyle.width.third();
        }
        if (columns === 8) {
            return UIStyle.width.half();
        }
        return UIStyle.width.full();
    }

    // Render
    renderInput() {
        if (this.isSubmitted()) {
            return (
                <View style={UIStyle.height.greatCell()}>
                    <Text style={[UIStyle.text.whiteBodyRegular(), UIStyle.margin.topHuge()]}>
                        {UILocalized.WillGetInTouchWithYouSoon}
                    </Text>
                </View>
            );
        }
        return (
            <UIEmailInput
                ref={(component) => { this.emailInput = component; }}
                theme={UIColor.Theme.Action}
                value={this.getEmail()}
                containerStyle={[
                    UIStyle.height.greatCell(),
                    UIStyle.margin.topSmall(),
                ]}
                needArrow
                onChangeText={text => this.setEmail(text)}
                onSubmitEditing={this.onSubmit}
            />
        );
    }

    renderBottomBar() {
        return (
            <UIBottomBar
                theme={UIColor.Theme.Action}
                accentText={UILocalized.Contact}
                accentEmail={UILocalized.PressEmail}
                copyRight={UILocalized.CopyRight}
                disclaimer={this.props.disclaimer}
            />
        );
    }

    render(): React$Node {
        const {
            title, label, needBottomIcon, caption, titleClassName,
        } = this.props;
        const widthStyle = this.getWidthStyle();
        const bottomIcon = needBottomIcon
            ? <Image source={icoTonLabs} style={styles.bottomIcon} />
            : null;
        const labelText = label || UILocalized.TONLabel;
        return (
            <View
                onLayout={this.onLayout}
                style={styles.container}
            >
                <View style={[...customStyles.contentContainer, widthStyle]}>
                    <Text style={UIStyle.text.whiteAccentBold()}>
                        {labelText}
                    </Text>
                    <Text
                        style={UIStyle.text.whiteKeyBold()}
                        className={titleClassName}
                        data={title}
                    >
                        {title}
                    </Text>
                    <View style={customStyles.description}>
                        <Text style={UIStyle.text.grey1SubtitleBold()}>
                            {caption}
                        </Text>
                    </View>
                    {this.renderInput()}
                </View>
                {this.renderBottomBar()}
                {bottomIcon}
            </View>
        );
    }
}
