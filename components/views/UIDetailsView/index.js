// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';

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
    value: string | number,
    comments: string,
    reversed: boolean,
    onPress: ?() => void,
    containerStyle: StylePropType,
    textStyle: StylePropType,
    commentsStyle: StylePropType,
};

type State = {};

export default class UIDetailsView extends UIComponent<Props, State> {
    // Render
    renderValue() {
        const { value, textStyle, onPress } = this.props;
        return (
            <UILabel
                style={textStyle}
                role={onPress ? UILabel.Role.SmallMedium : UILabel.Role.SmallRegular}
                text={`${value}`}
            />
        );
    }

    renderComment() {
        const { comments, commentsStyle } = this.props;
        return (
            <UILabel
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

    static defaultProps: Props;
}

UIDetailsView.defaultProps = {
    value: '',
    comments: '',
    reversed: false,
    onPress: null,
    containerStyle: {},
    textStyle: {},
    commentsStyle: {},
};
