import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { StyleSheet, View } from 'react-native';

import UIDetailsView from '../../text/UIDetailsView';
import UIToggle from '../UIToggle';
import UIConstant from '../../../helpers/UIConstant';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    detailsView: {
        flex: 1,
    },
    toggle: {
        marginLeft: UIConstant.smallContentOffset(),
        marginTop: UIConstant.normalContentOffset(),
    },
});

export default class UIDetailsToggle extends Component {
    // Render
    renderDetailsView() {
        const {
            active, details, comments, onPress,
        } = this.props;
        return (<UIDetailsView
            containerStyle={styles.detailsView}
            value={details}
            comments={comments}
            onPress={() => onPress(!active)}
        />);
    }

    renderToggle() {
        const { active, onPress } = this.props;
        return (<UIToggle
            containerStyle={styles.toggle}
            active={active}
            onPress={() => onPress(!active)}
        />);
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                {this.renderDetailsView()}
                {this.renderToggle()}
            </View>
        );
    }
}

UIDetailsToggle.defaultProps = {
    containerStyle: {},
    details: '',
    comments: '',
    active: false,
    onPress: () => {},
};

UIDetailsToggle.propTypes = {
    containerStyle: StylePropType,
    details: PropTypes.string,
    comments: PropTypes.string,
    active: PropTypes.bool,
    onPress: PropTypes.func,
};
