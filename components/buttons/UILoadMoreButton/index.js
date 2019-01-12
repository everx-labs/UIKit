import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { MaterialIndicator } from 'react-native-indicators';

import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';

const buttonHeight = 30;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: UIConstant.contentOffset(),
    },
    wrapper: {
        backgroundColor: UIColor.overlay20(),
        alignItems: 'center',
        justifyContent: 'center',
        height: buttonHeight,
        borderRadius: buttonHeight / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'center',
    },
});

export default class UILoadMoreButton extends Component {
    renderIndicator() {
        if (!this.props.isLoadingMore) {
            return null;
        }
        return (<MaterialIndicator style={styles.indicator} color={UIColor.white()} size={20} />);
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle]}
                onPress={() => {
                    if (this.props.onLoadMore) {
                        this.props.onLoadMore();
                    }
                }}
                disabled={this.props.isLoadingMore}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text
                        style={[
                            UIStyle.textSecondaryTinyRegular,
                            this.props.textStyle,
                            { opacity: this.props.isLoadingMore ? 0 : 1 },
                        ]}
                    >
                        {this.props.label}
                    </Text>
                    {this.renderIndicator()}
                </View>
            </TouchableOpacity>
        );
    }
}

UILoadMoreButton.defaultProps = {
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    onLoadMore: () => {},
    isLoadingMore: false,
    label: UILocalized.LoadMore,
};

UILoadMoreButton.propTypes = {
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    onLoadMore: PropTypes.func,
    isLoadingMore: PropTypes.bool,
    label: PropTypes.string,
};
