// @flow
import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

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

type Props = {
    errorCode?: number,
    errorCaption?: string,
    needTopBar?: boolean,
    style?: ViewStyleProp,
};

export default class UIErrorScreen extends UIScreen<Props, {}> {
    static defaultProps: Props = {
        needTopBar: true,
    };

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
        // $FlowExpectedError
        const caption = this.props.errorCaption || this.getNavigationParams().caption;
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
                <View style={[...this.getContentStyle(), UIStyle.common.flex()]}>
                    <UILabel
                        style={UIStyle.margin.topSpacious()}
                        role={UILabel.Role.Title}
                        text={this.getTitle()}
                    />
                    <UILabel
                        style={UIStyle.margin.topMedium()}
                        role={UILabel.Role.Description}
                        text={this.getCaption()}
                    />
                </View>
                <UITextButton
                    align={UITextButton.align.center}
                    title={UILocalized.BackToHome}
                    buttonStyle={[UIStyle.common.positionAbsolute(), styles.textButton]}
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
