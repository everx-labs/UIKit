// @flow
import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';
import UIColor from '../../../helpers/UIColor';
import UILocalized from '../../../helpers/UILocalized';
import UIDetailsInput from '../../text/UIDetailsInput';

import icoTonLabs from '../../../assets/logo/tonlabs/tonlabs-primary-minus.png';
import icoTonLabel from '../../../assets/logo/ton-label/ton-label-white.png';
import UIToastMessage from '../../notifications/UIToastMessage';
import type { DetailsProps, DetailsState } from '../../text/UIDetailsInput';
import { UIBackgroundView, UIBottomBar } from '../../../UIKit';
import TONLocalized from '../../../../../helpers/TONLocalized';

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
        UIStyle.pageContainer,
        UIStyle.justifyCenter,
        UIStyle.flex,
    ],
    description: [
        UIStyle.majorCellHeight,
        UIStyle.justifyEnd,
        UIStyle.marginTopDefault,
        UIStyle.threeQuartersWidth,
        styles.description,
    ],
};

type Props = {
    icon: string | number,
    title: string,
    description: string,
    onSubmit: (string) => void,
};

type State = {
    screenWidth: number,
    email: string,
    submitted: boolean,
};

export default class UIStubPage extends UIComponent<Props, State> {
    detailsInput: ?UIDetailsInput<DetailsProps, DetailsState>;

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
        if (this.detailsInput) {
            this.detailsInput.focus();
        }
    }

    // Events
    onLayout(e: any) {
        const { width } = e.nativeEvent.layout;
        if (width !== this.getScreenWidth()) {
            this.setScreenWidth(width);
        }
    }

    onSubmit() {
        this.setSubmitted();
        UIToastMessage.showMessage(UILocalized.ThanksForCooperation);
        const email = this.getEmail();
        this.props.onSubmit(email);
    }

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
            return UIStyle.thirdWidth;
        }
        if (columns === 8) {
            return UIStyle.halfWidth;
        }
        return UIStyle.fullWidth;
    }

    // Render
    renderInput() {
        if (this.isSubmitted()) {
            return (
                <View style={UIStyle.greatCellHeight}>
                    <Text style={[UITextStyle.whiteBodyRegular, UIStyle.marginTopHuge]}>
                        {UILocalized.WillGetInTouchWithYouSoon}
                    </Text>
                </View>
            );
        }
        return (
            <UIDetailsInput
                ref={(component) => { this.detailsInput = component; }}
                theme={UIColor.Theme.Dark}
                value={this.getEmail()}
                valueType={UIDetailsInput.ValueType.Email}
                placeholder={UILocalized.EmailAddress}
                containerStyle={StyleSheet.flatten([UIStyle.greatCellHeight, UIStyle.marginTopSmall])}
                needArrow
                onChangeText={text => this.setEmail(text)}
                onSubmitEditing={() => this.onSubmit()}
            />
        );
    }

    renderBottomBar() {
        const textStyleProp = this.props.presetName === UIBackgroundView.PresetNames.Action
            ? { textStyle: UITextStyle.actionMinusTinyMedium }
            : null;
        return (
            <UIBottomBar
                {...textStyleProp}
                copyRight={TONLocalized.Copyright}
            />
        );
    }

    render() {
        const {
            title, needBottomIcon, description,
        } = this.props;
        const widthStyle = this.getWidthStyle();
        const bottomIcon = needBottomIcon
            ? <Image source={icoTonLabs} style={styles.bottomIcon} />
            : null;
        return (
            <View
                onLayout={e => this.onLayout(e)}
                style={styles.container}
            >
                <View style={[...customStyles.contentContainer, widthStyle]}>
                    <Text style={UITextStyle.whiteAccentBold}>
                        {UILocalized.TONLabel}
                    </Text>
                    <Text style={UITextStyle.whiteKeyBold}>
                        {title}
                    </Text>
                    <View style={customStyles.description}>
                        <Text style={UITextStyle.grey1SubtitleBold}>
                            {description}
                        </Text>
                    </View>
                    {this.renderInput()}
                </View>
                {this.renderBottomBar()}
                {bottomIcon}
            </View>
        );
    }

    static defaultProps: Props;
}

UIStubPage.defaultProps = {
    bottomIcon: true,
    title: 'dev.',
    description: UILocalized.GetNotifiedWhenWeLaunch,
    onSubmit: () => {},
};

