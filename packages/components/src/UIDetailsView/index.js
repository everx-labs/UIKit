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
    reversed: boolean,
    onPress: ?() => void,
    style: ViewStyleProp,
    containerStyle: ViewStyleProp,
    textColor: ? TextStyleProp,
    textRole: ?TextStyleProp,
    textStyle: ViewStyleProp,
    commentsStyle: ViewStyleProp,
    disabled?: boolean,
    selectable?: boolean,
};

type State = {};

export default class UIDetailsView extends UIComponent<Props, State> {
    static defaultProps: Props = {
        value: '',
        comments: '',
        reversed: false,
        onPress: null,
        style: {},
        containerStyle: {},
        textColor: undefined,
        textRole: undefined,
        textStyle: {},
        commentsStyle: {},
        selectable: true,
    };

    // Render
    renderValue() {
        const {
            value, textStyle, textColor, textRole, onPress, disabled, testID, selectable,
        } = this.props;
        let color = UILabelColors.TextPrimary;
        let role = onPress ? UILabelRoles.ActionCallout : UILabelRoles.ParagraphNote;
        if (disabled) {
            color = UILabelColors.TextTertiary;
            role = UILabelRoles.ParagraphFootnote;
        }
        return (
            <UILabel
                color={textColor || color}
                role={textRole || role}
                selectable={selectable}
                style={textStyle}
                testID={testID || null}
            >
                {value}
            </UILabel>
        );
    }

    renderComment() {
        const { comments, commentsStyle, commentTestID } = this.props;
        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphFootnote}
                style={[UIStyle.margin.topTiny(), commentsStyle]}
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
        const {
            onPress, testID, containerStyle, style,
        } = this.props;
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
