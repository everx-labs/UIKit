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
    actionRight: {
        paddingRight: 0,
    },
    actionLeft: {
        paddingLeft: 0,
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
    @default UICard.Direction.Row
    */
    direction?: ?string,
    /**
    For UICard.Direction.Column only. Position of image, one of: UICard.LabelIconPosition.Top, UICard.LabelIconPosition.Bottom
    @default UICard.LabelIconPosition.Top
    */
    labelIconPositionV?: string,
    /**
    For UICard.Direction.Column only. Position of image, one of: UICard.LabelIconPosition.Left, UICard.LabelIconPosition.Right
    @default UICard.LabelIconPosition.Left
    */
    labelIconPositionH?: string,
};

type State = ActionState & {
  columns: number,
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
    static LabelIconPosition = {
        Top: 'top',
        Left: 'left',
        Right: 'right',
        Bottom: 'bottom',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: 6,
        };
    }

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
        if (this.isRow()) {
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

        if (this.props.size === UICard.Size.S) {
            return 40;
        }
        if (this.props.size === UICard.Size.M) {
            return 48;
        }
        // L
        return 88;
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
        if (this.isRow()) {
            if (this.props.size === UICard.Size.L) {
                if (!this.props.data) { return [UIStyle.Text.primaryAccentRegular()]; }
                return [UIStyle.Text.secondaryBodyRegular()];
            }
            return [UIStyle.Text.secondarySmallRegular()];
        }

        // Column
        if (this.props.size === UICard.Size.L || this.props.size === UICard.Size.S) {
            return [UIStyle.Text.secondarySmallRegular()];
        }
        // M
        return [UIStyle.Text.secondaryBodyRegular()];
    }

    getDataStyle() {
        // Column
        if (!this.isRow()) return [UIStyle.Text.quaternaryCaptionRegular()];

        // Row
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
        if (this.isRow()) {
            if (this.props.size === UICard.Size.L) {
                return [UIStyle.Text.secondaryBodyMedium()];
            }
            return [UIStyle.Text.secondarySmallMedium()];
        }

        // Column
        if (this.props.size === UICard.Size.S) {
            return [UIStyle.Text.secondarySmallMedium()];
        }
        if (this.props.size === UICard.Size.M) {
            return [UIStyle.Text.secondaryBodyMedium()];
        }
        // L
        return [UIStyle.Text.tertiaryTinyMedium()];
    }

    getCaptionStyle() {
        if (this.isRow()) {
            if (this.props.size === UICard.Size.XS) {
                return [UIStyle.Text.tertiarySmallRegular()];
            }
            if (this.props.size === UICard.Size.S) {
                return [UIStyle.Text.tertiaryTinyRegular()];
            }
            return [UIStyle.Text.tertiaryCaptionRegular()];
        }

        // Column
        if (this.props.size === UICard.Size.S) {
            return [UIStyle.Text.tertiaryTinyMedium()];
        }
        if (this.props.size === UICard.Size.M) {
            return [UIStyle.Text.tertiaryCaptionRegular()];
        }
        // L
        return [UIStyle.Text.primaryAccentMedium()];
    }

    // Render
    renderAction() {
        const { actionIcon, actionTitle, onActionPress } = this.props;
        if (!onActionPress) return null;
        if (!actionIcon && !actionTitle) return null;

        const linkSize = this.props.size === UICard.Size.XS ? UICard.Size.S : this.props.size;
        const linkStyle = this.isRow() ? styles.actionRight : styles.actionLeft;
        const textAlign = this.isRow() ? null : UILink.TextAlign.Left;

        if (actionIcon && actionTitle) {
            return (
                <UILink
                    iconR={actionIcon}
                    title={actionTitle}
                    onPress={onActionPress}
                    size={linkSize}
                    style={linkStyle}
                    textAlign={textAlign}
                />
            );
        }

        if (actionIcon) {
            return (
                <UILink
                    onPress={onActionPress}
                    icon={actionIcon}
                    size={linkSize}
                    style={linkStyle}
                    textAlign={textAlign}
                />
            );
        }

        return (
            <UILink
                onPress={onActionPress}
                title={actionTitle}
                size={linkSize}
                style={linkStyle}
                textAlign={textAlign}
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
        const { label, labelIcon, size } = this.props;
        const isTopIconedColumn = labelIcon && !this.isRow() && size !== UICard.Size.L;
        const iconSpaceStyle = isTopIconedColumn ? UIStyle.Margin.topSmall() : null;
        return (<Text style={[this.getLabelStyle(), iconSpaceStyle]}>{label}</Text>);
    }

    renderCaption() {
        const { caption } = this.props;
        if (!caption) return null;
        return (<Text style={[this.getCaptionStyle(), UIStyle.Margin.topTiny()]}>{caption}</Text>);
    }

    renderLabelIcon() {
        const { labelIcon } = this.props;
        if (!labelIcon) return null;
        const d = this.getLabelIconSize();
        return (
            <Image
                source={labelIcon}
                style={[this.isRow() ? styles.lableIcon : null, { width: d, height: d }]}
            />
        );
    }

    getColumnWidth() {
        if (this.props.size === UICard.Size.S) return 90;
        if (this.props.size === UICard.Size.M) return 124;
        if (this.props.size === UICard.Size.L) return 296;
        return 124;
    }

    getColumnHeight() {
        if (this.props.size === UICard.Size.S) return 168;
        if (this.props.size === UICard.Size.M) return 208;
        if (this.props.size === UICard.Size.L) return 192;
        return 208;
    }

    renderColumnL() {
        const secondary = this.renderSecondary();
        const action = this.renderAction();
        const labelIcon = this.renderLabelIcon();
        const label = this.renderLabel();
        const caption = this.renderCaption();

        const top = (
            <View>
                {label}
                {caption}
            </View>
        );
        const bottom = (
            <View style={[
                secondary && !action ?
                    { paddingBottom: UIConstant.contentOffset() } :
                    null,
            ]}
            >
                {secondary}
                {action}
            </View>
        );
        const right = (
            <View style={[UIStyle.Common.flex(), UIStyle.Common.alignEnd()]}>
                {labelIcon}
            </View>
        );

        const onGridLayout = () => {
            this.setStateSafely({ columns: this.grid.getColumns() });
        };

        return (
            <UIGrid
                type={UIGrid.Type.C6}
                gutter={0}
                ref={(grid) => { this.grid = grid; }}
                onLayout={onGridLayout}
            >
                <UIGridColumn medium={(this.state.columns / 3) * 2}>{top}</UIGridColumn>
                <UIGridColumn medium={this.state.columns / 3}>{right}</UIGridColumn>
                <UIGridColumn medium={this.state.columns} style={UIStyle.Margin.topGreat()} />
                <UIGridColumn medium={this.state.columns}>{bottom}</UIGridColumn>
            </UIGrid>
        );
    }

    renderColumnM() {
        const { labelIconPositionV, labelIconPositionH } = this.props;
        const secondary = this.renderSecondary();
        const action = this.renderAction();
        const data = this.renderData();
        const labelIcon = this.renderLabelIcon();
        const label = this.renderLabel();
        const caption = this.renderCaption();

        const labelIconData = data ? (
            <View style={[
                UIStyle.Common.flexRow(),
                UIStyle.Common.justifySpaceBetween(),
            ]}
            >
                {labelIcon}
                {data}
            </View>
        ) : (
            <View style={[
                labelIconPositionH === UICard.LabelIconPosition.Left ?
                    UIStyle.Common.alignStart() :
                    UIStyle.Common.alignEnd()]}
            >
                {labelIcon}
            </View>
        );

        if (action || secondary || data) {
            return (
                <View style={[
                    UIStyle.Common.flex(),
                    UIStyle.Common.justifySpaceBetween(),
                    { paddingBottom: secondary ? UIConstant.contentOffset() : 0 },
                ]}
                >
                    <View>
                        {labelIconData}
                        <View style={action || secondary ? null : UIStyle.Margin.topGreat()}>
                            {label}
                            {caption}
                        </View>
                    </View>
                    {action || secondary}
                </View>
            );
        }

        const isImgBottom = labelIconPositionV === UICard.LabelIconPosition.Bottom;
        const isImgTop = labelIconPositionV === UICard.LabelIconPosition.Top;
        const isImgRight = labelIconPositionH === UICard.LabelIconPosition.Right;
        const isImgLeft = labelIconPositionH === UICard.LabelIconPosition.Left;
        const content = (
            <View>
                {label}
                {caption}
            </View>
        );
        return (
            <View style={[
                UIStyle.Common.flex(),
                UIStyle.Common.justifySpaceBetween(),
                { paddingBottom: UIConstant.contentOffset() },
            ]}
            >
                {isImgBottom ?
                    content : isImgRight ?
                        labelIconData :
                        <View>
                            {labelIconData}
                            {caption}
                        </View>
                }
                {isImgBottom ? labelIconData : isImgRight ? content : label}
            </View>
        );
    }

    renderColumnS() {
        const labelIcon = this.renderLabelIcon();
        const label = this.renderLabel();
        const caption = this.renderCaption();

        return (
            <React.Fragment>
                {labelIcon}
                {label}
                {caption}
            </React.Fragment>
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

    renderRow() {
        const { style } = this.props;
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

    renderColumn() {
        const { style } = this.props;
        const backgroundStyle = this.getBackgroundStyle();
        const minWidth = this.getColumnWidth();
        const minHeight = this.getColumnHeight();

        const column = (this.props.size === UICard.Size.S) ?
            this.renderColumnS() : (this.props.size === UICard.Size.M) ?
                this.renderColumnM() :
                this.renderColumnL();

        return (
            <View style={[
                { minHeight, minWidth },
                { paddingTop: UIConstant.contentOffset() },
                backgroundStyle,
                style,
            ]}
            >
                {column}
            </View>
        );
    }

    renderContent() {
        if (this.isRow()) return this.renderRow();
        return this.renderColumn();
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
    labelIconPositionH: UICard.LabelIconPosition.Left,
    labelIconPositionV: UICard.LabelIconPosition.Top,
};
