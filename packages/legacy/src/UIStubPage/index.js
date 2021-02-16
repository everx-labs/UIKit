// @flow
import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import { UIConstant, UIStyle, UIColor } from '@tonlabs/uikit.core';
import {
    UIComponent,
    UIEmailInput,
    UIToastMessage,
    UIBackgroundView,
} from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import { UIBottomBar } from '@tonlabs/uikit.navigation_legacy';

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
        UIStyle.common.pageContainer(),
        UIStyle.common.justifyCenter(),
        UIStyle.common.flex(),
    ],
    description: [
        UIStyle.height.majorCell(),
        UIStyle.common.justifyEnd(),
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
    titleClassName?: string, // TODO: remove, as react-native-web@^0.12.0 does not support it
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
        caption: uiLocalized.GetNotifiedWhenWeLaunch,
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
            UIToastMessage.showMessage(uiLocalized.ThanksForCooperation);
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
                        {uiLocalized.WillGetInTouchWithYouSoon}
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
                accentText={uiLocalized.Contact}
                accentEmail={uiLocalized.PressEmail}
                copyRight={uiLocalized.CopyRight}
                disclaimer={this.props.disclaimer}
            />
        );
    }

    render(): React$Node {
        const {
            title, label, needBottomIcon, caption, titleClassName,
        } = this.props;
        const widthStyle = this.getWidthStyle();
        const bottomIcon = needBottomIcon ? (
            <Image
                source={UIAssets.icons.logo.tonlabsPrimary}
                style={styles.bottomIcon}
            />
        ) : null;
        const labelText = label || uiLocalized.TONLabel;
        return (
            <View
                onLayout={this.onLayout}
                style={styles.container}
            >
                <View style={[...customStyles.contentContainer, widthStyle]}>
                    <Text style={UIStyle.text.whiteAccentBold()}>
                        {labelText}
                    </Text>
                    {/* $FlowFixMe */}
                    <Text
                        style={UIStyle.text.whiteKeyBold()}
                        // TODO: remove, as react-native-web@^0.12.0 does not support it
                        className={titleClassName}
                        innerTextForCSS={title}
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
