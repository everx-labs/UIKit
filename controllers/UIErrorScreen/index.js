import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import UIScreen from '../UIScreen';
import UIStyle from '../../helpers/UIStyle';
import UIActionImage from '../../components/images/UIActionImage';
import UILabel from '../../components/text/UILabel';
import UILocalized from '../../helpers/UILocalized';
import UITextButton from '../../components/buttons/UITextButton';
import UIBottomBar from '../../components/products/UIBottomBar';
import UIConstant from '../../helpers/UIConstant';

import image404 from '../../assets/404/404.png';
import icoTonLabsBlack from '../../assets/logo/tonlabs/tonlabs-black.png';
import type { CreateNavigationOptions } from '../../components/navigation/UINavigationBar';

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

export default class UIErrorScreen extends UIScreen {
    static errorCodes = {
        pageNotfound: '404',
        serviceUnavailable: '000',
    };

    static errors = {
        [UIErrorScreen.errorCodes.pageNotfound]: {
            title: '404',
            caption: UILocalized.WeCanTFindThePageYouReLookingFor,
        },
        [UIErrorScreen.errorCodes.serviceUnavailable]: {
            title: UILocalized.WelcomeTo000,
            caption: UILocalized.TheRequestedServiceIsDownToGetUpAsapTryAgainLater,
        },
    };

    static navigationOptions: CreateNavigationOptions = ({ navigation }) => {
        return {
            header: null,
        };
    };

    // Getters
    getContentContainerStyle() {
        return styles.scrollContainer;
    }

    getContentStyle() {
        return this.isNarrow()
            ? [UIStyle.Width.fullPaddingContainer()]
            : [UIStyle.Width.halfContainer(), UIStyle.Common.alignSelfCenter()];
    }

    getError() {
        const { code } = this.getNavigationParams();
        const { errors, errorCodes } = UIErrorScreen;
        if (code) {
            return errors[code];
        }
        return errors[errorCodes.pageNotfound];
    }

    getTitle() {
        const { title } = this.getNavigationParams();
        if (title) {
            return title;
        }
        const error = this.getError();
        return error.title;
    }

    getCaption() {
        const { caption } = this.getNavigationParams();
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
        // Virtual
    };

    // Render
    renderTopBar() {
        return (
            <View style={[
                UIStyle.Height.greatCell(),
                UIStyle.Padding.horizontal(),
                UIStyle.Common.centerLeftContainer(),
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
                UIStyle.Common.absoluteFillContainer(),
                UIStyle.Common.justifyCenter(),
            ]}
            >
                <View style={this.getContentStyle()}>
                    <Image
                        style={UIStyle.Margin.topSmall()}
                        source={image404}
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
                <View style={[...this.getContentStyle(), UIStyle.Common.flex()]}>
                    <UILabel
                        style={UIStyle.Margin.topSpacious()}
                        role={UILabel.Role.Title}
                        text={this.getTitle()}
                    />
                    <UILabel
                        style={UIStyle.Margin.topMedium()}
                        role={UILabel.Role.Description}
                        text={this.getCaption()}
                    />
                </View>
                <UITextButton
                    align={UITextButton.Align.Center}
                    title={UILocalized.BackToHome}
                    buttonStyle={[UIStyle.Common.positionAbsolute(), styles.textButton]}
                    onPress={this.onPressBackToHome}
                />
                <UIBottomBar
                    isNarrow={this.isNarrow()}
                    copyRight={UILocalized.CopyRight}
                    copyRightIcon={icoTonLabsBlack}
                />
            </React.Fragment>
        );
    }
}
