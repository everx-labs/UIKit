// @flow
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIProfileInitials from '../../profile/UIProfileInitials';
import UIBalanceView from '../UIBalanceView';

type Props = {
    amount: string,
    separator: string,
    description: string,
    title: string,
    initials: string,
    icon?: any,
    testID?: string,
    cacheKey?: string,
    containerStyle: ViewStyleProp,
    detailsMode: boolean,
    onPress: () => void,
};

type State = {
    //
};

const tableStyles = StyleSheet.create({
    container: {
        height: UIConstant.largeCellHeight(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: UIConstant.mediumAvatarSize(),
        height: UIConstant.mediumAvatarSize(),
        marginRight: UIConstant.contentOffset(),
    },
    paymentAvatarContainer: {
        width: UIConstant.mediumAvatarSize(),
        height: UIConstant.mediumAvatarSize(),
        marginRight: UIConstant.contentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarStyle: {
        backgroundColor: UIColor.backgroundQuarter(),
        borderRadius: UIConstant.mediumAvatarSize() / 2.0,
    },
});

const detailsStyles = StyleSheet.create({
    container: {
        height: UIConstant.detailsCellHeight(),
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: UIConstant.detailsAvatarSize(),
        height: UIConstant.detailsAvatarSize(),
        marginRight: UIConstant.contentOffset(),
    },
    paymentAvatarContainer: {
        width: UIConstant.detailsAvatarSize(),
        height: UIConstant.detailsAvatarSize(),
        marginRight: UIConstant.contentOffset(),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarStyle: {
        backgroundColor: UIColor.backgroundQuarter(),
        borderRadius: UIConstant.detailsAvatarSize() / 2.0,
    },
});

export default class UITransactionView extends UIComponent<Props, State> {
    static defaultProps = {
        amount: '',
        description: '',
        title: '',
        separator: '.',
        icon: null,
        initials: '',
        containerStyle: null,
        detailsMode: false,
        onPress: () => {},
    };

    // Getters
    isDetailsMode() {
        return this.props.detailsMode;
    }

    getStyles() {
        return this.isDetailsMode() ? detailsStyles : tableStyles;
    }

    getSeparator(): string {
        return this.props.separator || '.';
    }

    getAmount(): string {
        return this.props.amount || '0';
    }

    getDescription(): string {
        return this.props.description || '';
    }

    getTitle(): string {
        return this.props.title || '';
    }

    getIcon(): ?any {
        return this.props.icon;
    }

    getInitials(): string {
        return this.props.initials || '';
    }

    getTestID(): ?string {
        return this.props.testID;
    }

    getCacheKey(): ?string {
        return this.props.cacheKey;
    }

    // Render
    renderAvatar() {
        const icon = this.getIcon();
        if (icon) {
            return (
                <View style={this.getStyles().paymentAvatarContainer}>
                    <Image source={icon} />
                </View>
            );
        }

        const { avatarContainer } = this.getStyles();
        return (
            <UIProfileInitials
                id={this.getTitle()}
                initials={this.getInitials()}
                containerStyle={avatarContainer}
                textStyle={{ ...UIFont.accentRegular() }}
                avatarSize={this.isDetailsMode()
                    ? UIConstant.detailsAvatarSize()
                    : UIConstant.mediumAvatarSize()}
            />
        );
    }

    renderTitle() {
        const title = this.getTitle();
        const style = [UITextStyle.primarySmallMedium];
        return <Text style={style} numberOfLines={1}>{title}</Text>;
    }

    renderDescription() {
        const description = this.getDescription();
        return description.length ?
            (
                <Text style={UITextStyle.secondaryCaptionRegular}>
                    {description}
                </Text>
            )
            : null;
    }

    renderAmount() {
        const cacheKey = this.getCacheKey();
        const cacheKeyProp = cacheKey ? { cacheKey } : {};
        return (
            <UIBalanceView
                {...cacheKeyProp}
                balance={this.getAmount()}
                separator={this.getSeparator()}
                smartTruncator={false}
                textStyle={[UIStyle.Text.smallRegular(), UIStyle.Common.textAlignRight()]}
            />
        );
    }

    renderContent() {
        return (
            <View style={[this.getStyles().container, this.props.containerStyle]}>
                {this.renderAvatar()}
                <View style={[UIStyle.flex.x1(), UIStyle.flex.row(), UIStyle.flex.alignCenter()]}>
                    <View style={[UIStyle.flex.x1(), UIStyle.flex.column(), UIStyle.margin.rightDefault()]}>
                        {this.renderTitle()}
                        {this.renderDescription()}
                    </View>
                    {this.renderAmount()}
                </View>
            </View>
        );
    }

    render() {
        const testID = this.getTestID();
        const testIDProp = testID ? { testID } : null;

        return (
            <TouchableOpacity
                {...testIDProp}
                onPress={this.props.onPress}
                disabled={!this.props.onPress}
            >
                {this.renderContent()}
            </TouchableOpacity>
        );
    }
}
