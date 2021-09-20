// @flow
import React from 'react';
import type { ViewStyleProp, TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { UIConstant, UIStyle, UIFunction } from '@tonlabs/uikit.core';
import { UILabel, UILabelRoles, UILabelColors } from '@tonlabs/uikit.hydrogen';

import UIComponent from '../UIComponent';

const styles = StyleSheet.create({
    container: {
        marginVertical: UIConstant.normalContentOffset(),
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

type Props = {
    testID?: string,
    commentTestID?: string,
    value: string | React$Element<any>,
    comments: string,
    disabled?: boolean,
    reversed: boolean,
    selectable?: boolean,
    onPress: ?() => void,
    textColor: ?TextStyleProp,
    textRole: ?TextStyleProp,
    commentsColor: ?TextStyleProp,
    commentsRole: ?TextStyleProp,
    containerStyle: ViewStyleProp,
    style: ViewStyleProp,
};

type State = {};

export default class UIDetailsView extends UIComponent<Props, State> {
    static defaultProps: Props = {
        value: '',
        comments: '',
        reversed: false,
        selectable: true,
        onPress: null,
        textColor: undefined,
        textRole: undefined,
        commentsColor: undefined,
        commentsRole: undefined,
        containerStyle: {},
        style: {},
    };

    // Render
    renderValue() {
        const { value, textColor, textRole, onPress, disabled, testID, selectable, reversed } =
            this.props;
        let color = UILabelColors.TextPrimary;
        let role = onPress ? UILabelRoles.Action : UILabelRoles.ParagraphText;
        if (disabled) {
            color = UILabelColors.TextTertiary;
            role = UILabelRoles.ParagraphText;
        }
        return (
            <UILabel
                color={textColor || color}
                role={textRole || role}
                selectable={selectable}
                style={reversed ? UIStyle.margin.topTiny() : null}
                testID={testID || null}
            >
                {value}
            </UILabel>
        );
    }

    renderComment() {
        const { comments, commentsColor, commentsRole, commentTestID, reversed } = this.props;
        return (
            <UILabel
                color={commentsColor || UILabelColors.TextTertiary}
                role={commentsRole || UILabelRoles.ParagraphLabel}
                style={reversed ? null : UIStyle.margin.topTiny()}
                testID={commentTestID || null}
            >
                {comments}
            </UILabel>
        );
    }

    renderContentView() {
        if (this.props.reversed) {
            return (
                <View>
                    {this.renderComment()}
                    {this.renderValue()}
                </View>
            );
        }
        return (
            <View>
                {this.renderValue()}
                {this.renderComment()}
            </View>
        );
    }

    render() {
        const { onPress, testID, containerStyle, style } = this.props;
        const Wrapper = onPress ? TouchableOpacity : View;
        const onPressProp: any = { onPress };
        const testIDProp = testID ? { testID } : null;
        return (
            <Wrapper
                {...testIDProp}
                {...onPressProp}
                style={UIFunction.combineStyles([
                    (styles.container: ViewStyleProp),
                    containerStyle,
                    style,
                ])}
            >
                {this.renderContentView()}
            </Wrapper>
        );
    }
}
