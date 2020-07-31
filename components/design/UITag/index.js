// @flow
import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UIActionComponent from '../../UIActionComponent';
import UIStyle from '../../../helpers/UIStyle';
import UITooltip from '../../notifications/UITooltip';

import type { ActionProps, ActionState } from '../../UIActionComponent';


const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    titleFont: {
        ...UIFont.tinyBold(),
    },
    // web-only style
    tooltipContainerStyle: {
        padding: UIConstant.mediumContentOffset(),
        width: 'auto',
    },
});

export type Props = ActionProps & {
    /** tag container style
     @default null
     */
    style?: ViewStyleProp,
    /** One of:
     UITag.tagColor.default,
     UITag.tagColor.black,
     UITag.tagColor.green,
     UITag.tagColor.red,
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

type State = ActionState;

const tagHeight = 24;

export default class UITag extends UIActionComponent<Props, State> {
    static tagColor = {
        default: 'default',
        black: 'black',
        green: 'green',
        red: 'red',
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
    getTagHeightStyle() {
        return { height: tagHeight };
    }

    getTagRadius() {
        return { borderRadius: tagHeight / 2.0 };
    }

    getTagColorStyle() {
        const { tagColor } = this.props;

        let color;
        switch (tagColor) {
        case UITag.tagColor.black:
            color = '#20262A';
            break;
        case UITag.tagColor.green:
            color = '#228007';
            break;
        case UITag.tagColor.red:
            color = '#CE0014';
            break;
        default:
            color = '#F5F5F5';
            break;
        }

        return { backgroundColor: color };
    }

    getTitleFont() {
        return styles.titleFont;
    }

    getTitleColorStyle() {
        const { tagColor } = this.props;
        let color;
        switch (tagColor) {
        case UITag.tagColor.black:
            color = UIColor.white();
            break;
        case UITag.tagColor.green:
            color = UIColor.white();
            break;
        case UITag.tagColor.red:
            color = UIColor.white();
            break;
        default:
            color = '#20262A';
            break;
        }

        return { color };
    }

    // Actions

    // render
    renderTitle() {
        const { title, titleStyle } = this.props;

        return (
            <Text
                key="tagTitle"
                style={[
                    this.getTitleFont(),
                    this.getTitleColorStyle(),
                    titleStyle,
                ]}
            >
                {title}
            </Text>
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
                    styles.container,
                    this.getTagHeightStyle(),
                    this.getTagColorStyle(),
                    this.getTagRadius(),
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
