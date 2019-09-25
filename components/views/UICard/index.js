// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';
import UILabel from '../../text/UILabel';
import UIGrid from '../../layout/UIGrid';
import UIGridColumn from '../../layout/UIGridColumn';
import UIBadge from '../../design/UIBadge';
import UITextButton from '../../buttons/UITextButton';
import UILink from '../../buttons/UILink';
import UIActionIcon from '../../buttons/UIActionIcon';
import UIActionComponent from '../../UIActionComponent';
import type { ActionProps, ActionState } from '../../UIActionComponent';

const styles = StyleSheet.create({
    lableIcon: {
        marginRight: 12,
    },
    action: {
        paddingRight: 0,
    },
});

type Props = ActionProps & {
    /**
    Text label
    @default 'Label'
    */
    label: string,
    /**
    Icon left to label
    @default null
    */
    labelIcon?: ?string,
    /**
    Text caption
    @default null
    */
    caption?: ?string,
    /**
    Text secondary
    @default null
    */
    secondary?: ?string,
    /**
    Text data
    @default null
    */
    data?: ?string,
    /**
    Badge value
    @default null
    */
    badge?: ?string,
    /**
    Container style
    @default null
    */
    style?: ?StylePropType,
    /**
    Action by tapping card
    @default null
    */
    onPress?: ?() => void,
    /**
    Icon along with action
    @default null
    */
    actionIcon?: ?string,
    /**
    Action string title
    @default null
    */
    actionTitle?: ?string,
    /**
    Action by tapping action title/icon
    @default null
    */
    onActionPress?: ?() => void,
    /**
    Size of card, one of: UICard.Size.XS(52 height), UICard.Size.S(72 height), UICard.Size.M(76 height), UICard.Size.L(80 height)
    @default UICard.Size.M
    */
    size?: ?string,
    /**
    Direction of card, one of: UICard.Direction.Row, UICard.Direction.Column
    @default UICard.Size.M
    @ignore
    */
    direction?: ?string,
};

type State = ActionState & {
};

export default class UICard extends UIActionComponent<Props, State> {
    static Size = {
        XS: 'xs',
        S: 's',
        M: 'm',
        L: 'l',
    };
    static Direction = {
        Row: 'row',
        Column: 'column',
    };


    getBackgroundStyle() {
        if (!this.props.onPress) {
            return null;
        }

        if (!this.isHover() && !this.isTapped()) {
            return null;
        }

        return UIColor.getBackgroundColorStyle(UIColor.whiteLight());
    }

    getLabelIconSize() {
        if (this.props.size === UICard.Size.XS) {
            return 32;
        }
        if (this.props.size === UICard.Size.S) {
            return 40;
        }
        if (this.props.size === UICard.Size.M) {
            return 44;
        }
        // L
        return 48;
    }

    getHeight() {
        if (this.props.size === UICard.Size.XS) {
            return 52;
        }
        if (this.props.size === UICard.Size.S) {
            return 72;
        }
        if (this.props.size === UICard.Size.M) {
            return 76;
        }
        // L
        return 80;
    }

    getSecondaryStyle() {
        if (this.props.size === UICard.Size.L) {
            if (!this.props.data) { return [UIStyle.Text.primaryAccentRegular()]; }
            return [UIStyle.Text.secondaryBodyRegular()];
        }
        return [UIStyle.Text.secondarySmallRegular()];
    }

    getDataStyle() {
        if (this.props.size === UICard.Size.M && this.props.badge) {
            return [UIStyle.Text.tertiaryTinyRegular()];
        }
        if (this.props.size === UICard.Size.S || this.props.size === UICard.Size.XS) {
            return [UIStyle.Text.tertiaryTinyRegular()];
        }
        // M w/o badge, L
        return [UIStyle.Text.tertiaryCaptionRegular()];
    }

    getLabelStyle() {
        if (this.props.size === UICard.Size.L) {
            return [UIStyle.Text.secondaryBodyMedium()];
        }
        return [UIStyle.Text.secondarySmallMedium()];
    }

    getCaptionStyle() {
        if (this.props.size === UICard.Size.XS) {
            return [UIStyle.Text.tertiarySmallRegular()];
        }
        if (this.props.size === UICard.Size.S) {
            return [UIStyle.Text.tertiaryTinyRegular()];
        }
        return [UIStyle.Text.tertiaryCaptionRegular()];
    }

    // Render
    renderAction() {
        const { actionIcon, actionTitle, onActionPress } = this.props;
        if (!onActionPress) return null;
        if (!actionIcon && !actionTitle) return null;

        if (actionIcon && actionTitle) {
            return (
                <UILink
                    iconR={actionIcon}
                    title={actionTitle}
                    onPress={onActionPress}
                    size={this.props.size}
                    style={styles.action}
                />
            );
        }

        if (actionIcon) {
            return (
                <UILink
                    onPress={onActionPress}
                    icon={actionIcon}
                    size={this.props.size}
                    style={styles.action}
                />
            );
        }

        return (
            <UILink
                onPress={onActionPress}
                title={actionTitle}
                size={this.props.size}
                style={styles.action}
            />
        );
    }

    renderBadge() {
        const { badge } = this.props;
        if (!badge) return null;
        return (
            <UIBadge
                badge={badge}
                textStyle={UIStyle.Text.tertiaryTinyBold()}
                style={UIColor.getBackgroundColorStyle(UIColor.whiteLight())}
            />
        );
    }

    renderData() {
        const { data } = this.props;
        if (!data) return null;
        return (<Text style={this.getDataStyle()}>{data}</Text>);
    }

    renderSecondary() {
        const { secondary } = this.props;
        if (!secondary) return null;
        return (<Text style={this.getSecondaryStyle()}>{secondary}</Text>);
    }

    renderLabel() {
        const { label } = this.props;
        return (<Text style={this.getLabelStyle()}>{label}</Text>);
    }

    renderCaption() {
        const { caption } = this.props;
        if (!caption) return null;
        return (<Text style={this.getCaptionStyle()}>{caption}</Text>);
    }

    renderLabelIcon() {
        const { labelIcon } = this.props;
        if (!labelIcon) return null;
        const d = this.getLabelIconSize();
        return (
            <Image
                source={labelIcon}
                style={[styles.lableIcon, { width: d, height: d }]}
            />
        );
    }

    renderLeft(hasRight: boolean) {
        return (
            <View style={[
                { flex: hasRight ? 2 : 1 },
                UIStyle.Height.full(),
                UIStyle.Common.flexRow(),
                UIStyle.Common.alignCenter(),
            ]}
            >
                {this.renderLabelIcon()}
                <View style={[UIStyle.Common.flex(), UIStyle.Common.justifyCenter()]}>
                    {this.renderLabel()}
                    {this.props.size !== UICard.Size.XS && this.renderCaption()}
                </View>
            </View>
        );
    }

    renderRight() {
        let right = null;
        if (this.props.size === UICard.Size.XS && this.props.caption) {
            right = this.renderCaption();
        } else {
            const secondary = this.renderSecondary();
            const data = this.renderData();
            const badge = this.renderBadge();
            const action = this.renderAction();
            if (secondary || data || badge || action) {
                right = (
                    <View style={[
                        UIStyle.Height.full(),
                        UIStyle.Common.flexRow(),
                        UIStyle.Common.alignCenter()]}
                    >
                        <View style={[UIStyle.Common.alignEnd()]}>
                            {secondary}
                            {data}
                            {badge}
                        </View>
                        {action}
                    </View>);
            }
        }

        if (!right) return null;
        return (
            <View style={[
                UIStyle.Common.flex(),
                UIStyle.Height.full(),
                UIStyle.Common.justifyCenter(),
                UIStyle.Common.alignEnd(),
            ]}
            >
                {right}
            </View>
        );
    }

    isRow() {
        return (this.props.direction === UICard.Direction.Row);
    }

    renderContent() {
        const { style, direction } = this.props;
        const backgroundStyle = this.getBackgroundStyle();
        const right = this.renderRight();
        const left = this.renderLeft(right !== null);

        return (
            <View style={[
                { height: this.getHeight() },
                UIStyle.Common.flexRow(),
                UIStyle.Common.justifySpaceBetween(),
                UIStyle.Common.alignCenter(),
                backgroundStyle,
                style,
            ]}
            >
                {left}
                {right}
            </View>
        );
    }

    render() {
        return super.render();
    }


    static defaultProps: Props;
}

UICard.defaultProps = {
    label: 'Label',
    labelIcon: null,
    caption: null,
    secondary: null,
    style: null,
    onCardPress: null,
    onPress: null,

    actionIcon: null,
    actionTitle: null,
    onActionPress: null,

    size: UICard.Size.M,
    direction: UICard.Direction.Row,
};
