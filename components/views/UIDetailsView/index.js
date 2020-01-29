// @flow
import React from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import UIConstant from '../../../helpers/UIConstant';
import UIComponent from '../../UIComponent';
import UILabel from '../../text/UILabel';


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
    value: string | number,
    comments: string,
    reversed: boolean,
    onPress: ?() => void,
    containerStyle: ViewStyleProp,
    textStyle: ViewStyleProp,
    commentsStyle: ViewStyleProp,
    disabled?: boolean,
};

type State = {};

export default class UIDetailsView extends UIComponent<Props, State> {
    static defaultProps: Props = {
        value: '',
        comments: '',
        reversed: false,
        onPress: null,
        containerStyle: {},
        textStyle: {},
        commentsStyle: {},
    };

    // Render
    renderValue() {
        const {
            value, textStyle, onPress, disabled, testID,
        } = this.props;
        let role = onPress ? UILabel.Role.SmallMedium : UILabel.Role.SmallRegular;
        if (disabled) {
            role = UILabel.Role.CaptionTertiary;
        }
        return (
            <UILabel
                testID={testID || null}
                style={textStyle}
                role={role}
                text={`${value}`}
            />
        );
    }

    renderComment() {
        const { comments, commentsStyle, commentTestID } = this.props;
        return (
            <UILabel
                testID={commentTestID || null}
                style={commentsStyle}
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
        const { onPress, testID, containerStyle } = this.props;
        const Wrapper = onPress ? TouchableOpacity : View;
        const onPressProp: any = { onPress };
        const testIDProp = testID ? { testID } : null;
        return (
            <Wrapper
                {...testIDProp}
                {...onPressProp}
                style={[styles.container, containerStyle]}
            >
                {this.renderContentView()}
            </Wrapper>
        );
    }
}
