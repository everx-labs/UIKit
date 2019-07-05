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
import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UITextStyle from '../../../helpers/UITextStyle';
import UIComponent from '../../UIComponent';
import UIColor from '../../../helpers/UIColor';
import UIProfileInitials from '../../profile/UIProfileInitials';

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
    amount: string,
    auxAmount: string,
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

const styles = StyleSheet.create({
    auxAmount: {
        opacity: 0,
        zIndex: -1,
        width: 0,
    },
});

const cachedAmount = {};

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

    // constructor
    amount: ?string;
    constructor(props: Props) {
        super(props);

        this.state = {
            amount: this.getCachedAmount(),
            auxAmount: '',
        };

        this.amount = null;
    }

    componentDidUpdate() {
        const { amount, separator } = this.props;
        if (amount !== this.amount) {
            this.amount = amount;
            const formattedAmount = amount.split(separator).length > 1
                ? amount
                : `${amount}${separator}${'0'.repeat(UIConstant.maxDecimalDigits())}`;
            this.setAuxAmount(formattedAmount, () => { // start component layout and measuring
                this.measureAuxAmountText(formattedAmount);
            });
        }
    }

    // Events
    auxAmountLineHeight: ?number;
    onAuxAmountLayout = (e: any) => {
        const { height } = e.nativeEvent.layout;
        if (!this.auxAmountLineHeight) {
            this.auxAmountLineHeight = height;
        }
    };

    // Setters
    setAmount(amount: string) {
        this.setCachedAmount(amount);
        this.setStateSafely({ amount });
    }

    setAuxAmount(auxAmount: string, callback?: () => void) {
        this.setStateSafely({ auxAmount }, callback);
    }

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
        return this.state.amount
            || `0${this.getSeparator()}${'0'.repeat(UIConstant.maxDecimalDigits())}`;
    }

    getAuxAmount(): string {
        return this.state.auxAmount || this.getAmount();
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

    // Processing
    processAuxAmountHeight(height: number, auxAmount: string) {
        if (!this.auxAmountLineHeight) {
            this.auxAmountLineHeight = height;
        } else if (this.auxAmountLineHeight < height) {
            const truncatedAuxAmount = auxAmount.slice(0, -1); // reduce amount size
            this.setAuxAmount(truncatedAuxAmount, () => {
                this.measureAuxAmountText(truncatedAuxAmount);
            });
        } else {
            this.setAmount(auxAmount);
        }
    }

    // Actions
    measureAuxAmountText(auxAmount: string) {
        setTimeout(() => {
            if (!this.auxAmountText) {
                return;
            }
            this.auxAmountText.measure((relX, relY, w, h) => {
                this.processAuxAmountHeight(h, auxAmount);
            });
        }, 0);
    }

    setCachedAmount(amount: string) {
        const key = this.getCacheKey();
        if (key) {
            cachedAmount[key] = amount;
        }
    }

    getCachedAmount(): string {
        const key = this.getCacheKey();
        return (key && cachedAmount[key]) || '';
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

    renderAmount() {
        const amount = this.getAmount();
        const separator = this.getSeparator();
        const stringParts = amount.split(separator);
        return (
            <Text
                style={UITextStyle.primarySmallRegular}
                numberOfLines={1}
            >
                {stringParts[0]}
                <Text style={[UIStyle.Text.tertiaryTitleLight(), UIFont.smallRegular()]}>
                    {`${separator}${stringParts[1]}`}
                </Text>
            </Text>
        );
    }

    /* eslint-disable-next-line */
    auxAmountText: ?(React$Component<*> & NativeMethodsMixinType);
    renderAuxAmount() {
        const auxAmount = this.getAuxAmount();
        return (
            <Text
                ref={(component) => { this.auxAmountText = component; }}
                style={[
                    UITextStyle.primaryBodyRegular,
                    styles.auxAmount,
                ]}
                onLayout={this.onAuxAmountLayout}
                numberOfLines={1}
            >
                {`${auxAmount}`}
            </Text>
        );
    }

    renderTransactionAmount() {
        return (
            <View style={[UIStyle.flexRow, UIStyle.justifyCenter, UIStyle.marginLeftDefault]}>
                {this.renderAmount()}
                {this.renderAuxAmount()}
            </View>
        );
    }

    renderTitle() {
        const title = this.getTitle();
        const style = [UITextStyle.primarySmallMedium, UIStyle.flex];
        return <Text style={style} numberOfLines={1}>{title}</Text>;
    }

    renderDescription() {
        const description = this.getDescription();
        return description.length ? <Text style={UITextStyle.secondaryCaptionRegular}>{description}</Text> : null;
    }

    renderContent() {
        return (
            <View style={[this.getStyles().container, this.props.containerStyle]}>
                {this.renderAvatar()}
                <View style={[UIStyle.flex, UIStyle.flexRow, UIStyle.alignCenter]}>
                    <View style={[UIStyle.flex, UIStyle.flexColumn]}>
                        {this.renderTitle()}
                        {this.renderDescription()}
                    </View>
                    {this.renderTransactionAmount()}
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
