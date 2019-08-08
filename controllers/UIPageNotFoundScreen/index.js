import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import UIScreen from '../UIScreen';
import UIStyle from '../../helpers/UIStyle';
import UIActionImage from '../../components/images/UIActionImage';
import UILabel from '../../components/text/UILabel';
import iconGramScan from '../../../../assets/ico-gramscan/gramscan.png';
import { UIConstant, UILocalized } from '../../UIKit';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    scrollContainer: {
        minHeight: height,
    },
});

export default class UIPageNotFoundScreen extends UIScreen {
    // Getters
    getContentContainerStyle() {
        return [
            UIStyle.Common.alignCenter(),
            styles.scrollContainer,
            this.getContentStyle(),
        ];
    }

    getContentStyle() {
        return this.isNarrow()
            ? UIStyle.Width.fullPaddingContainer()
            : UIStyle.Width.halfContainer();
    }

    // Render
    renderTopBar() {
        return (
            <View style={[
                UIStyle.Height.greatCell(),
                UIStyle.Common.centerLeftContainer(),
            ]}
            >
                <UIActionImage
                    onPress={this.props.onPress}
                    style={UIStyle.Margin.default()}
                    source={iconGramScan}
                />
            </View>
        );
    }

    renderContent() {
        return (
            <View style={UIStyle.Common.flex()}>
                {this.renderTopBar()}
                <UILabel
                    style={UIStyle.Margin.topSpacious()}
                    role={UILabel.Role.Title}
                    text="404"
                />
                <UILabel
                    style={UIStyle.Margin.topMedium()}
                    role={UILabel.Role.Description}
                    text={UILocalized.WeCanTFindThePageYouReLookingFor}
                />
            </View>
        );
    }
}
