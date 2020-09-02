// @flow
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIConstant from '../../../helpers/UIConstant';
import UIColor from '../../../helpers/UIColor';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIComponent from '../../UIComponent';
import UIProfileInitials from '../../profile/UIProfileInitials';
import UILabel from '../../text/UILabel';

type Props = {
    amount: string | React$Element<any>,
    amountColor: string,
    comment: string,
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
});

export default class UITransactionView extends UIComponent<Props, State> {
    static defaultProps = {
        amount: '',
        amountColor: UIColor.textPrimary(),
        comment: '',
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

    get description(): string {
        return this.props.description || '';
    }

    get title(): string {
        return this.props.title || '';
    }

    get amountColor(): string {
        return this.props.amountColor;
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
                    textStyle={{ ...UIFont.accentRegular() }}
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
            text={description}
        />);
    }

    renderComment() {
        const { comment } = this;
        if (!comment) {
            return null;
        }
        return (
            <View style={UIStyle.flex.row()}>
                <View style={this.styles.commentWrapper}>
                    <UILabel
                        role={UILabel.Role.TinySecondary}
                        text={this.comment}
                        numberOfLines={1}
                    />
                </View>
            </View>
        );
    }

    renderAmount() {
        return (<UILabel
            role={UILabel.Role.Description}
            text={this.amount}
            style={UIStyle.color.getColorStyle(this.amountColor)}
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
