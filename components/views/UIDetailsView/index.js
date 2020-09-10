// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIComponent from '../../UIComponent';
import UILabel from '../../text/UILabel';
import UIFunction from '../../../helpers/UIFunction';
import type { LabelRoleValue } from '../../text/UILabel';

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
    value: any,
    comments: string,
    reversed: boolean,
    onPress: ?() => void,
    style: ViewStyleProp,
    containerStyle: ViewStyleProp,
    textRole: ?LabelRoleValue,
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
        textRole: undefined,
        textStyle: {},
        commentsStyle: {},
        selectable: true,
    };

    // Render
    renderValue() {
        const {
            value, textStyle, textRole, onPress, disabled, testID, selectable,
        } = this.props;
        let role = onPress ? UILabel.Role.SmallMedium : UILabel.Role.SmallRegular;
        if (disabled) {
            role = UILabel.Role.CaptionTertiary;
        }
        return (
            typeof value === 'string' || typeof value === 'number' ? (
                <UILabel
                    testID={testID || null}
                    style={textStyle}
                    role={textRole || role}
                    text={`${value}`}
                    selectable={selectable}
                />
            ) : (
                <View>
                    {value}
                </View>
            )
        );
    }

    renderComment() {
        const { comments, commentsStyle, commentTestID } = this.props;
        return (
            <UILabel
                testID={commentTestID || null}
                style={[UIStyle.margin.topTiny(), commentsStyle]}
                role={UILabel.Role.CaptionTertiary}
                text={comments}
            />
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
