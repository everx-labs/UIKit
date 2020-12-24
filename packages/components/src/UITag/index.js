// @flow
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIColor, UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import { UIActionComponent } from '../UIActionComponent';
import type {
    UIActionComponentProps,
    UIActionComponentState,
} from '../UIActionComponent';
import UITooltip from '../UITooltip';

const tagHeight = 24;

const styles = StyleSheet.create({
    container: {
        height: tagHeight,
        borderRadius: tagHeight / 2.0,
        overflow: 'hidden',
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    // web-only style
    tooltipContainerStyle: {
        padding: UIConstant.mediumContentOffset(),
        width: 'auto',
    },
});

export type Props = UIActionComponentProps & {
    /** tag container style
     @default null
     */
    style?: ViewStyleProp,
    /** One of:
     UITag.tagColor.default,
     UITag.tagColor.black,
     UITag.tagColor.green,
     UITag.tagColor.red,
     UITag.tagColor.blue,
     @default UITag.tagColor.default
     */
    tagColor?: string,
    /** @ignore */
    theme?: string,
    /** @default 'uiTag' */
    testID?: string,
    /** Visible tag title
     @default ''
     */
    title?: string,
    /** Tag title style
     @default null
     */
    titleStyle?: TextStyleProp,
    /** tooltip title
     @default ''
     */
    tooltip?: string,
};

type State = UIActionComponentState;

export default class UITag extends UIActionComponent<Props, State> {
    static tagColor = {
        default: 'default',
        black: 'black',
        green: 'green',
        red: 'red',
        blue: 'blue',
    };

    static defaultProps: Props = {
        ...UIActionComponent.defaultProps,
        style: null,
        tagColor: UITag.tagColor.default,
        theme: UIColor.Theme.Light,
        testID: 'uiTag',
        title: '',
        titleStyle: null,
        tooltip: '',
    };

    // Events
    // Virtual
    onEnter = () => {
        const webStyle = (
            Platform.OS === 'web' ?
                styles.tooltipContainerStyle :
                null
        );
        if (this.props.tooltip) {
            UITooltip.showOnMouseForWeb(this.props.tooltip, webStyle);
        }
    };

    onLeave = () => {
        if (this.props.tooltip) {
            UITooltip.hideOnMouseForWeb();
        }
    };

    // Getters
    getTagColor() {
        const { tagColor } = this.props;

        let color;
        switch (tagColor) {
        case UITag.tagColor.black:
            color = UIColor.tagBlack();
            break;
        case UITag.tagColor.green:
            color = UIColor.tagGreen();
            break;
        case UITag.tagColor.red:
            color = UIColor.tagRed();
            break;
        case UITag.tagColor.blue:
            color = UIColor.tagBlue();
            break;
        default:
            color = UIColor.tagDefault();
            break;
        }

        return color;
    }

    getTitleColor() {
        const { tagColor } = this.props;

        if (tagColor === UITag.tagColor.default) {
            return UILabelColors.TextPrimary;
        }

        return UILabelColors.TextPrimaryInverted;
    }

    // Actions

    // Render
    renderTitle() {
        const { title, titleStyle } = this.props;

        return (
            <UILabel
                color={this.getTitleColor()}
                key={`tagTitle:${title}`}
                role={UILabelRoles.HeadlineLabel}
                style={titleStyle}
            >
                {title}
            </UILabel>
        );
    }

    renderContent() {
        const { style } = this.props;

        return (
            <View
                style={[
                    UIStyle.common.alignCenter(),
                    UIStyle.common.justifyCenter(),
                    UIStyle.common.alignSelfCenter(),
                    UIStyle.color.getBackgroundColorStyle(this.getTagColor()),
                    styles.container,
                    style,
                ]}
            >
                {this.renderTitle()}
            </View>
        );
    }

    render() {
        return super.render();
    }
}
