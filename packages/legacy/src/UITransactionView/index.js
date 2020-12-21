// @flow
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIAssets } from '@tonlabs/uikit.assets';
import { UIConstant, UIColor, UIStyle, UIFont } from '@tonlabs/uikit.core';
import { UIComponent, UILabel } from '@tonlabs/uikit.components';
import { UILabelRoles } from '@tonlabs/uikit.hydrogen';

import UIProfileInitials from '../UIProfileInitials';

type Props = {
    amount: string | React$Element<any>,
    comment: string,
    encrypted: boolean,
    description: string,
    title: string,
    initials: string,
    icon?: any,
    testID?: string,
    containerStyle: ViewStyleProp,
    detailsMode: boolean,
    onPress: () => void,
};

type State = {
    //
};

const commentWrapper = {
    flexShrink: 1,
    flexDirection: 'row',
    maxWidth: '100%',
    borderRadius: UIConstant.borderRadius(),
    borderTopLeftRadius: 0,
    backgroundColor: UIColor.backgroundTertiary(),
    paddingHorizontal: UIConstant.normalContentOffset(),
    paddingVertical: UIConstant.smallContentOffset(),
};

const keyThin = {
    flexBasis: UIConstant.tinyButtonHeight(),
    paddingLeft: UIConstant.smallContentOffset(),
    marginLeft: 'auto',
};

const tableStyles = StyleSheet.create({
    avatarContainer: {
        width: UIConstant.mediumAvatarSize(),
        height: UIConstant.mediumAvatarSize(),
        marginRight: UIConstant.contentOffset(),
    },
    avatarIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        paddingVertical: UIConstant.normalContentOffset(),
    },
    commentWrapper,
    keyThin,
});

const detailsStyles = StyleSheet.create({
    avatarContainer: {
        width: UIConstant.detailsAvatarSize(),
        height: UIConstant.detailsAvatarSize(),
        marginRight: UIConstant.contentOffset(),
    },
    avatarIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        paddingVertical: UIConstant.normalContentOffset(),
    },
    commentWrapper,
    keyThin,
});

export default class UITransactionView extends UIComponent<Props, State> {
    static defaultProps = {
        amount: '',
        comment: '',
        encrypted: false,
        description: '',
        title: '',
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

    get styles() {
        return this.isDetailsMode() ? detailsStyles : tableStyles;
    }

    get amount(): string | React$Element<any> {
        return this.props.amount || '0';
    }

    get comment(): string {
        return this.props.comment || '';
    }

    get encrypted(): boolean {
        return this.props.encrypted;
    }

    get description(): string {
        return this.props.description || '';
    }

    get title(): string {
        return this.props.title || '';
    }

    get icon(): ?any {
        return this.props.icon;
    }

    get initials(): string {
        return this.props.initials || '';
    }

    get testID(): ?string {
        return this.props.testID;
    }

    // Render
    renderAvatar() {
        const { icon } = this;
        if (icon) {
            return (
                <View style={[this.styles.avatarContainer, this.styles.avatarIcon]}>
                    <Image source={icon} />
                </View>
            );
        }

        const { initials } = this;
        if (initials) {
            return (
                <UIProfileInitials
                    id={this.title}
                    initials={initials}
                    containerStyle={this.styles.avatarContainer}
                    textStyle={UILabelRoles.PromoMedium}
                    avatarSize={this.isDetailsMode()
                        ? UIConstant.detailsAvatarSize()
                        : UIConstant.mediumAvatarSize()}
                />
            );
        }

        return null;
    }

    renderTitle() {
        return (<UILabel
            role={UILabel.Role.DescriptionMedium}
            text={this.title}
        />);
    }

    renderDescription() {
        const { description } = this;
        if (!description) {
            return null;
        }
        return (<UILabel
            role={UILabel.Role.Caption}
            style={UIStyle.margin.topTiny()}
            text={description}
        />);
    }

    renderComment() {
        const { comment, encrypted } = this;
        if (!comment) {
            return null;
        }
        return (
            <View style={[UIStyle.flex.row(), UIStyle.margin.topTiny()]}>
                <View style={this.styles.commentWrapper}>
                    <UILabel
                        role={UILabel.Role.TinySecondary}
                        text={this.comment}
                        numberOfLines={1}
                        style={encrypted ? UIStyle.margin.rightNormal() : null}
                    />
                    {encrypted && (
                        <View style={this.styles.keyThin}>
                            <Image source={UIAssets.icons.ui.keyThinDark} />
                        </View>
                    )}
                </View>
            </View>
        );
    }

    renderAmount() {
        return (<UILabel
            role={UILabel.Role.Description}
            text={this.amount}
        />);
    }

    renderContent() {
        return (
            <View style={[this.styles.container, this.props.containerStyle]}>
                {this.renderAvatar()}
                <View
                    style={[
                        UIStyle.flex.x1(),
                        UIStyle.flex.row(),
                    ]}
                >
                    <View
                        style={[
                            UIStyle.flex.x1(),
                            UIStyle.flex.column(),
                        ]}
                    >
                        {this.renderTitle()}
                        {this.renderDescription()}
                        {this.renderComment()}
                    </View>
                    {this.renderAmount()}
                </View>
            </View>
        );
    }

    render() {
        const { testID } = this;
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
