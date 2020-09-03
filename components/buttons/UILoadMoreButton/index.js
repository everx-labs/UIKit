// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { MaterialIndicator } from 'react-native-indicators';

import UIComponent from '../../UIComponent';

import UILabel from '../../text/UILabel';

import UIColor from '../../../helpers/UIColor';
import UIConstant from '../../../helpers/UIConstant';
import UILocalized from '../../../helpers/UILocalized';
import UIStyle from '../../../helpers/UIStyle';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: UIConstant.contentOffset(),
    },
    wrapper: {
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: UIColor.backgroundTertiary(),
        height: UIConstant.smallCellHeight(),
        borderRadius: UIConstant.smallCellHeight() / 2,
        paddingVertical: UIConstant.tinyContentOffset() / 2,
        paddingHorizontal: UIConstant.smallContentOffset(),
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'center',
    },
});

type Props = {
    containerStyle: ViewStyleProp,
    wrapperStyle: ViewStyleProp,
    textStyle: ViewStyleProp,
    onLoadMore: () => void,
    isLoadingMore: boolean,
    label: string,
}

type State = {
    //
}

export default class UILoadMoreButton extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        wrapperStyle: {},
        textStyle: {},
        onLoadMore: () => {},
        isLoadingMore: false,
        label: UILocalized.LoadMore,
    };

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
                    <UILabel
                        role={UILabel.Role.TinyRegular}
                        style={[
                            UIStyle.color.getColorStyle(UIColor.textTertiary()),
                            this.props.textStyle,
                            { opacity: this.props.isLoadingMore ? 0 : 1 },
                        ]}
                        text={this.props.label}
                    />
                    {this.renderIndicator()}
                </View>
            </TouchableOpacity>
        );
    }
}
