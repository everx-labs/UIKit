// @flow
import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIStyle, UIConstant } from '@tonlabs/uikit.core';
import { UIActionImage, UITextButton } from '@tonlabs/uikit.components';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';
import { uiLocalized } from '@tonlabs/uikit.localization';

import UIScreen from '../UIScreen';
import UIBottomBar from '../UIBottomBar';

const { height } = Dimensions.get('window');
const bottomOffset = UIConstant.contentOffset() + UIConstant.bigCellHeight();

const styles = StyleSheet.create({
    scrollContainer: {
        minHeight: height,
    },
    textButton: {
        bottom: bottomOffset,
        width: '100%',
    },
});

type Props = {
    errorCode?: number,
    errorCaption?: string,
    needTopBar?: boolean,
    style?: ViewStyleProp,
    onPressBackToHome?: () => void,
};

export default class UIErrorScreen extends UIScreen<Props, {}> {
    static defaultProps: Props = {
        needTopBar: true,
        onPressBackToHome: () => {},
    };

    static errorCodes = {
        pageNotfound: '404',
        serviceUnavailable: '000',
    };

    static errors = {
        [UIErrorScreen.errorCodes.pageNotfound]: {
            title: '404',
            caption: uiLocalized.WeCanTFindThePageYouReLookingFor,
        },
        [UIErrorScreen.errorCodes.serviceUnavailable]: {
            title: uiLocalized.WelcomeTo000,
            caption: uiLocalized.TheRequestedServiceIsDownToGetUpAsapTryAgainLater,
        },
    };

    static navigationOptions = () => {
        return {
            header: null,
        };
    };

    static testID = 'UIErrorScreen';
    static testIDs = {
        BACK_TO_HOME_BUTTON: `${this.testID}-back-to-home-button`,
    };

    // Getters
    getContentContainerStyle(): ?ViewStyleProp | ViewStyleProp[] {
        const result: ViewStyleProp[] = [styles.scrollContainer, this.props.style];
        return result;
    }

    getContentStyle() {
        return this.isNarrow()
            ? [UIStyle.width.fullPaddingContainer()]
            : [UIStyle.width.halfContainer(), UIStyle.common.alignSelfCenter()];
    }

    getError() {
        // $FlowExpectedError
        const code = this.props.errorCode || this.getNavigationParams().code;
        const { errors, errorCodes } = UIErrorScreen;
        if (code) {
            return errors[code];
        }
        return errors[errorCodes.pageNotfound];
    }

    getTitle() {
        // $FlowExpectedError
        const { title } = this.getNavigationParams();
        if (title) {
            return title;
        }
        const error = this.getError();
        return error.title;
    }

    getCaption() {
        const caption =
            // $FlowExpectedError
            this.props.errorCaption || this.getNavigationParams().caption;
        if (caption) {
            return caption;
        }
        const error = this.getError();
        return error.caption;
    }

    // Virtual
    getProductIcon() {
        return null;
    }

    // Events
    onPressBackToHome = () => {
        if (this.props.onPressBackToHome) {
            this.props.onPressBackToHome();
        }
    };

    // Render
    renderTopBar() {
        if (!this.props.needTopBar) return null;

        return (
            <View style={[
                UIStyle.height.greatCell(),
                UIStyle.padding.horizontal(),
                UIStyle.common.centerLeftContainer(),
            ]}
            >
                <UIActionImage
                    onPress={this.onPressBackToHome}
                    source={this.getProductIcon()}
                />
            </View>
        );
    }

    renderImage() {
        return (
            <View style={[
                UIStyle.common.absoluteFillContainer(),
                UIStyle.common.justifyCenter(),
            ]}
            >
                <View style={this.getContentStyle()}>
                    <Image
                        style={UIStyle.margin.topSmall()}
                        source={UIAssets.images[404]}
                    />
                </View>
            </View>
        );
    }

    renderContent() {
        return (
            <React.Fragment>
                {this.renderImage()}
                {this.renderTopBar()}
                <View
                    style={[...this.getContentStyle(), UIStyle.common.flex()]}
                    testID={UIErrorScreen.testID}
                >
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.HeadlineHead} // TODO: ex UIFont.titleBold()
                        style={UIStyle.margin.topSpacious()}
                    >
                        {this.getTitle()}
                    </UILabel>
                    <UILabel
                        color={UILabelColors.TextPrimary}
                        role={UILabelRoles.ParagraphText}
                        style={UIStyle.margin.topMedium()}
                    >
                        {this.getCaption()}
                    </UILabel>
                </View>
                <UITextButton
                    testID={UIErrorScreen.testIDs.BACK_TO_HOME_BUTTON}
                    align={UITextButton.align.center}
                    title={uiLocalized.BackToHome}
                    buttonStyle={[UIStyle.common.positionAbsolute(), styles.textButton]}
                    onPress={this.onPressBackToHome}
                />
                <UIBottomBar
                    isNarrow={this.isNarrow()}
                    copyRight={`2018–${(new Date()).getFullYear()} © TON Labs`}
                    copyRightIcon={UIAssets.icons.logo.tonlabsBlack}
                />
            </React.Fragment>
        );
    }
}
